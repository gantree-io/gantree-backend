const { exec, execSync } = require('child_process');

// when we switch the backend to use the nodejs-lib we will hopefully be able
// to pull the available presets from the lib
const presets = {
	'https://github.com/paritytech/polkadot/releases/download/v0.7.22/polkadot': {
		name: 'polkadot-0.7.22'
	},
	'https://substrate-node-bins.sgp1.digitaloceanspaces.com/edgeware-3.0.1-CompiledByFlex': {
		name: 'edgeware-3.0.1'
	},
	'https://github.com/paritytech/polkadot/releases/download/v0.7.28/polkadot': {
		name: 'westend-0.7.28'
	}
}

const createNode = {
	GCP: (name, sshPrivateKeyPath, binaryOptions) => ({
		"name": name.substr(0, 18),
		"validator": true,
		"binaryOptions": {
			"loggingFilter": "sync=trace,afg=trace,babe=debug",
			"telemetry": true,
			"substrateOptions": binaryOptions
		},
		"instance": {
			"provider": "gcp",
			"type": "n1-standard-2",
			"deletionProtection": false,
			"zone": "us-east1-b",
			"region": "us-east1",
			"sshUser": "root",
			"sshPrivateKeyPath": sshPrivateKeyPath,
			"projectId": 'gantree-dashboard'
		}
	}),
	DO: (name, sshPrivateKeyPath, binaryOptions) => ({
		"name": name.substr(0, 18),
		"validator": true,
		"binaryOptions": {
			"loggingFilter": "sync=trace,afg=trace,babe=debug",
			"telemetry": true,
			"substrateOptions": binaryOptions
		},
		"instance": {
			"provider": "do",
			"size": "s-1vcpu-1gb",
			"zone": "nyc3",
			"sshUser": "root",
			"sshPrivateKeyPath": sshPrivateKeyPath
		}
	}),
	AWS: (name, sshPrivateKeyPath, binaryOptions) => ({
		"name": name.substr(0, 18),
		"validator": true,
		"binaryOptions": {
			"loggingFilter": "sync=trace,afg=trace,babe=debug",
			"telemetry": true,
			"substrateOptions": binaryOptions
		},
		"instance": {
			"provider": "aws",
			"type": "m4.large",
			"zone": "eu-central-1",
			"location": "eu-central-1",
			"sshUser": "ubuntu",
			"sshPrivateKeyPath": sshPrivateKeyPath
		}
	}),
}

class Config {

	_projectName
	_binaryUrl
	_binaryName
	_binaryOpts = []
	_chainspecPath
	_useDefaultChainspec
	_nodes = []

	constructor(name){
		this.projectName = name
	}

	addNode(){

	}

	set projectName(name){
		// spec = no longer than 24 characters
		this._projectName = `gantree-${name}`.substring(0, 24)
	}

	set binaryUrl(url){
		// TODO test for other git providers (BB public and GitLab)
		if (presets[url]) {
			this._binaryType = 'preset'
			this._presetName = presets[url].name
		}else if(/^https:\/\/github.com\/(.*)/.test(url)){
			this._binaryUrl = url
			this._binaryType = 'repository'
		}else{
			this._binaryUrl = url
			this._binaryType = 'fetch'
		}
	}

	set binaryName(name){
		this._binaryName = name
	}

	set binaryOpts(opts=[]){
		this._binaryOpts = opts
	}

	set chainspecPath(path){
		this._chainspecPath = path
	}

	set useDefaultSpec(path){
		this._useDefaultChainspec = path
	}

	addNode({provider, sshPrivateKeyPath, projectID}){
		let node = createNode[provider](`node-${this._nodes.length + 1}-${projectID}`, sshPrivateKeyPath, this._binaryOpts)
		this._nodes.push(node)
	}

	get json(){
		// validate config
		this.validate()

		const json = {
			"metadata": {
				"project": this._projectName,
				"version": '2.0'
			},
			"binary": {
				"filename": this._binaryName,
				"useBinChainSpec": this._useDefaultChainspec,
			},
			"nodes": this._nodes
		}

		if (this._binaryType === 'preset') {
			json.binary = { "preset": this._presetName }
		} else if (this._binaryType === 'repository') {
			const repository = {
				url: this._binaryUrl,
				version: 'HEAD' // default, might change in future
			}
			json.binary.repository = repository
		} else {
			const fetch = {
				url: this._binaryUrl
			}
			json.binary.fetch = fetch
		}

		return json
	}

	validate(){
		const errors = []
		if(!this._projectName) errors.push('Name must be defined')
		if(!this._binaryUrl && !this._presetName) errors.push('Binary URL must be defined')
		if(!this._binaryName) errors.push('Binary Name must be defined')
		if(!this._chainspecPath && this._useDefaultChainspec === null) errors.push('chainspecPath or useDefaultSpec must be defined')
		if(!this._nodes.length) errors.push('Nodes have not been configured')
		// throw errors
		if(errors.length) throw new Error(errors.join(', '))
	}
}

const mockResult = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(`
			Outputs:

			ip_address = [
			  "157.245.3.6",
			  "167.172.239.49",
			]

			2020-02-28T05:21:39.071Z [Gantree] (cmd) info: Executing: terraform output -json ip_address, {"verbose":true,"cwd":"ii"}
			["157.245.3.6","167.172.239.49"]
			2020-02-28T05:21:39.245Z [Gantree] (sync) info: Platform result: {"validatorIpAddresses":[["157.245.3.6","167.172.239.49"]]}
			!!!NODE_IP_ADDRESSES ==> [["157.245.3.${Math.floor(Math.random() * 255)}","167.172.239.${Math.floor(Math.random() * 255)}"]]
			2020-02-28T05:21:39.248Z [Gantree] (sync) info: Done syncing platform (terraform)
			2020-02-28T05:21:39.248Z [Gantree] (sync) info: Syncing application... (ansible)
			2020-02-28T05:21:39.254Z [Gantree] (ansible) info: Preparing nodes with version 8b6fe66
			2020-02-28T05:21:39.302Z [Gantree] (cmd) info: Executing: ansible-playbook main.yml -f 30 -i "ii", {"cwd":"ii","verbose":true}

			PLAY [all] *********************************************************************
			....DONE

			TASK [wait for machine and ssh] ************************************************
			ok: [157.245.3.6]
			ok: [167.172.239.49]

			PLAY [all] *********************************************************************

			TASK [Gathering Facts] *********************************************************
			.....DONE
			ok: [157.245.3.6]
			ok: [167.172.239.49]

			TASK [validator-env-gantree : create group: subgroup] **************************
			....DONE
			changed: [167.172.239.49]
			changed: [157.245.3.6]

			TASK [validator-env-gantree : add user subuser] ********************************
			....DONE
			changed: [157.245.3.6]
			changed: [167.172.239.49]

			PLAY RECAP *********************************************************************
			157.245.3.6                : ok=59   changed=32   unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
			167.172.239.49             : ok=31   changed=17   unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
			localhost                  : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

			2020-02-28T06:02:38.366Z [Gantree] (sync) info: Done syncing application (ansible)`.replace(/\t/g, ''))
	}, 5000)
});

const mockDelete = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(`///// clean complete`)
	}, 3000)
});

const handleError = _e => {
	console.log("----ERROR!----")
	console.log("----STDOUT----")
	console.log(_e.stdout.toString())
	console.log("----STDERR----")
	console.log(_e.stderr.toString())
	console.log(`----EXIT CODE [ ${_e.status.toString()} ]----`)
}

const createNetwork = async ({configPath, providerCredentials, sshPrivateKeyPath}, onFinish) => {

	// map all provider credentails to env vars
	Object.keys(providerCredentials).map(name => {
	process.env[name] = providerCredentials[name]
	})

	process.env['SSH_ID_RSA_VALIDATOR'] = sshPrivateKeyPath;
	process.env['GANTREE_CONFIG_PATH'] = configPath

	let result

	try {
		// mock a network configure
		if(process.env.MOCK_CLI === 'true'){
			result = await mockResult()
		}
		// configure network
		else{
			// execSync(`ssh-add -D`, {stdio: 'inherit'})
			// execSync(`ssh-add ${sshPrivateKeyPath}`, {stdio: 'inherit'})
			const cmd = `npx -q -p gantree-core@${process.env['GANTREE_CORE_VERSION']} gantree-cli sync`;
			execResult = exec(cmd, onFinish)
			return new Promise((resolve, reject) => {
				let rejectTimer = setTimeout(() => reject('Gantree CLI Timeout'), 300000)
				execResult.stdout.on('data', (data) => {
					console.log(data)
					const hasIpAddresses = /!!!NODE_IP_ADDRESSES ==> (.*)/g.exec(data)
					if (hasIpAddresses) {
						console.log({parsed: JSON.parse(hasIpAddresses[1])})
						clearTimeout(rejectTimer)
						resolve(JSON.parse(hasIpAddresses[1]))
					}
				})
			})
		}
	} catch (error) {
		console.log({error})
		handleError(error)
	}
}

const deleteNetwork = async ({configPath, allProviderCredentials}) => {
	for (let creds of allProviderCredentials) {
		const providerCredentials = JSON.parse(creds.credentials)
		Object.keys(providerCredentials).map(name => {
			process.env[name] = providerCredentials[name]
		})
	}
	process.env['GANTREE_CONFIG_PATH'] = configPath
	try {
		// mock a network configure
		if(process.env.MOCK_CLI === 'true'){
			result = await mockDelete()
			return Promise.resolve(result)
		}
		// configure network
		else{
			const cmd = `npx -q -p gantree-core@${process.env['GANTREE_CORE_VERSION']} gantree-cli clean`;
			console.log({cmd})
			return new Promise((resolve, reject) => {
				result = exec(cmd, (e, stdout, stderr) => {
					if (!e) return resolve(stdout)
					reject(e)
				})
				result.stdout.on('data', (data) => {
					console.log(data)
				})
			})
		}
	} catch (error) {
		console.log({error})
		handleError(error)
	}
}

module.exports = {
	createNetwork,
	deleteNetwork,
	config: Config
}