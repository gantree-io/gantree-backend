const mongoose = require('mongoose')
const path = require('path')
const NetworkSchema = require('@schemas/network')
const Node = require('./node')
const Provider = require('./provider')
const Binary = require('./binary')
const Hotwire = require('@util/hotwire')
const Gantree = require('@util/gantree')
const TeamStorage = require('@util/teamstorage')

// model
const Network = mongoose.model('network', NetworkSchema)

// add a new network
Network.add = async (
  platform,
  {
    config_version,
    project_id,
    nickname,
    binary_args,
    node_args_list,
    chainspec,
    // team, // gotten from team_id
    status
  },
  // {
  //   provider,
  //   count
  // },
  team_id
) => {
  const ts = new TeamStorage(team_id)

  // add binary to DB
  const binary = await Binary.add(
    binary_args
    // method: method,
    // repository_method: repository_method,
    // fetch_method: fetch_method,
    // local_method: local_method,
    // preset_method: preset_method,
    // filename: filename
  )

  const binary_url = binary.url // TEMPORARY
  const binary_name = binary.filename // TEMPORARY
  const binary_opts = [] // TEMPORARY: NEEDS TO BE TAKEN ON PER-NODE BASIS

  // get provider credentials
  const creds = await Provider.findOne({ _id: provider, team: team_id })

  // add network to DB
  const network = await Network.create({
    config_version: config_version,
    project_id: project_id,
    nickname: nickname,
    binary: binary,
    chainspec: chainspec,
    team: team_id,
    status: status
  })

  // add nodes to DB
  let nodes = await Node.addMultiple({
    node_args_list: node_args_list,
    network_id: network._id
  })

  //////////////////////////////////////////
  // build config, store chainspec,
  // create ssh keys && deploy network
  //////////////////////////////////////////
  try {
    // create a new config
    let config = new Gantree.config(network._id)
    config.binaryUrl = binary_url
    config.binaryName = binary_name
    config.binaryOpts = binary_opts // TODO(Denver): this should be on a per-node basis

    // the chainspec can be one of the following
    // 'new' | Build New Spec | ???
    // 'default' | Use Default Spec | Some default spec provided
    // _id | use custom chainspec from DB
    if (chainspec === 'new') {
      config.useDefaultSpec = false
    } else if (chainspec === 'default') {
      config.useDefaultSpec = true
    } else {
      // get chainspec file
      let _chainspec = await mongoose.models.chainspec.findById(chainspec)
      // resolve path
      let chainspecPath = ts.chainspec.path(_chainspec.file)
      // set file
      config.chainspecPath = chainspecPath
    }

    // create SSH key pair
    let ts_network = ts.useNetwork(network._id)
    let { privateKeyPath } = await ts_network.generateKeys()

    // configure nodes
    Array.apply(null, Array(count)).map((_, i) => {
      config.addNode({
        provider: creds.provider,
        sshPrivateKeyPath: path.resolve(privateKeyPath),
        projectID: network._id
      })
    })

    // save the config file
    let configPath = ts_network.addConfig(config.json)

    const networkAdded = async (e, stdout, stderr) => {
      let status = e || stderr !== '' ? 'ERROR' : 'ONLINE'
      await Node.updateMany({ network: network._id }, { status })
      await Network.findByIdAndUpdate(network._id, { status })
      let _network = await Network.fetchById(network._id, team_id)
      Hotwire.publish(network._id, 'UPDATE', _network)
    }

    // trigger gantree
    Gantree.createNetwork(
      {
        configPath: configPath,
        providerCredentials: JSON.parse(creds.credentials),
        sshPrivateKeyPath: privateKeyPath
      },
      networkAdded
    )
      // return IP addresses on completion
      .then(async (deployed) => {
        // add IP addresses to network nodes
        // IP count should match node count
        // may run into issues when user has ability to
        // provision validator and non-validator nodes
        // together, as need to know which is which

        console.log({ deployed })

        // ideally now we would wait for the substrate telemetry server to come
        // online and start spitting out information about these nodes

        for (var i = 0; i < nodes.length; i++) {
          // update node & publish
          let node = await Node.findOneAndUpdate(
            {
              _id: nodes[i]._id
            },
            {
              ip: deployed[i].IP,
              name: deployed[i].hostName,
              status: 'CONFIGURING'
            },
            {
              new: true
            }
          )
          Hotwire.publish(nodes[i]._id, 'UPDATE', node)
        }

        // update network & publish
        await Network.findByIdAndUpdate(network._id, { status: 'CONFIGURING' })
        let _network = await Network.fetchById(network._id, team_id)
        Hotwire.publish(network._id, 'UPDATE', _network)
      })
      .catch((e) => {
        console.log(e.message)
      })
  } catch (e) {
    // statements
    console.log(e.message)
  }

  console.log({ network })

  Hotwire.publish('NETWORK', 'ADD')

  return Promise.resolve(network)
}

Network.delete = async (_id, team_id) => {
  // delete network from fs
  let ts_network = new TeamStorage(team_id).useNetwork(_id)

  // get creds
  const creds = await Provider.find({ team: team_id })

  // get config path
  let configPath = ts_network.configPath()

  // set network & nodes to SHUTDOWN status
  let network = await Network.findByIdAndUpdate(
    _id,
    { status: 'SHUTDOWN' },
    { new: true }
  )
  await Node.updateMany({ network: _id }, { status: 'SHUTDOWN' })

  // async delete network via gantree
  Gantree.deleteNetwork({
    configPath: configPath,
    allProviderCredentials: creds
  })
    .then(async (result) => {
      await Node.deleteMany({ network: _id })
      await Network.findByIdAndDelete(_id)
      ts_network.delete()
      Hotwire.publish('NETWORK', 'DELETE')
    })
    .catch((e) => {
      console.log(e.message)
    })

  // boom ====> - - -  pew pew
  Hotwire.publish(_id, 'UPDATE', network)

  return true
}

// How do we delete a network that was added via the CLI? We would need to make
// a copy of the chainspec and store it in the teamfiles
Network.addViaCli = async (nodes, config, team_id) => {
  console.log({ nodes, config, team_id })

  // we will probably also break some things regarding the providers, because at
  // the moment if we have any nodes on a provider it won't let us remove the
  // provider credentials, and we're about to create nodes which leverage
  // providers that don't have credentials :/

  // need to loop through the config and pull out everything which has a place
  // in the database.

  // TODO: should this be done elsewhere?
  // destringify stuff
  config = JSON.parse(config, " ", 4) // TODO: probably not ideal to shadow name, revisit in future
  nodes = JSON.parse(nodes, " ", 4) // TODO: probably not ideal to shadow name, revisit in future

  // create network object
  const network = await Network.create({
    status: 'ONLINE',
    project_id: config.metadata.project, // TODO(Denver): should use gcoAL here
    binary_url: config.binary.fetch.url, // TODO(Denver): should use gcoAL here
    binary_name: config.binary.filename, // TODO(Denver): should use gcoAL here
    chainspec: 'new', // TODO: FIXME: what is the significance/usage of this in backend?
    team: team_id
  })

  // // WORKS!
  // Node.add({
  //   name: "greg",
  //   provider: "DO",
  //   ip: "115.28.250.51",
  //   status: 'ONLINE',
  //   config: false,
  //   network: network // use the network just created
  // })

  // create node object(s)
  // shape of nodes: {"cfgIndex":0,"name":"my-node-name","ip":"186.100.33.41"}
  nodes.forEach((node) => {
    // console.log("going to create this node:")
    // console.log(`
    //   name: ${node.name}
    //   provider: ${config.nodes[node.cfgIndex].instance.provider}
    //   ip: ${node.ip}
    //   status: ${'ONLINE'}
    //   validator: ${config.nodes[node.cfgIndex].validator}
    //   network: ${network}
    // `)
    Node.add({
      name: node.name,
      provider: config.nodes[node.cfgIndex].instance.provider, // get from config
      ip: node.ip,
      status: 'ONLINE', // status defaults to online
      config: config.nodes[node.cfgIndex].validator, // get from config
      network: network // use the network just created
    })
  })

  // let nodes = await Node.addMultiple(2, {
  //   network_id: network._id,
  //   validator: true,
  //   provider: 'DO',
  //   status: 'ONLINE'
  // })
}

// Network.fetchStatistics = async (_id) => {
//   const nodes = await Node.fetchByNetwork(network._id)
//   // create a list of ip addresses
//   const ips = []
//   for (let node of nodes) {
//     ips.push(node.ipAddress)
//   }
//   console.log({ ips }) // ["192.", "168."]

//   // construct the request to the prometheus server

//   // hey prometheus, we want you to give us the data that you have on file for
//   // these n ip_addresses, please could you do so. thank you very much.

//   // const response = await fetch(prometheus_server, {ips})

//   // return await response.json()
// }

Network.deleteViaCli = async (_id, team_id) => {
  console.log({ _id, team_id })

  // create network object
  const network = await Network.deleteOne({
    _id: _id,
    team: team_id
  })
}

Network.fetchById = async (_id, team_id) => {
  const network = await Network.findOne({ _id: _id, team: team_id })
  const nodes = await Node.fetchByNetwork(network._id)

  return {
    ...network.toObject(),
    nodes: nodes
  }
}

Network.fetchAllByTeam = async (team_id) => {
  const networks = await Network.find({ team: team_id })
  const _all = []
  for (var i = 0; i < networks.length; i++) {
    let network = await Network.fetchById(networks[i]._id, team_id)
    _all.push(network)
  }
  return _all
}

Network.fetchByProjectId = async (project_id, team_id) => {
  console.log("finding network by project id")

  // TODO(Denver): get platform too
  // const network = await Network.findOne({ project_id: project_id, platform: platform, team: team_id })
  const network = await Network.findOne({ project_id: project_id, team: team_id })

  if (network === null) { return null }

  console.log({ network })
  // const nodes = await Node.fetchByNetwork(network._id) // return networks nodes, probably not wanted in this func

  return {
    ...network.toObject()
  }
}

// /**@param {{test: String, test2: Number}} network_args */

Network.sync = async (project_id, platform, network_args, team_id) => {
  console.log("---- request to sync network! ----")
  console.log({ project_id })
  console.log({ platform })
  console.log({ network_args })
  console.log({ team_id })

  network_args = JSON.parse(network_args)

  // We don't care if network already exists, this is gantree-core's responsibility to know, we overwrite here

  const network = await Network.findOne({ project_id: project_id, team: team_id })

  if (network === null) {
    console.log("creating missing network")
    await Network.add(platform, network_args, team_id)
    return true // TODO(Denver): needs to be changed
  } else {
    console.log("updating existing network")
    return true // TODO(Denver): needs to be changed
  }

  // if (existingNetwork === null) {
  //   console.log("creating a missing network")
  //   // network = await Network.create({
  //   //   status: 'ONLINE',
  //   //   name: config.metadata.project,
  //   //   binary_url: config.binary.fetch.url,
  //   //   binary_name: config.binary.filename,
  //   //   chainspec: 'new', // TODO: FIXME: what is the significance/usage of this in backend?
  //   //   team: team_id,
  //   //   project_id: config.metadata.project,
  //   //   // platform: platform
  //   // })
  //   return true // TODO(Denver): change this
  // } else {
  //   console.log("WIP - updating existing network")
  //   return true // TODO(Denver): change this
  // }
}

module.exports = Network
