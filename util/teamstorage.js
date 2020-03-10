const fs = require('fs')
const del = require('del')
const md5 = require('md5')
const { generateKeyPairSync } = require('crypto');

const createDir = dir => {
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir, { recursive: true });
	}
}

/*
	TeamStorage ----
	TeamStorage allows for programatic creation, access and removal of local 
	files (chainspecs, network configs & keys) relating to a particular team, 
	based on folder structure
	
	examples: 

	- init a new TS instance
	let ts = new TeamStorage(team_id)
	
	- set a chainspec & return filename
	let chainspec_filename = ts.chainspec.set(name, content)

	- use a network
	let network = ts.useNetwork(network_id)

	- generate network keys
	let keys = network.generateKeys()

	- add a config & return path
	let config_path = network.addConfig(config)
*/
class TeamStorage{
	
	constructor(team_id){
		if(!team_id) throw new Error('Team ID must be defined')
		// define the storage root path
		this.root = `${process.env.TEAMSTORAGE_ROOT||'.'}/_teamfiles/${team_id}`
		// create root dir if !exist
		createDir(this.root)
		return this
	}

	chainspec = {
		set: ({name, content}) => {
			// make sure we have a chainspecs dir for this team
			let dir = `${this.root}/chainspecs`
			createDir(dir)

			// set filename/path
			let filename = `${name}.json`
			let path = `${dir}/${filename}`
			
			// check file doesn't exist
			if (fs.existsSync(path)) throw new Error('Config file already exists with this name')
			
			// write file
			fs.writeFileSync(path, content)
			
			//return filename
			return filename
		},
		get: (name, {asJson}) => {
			let content = fs.readFileSync(`${this.root}/chainspecs/${name}`, 'utf8')
			return asJson === true
				? JSON.parse(content)
				: content
		},
		delete: name => fs.unlinkSync(`${this.root}/chainspecs/${name}`),
		path: name =>  `${this.root}/chainspecs/${name}`
	}

	useNetwork(id) {
		if(!id) throw new Error('Network ID must be defined')

		// create network dir
		const dir = `${this.root}/networks/${id}`
		const publickey_path = `${dir}/id_rsa.pub`
		const privatekey_path = `${dir}/id_rsa`
		const config_path = `${dir}/config.json`
		
		// create network dir if none exists
		createDir(dir)

		return {
			// generate a key-pair for this network
			// return current if already exist
			generateKeys: () => {

				if (fs.existsSync(publickey_path) && fs.existsSync(privatekey_path)){
					return this.useNetwork(id).getKeys()
				}
				
				const { publicKey, privateKey } = generateKeyPairSync('rsa', {
					modulusLength: 4096,
					publicKeyEncoding: {
						type: 'spki',
						format: 'pem'
					},
					privateKeyEncoding: {
						type: 'pkcs8',
						format: 'pem',
					}
				});
				
				// save keys
				fs.writeFileSync(publickey_path, publicKey)
				fs.writeFileSync(privatekey_path, privateKey)

				return this.useNetwork(id).getKeys()
			},
			// get network keys
			getKeys: () => {
				return {
					publicKey: fs.readFileSync(publickey_path, 'utf8').replace(/(\r\n|\n|\r)/gm, ""),
					privateKey: fs.readFileSync(privatekey_path, 'utf8').replace(/(\r\n|\n|\r)/gm, "")
				}
			},
			// add a config file to this network
			addConfig: config => {
				// do we need to chck if config already exists??
				// probably not... just rebuild?
				fs.writeFileSync(config_path, JSON.stringify(config))
				return config_path
			},
			delete: () => del.sync(dir, {force: true}),
			configPath: () => config_path
		}
	}
}

module.exports = TeamStorage