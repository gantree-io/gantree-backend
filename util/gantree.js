const { execSync } = require('child_process');

const createNode = {
	GCP: (name, sshKey, projectID) => ({
		"name": name,
		"provider": "gcp",
		"machineType": "n1-standard-2",
		"deletionProtection": false,
		"zone": "us-east1-b",
		"region": "us-east1",
		"sshUser": "root",
		"sshKey": sshKey,
		"projectId": projectID
	}),
	DO: (name, sshKey) => ({
		"name": name,
		"provider": "do",
		"machineType": "c-4",
		"zone": "nyc3",
		"sshUser": "root",
		"sshKey": sshKey
	}),
	AWS: (name, sshKey) => ({
		"name": name,
		"provider": "aws",
		"machineType": "m4.large",
		"zone": "eu-central-1",
		"location": "eu-central-1",
		"sshUser": "ubuntu",
		"sshKey": sshKey
	}),
}

class Config {

	_projectName
	_binaryUrl
	_binaryName
	_chainspecPath
	_useDefaultSpec
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
		if(/^https:\/\/github.com\/(.*)/.test(url)){
			this._binaryUrl = url
		}else{
			throw new Error('Binary URL must be an HTTPS github repo ending in .git')
		}
	}

	set binaryName(name){
		this._binaryName = name
	}

	set chainspecPath(path){
		this._chainspecPath = path
	}

	set useDefaultSpec(path){
		this._useDefaultSpec = path
	}

	addNode({provider, sshKey, projectID}){
		let node = createNode[provider](`node-${this._nodes.length + 1}`, sshKey, projectID)
		this._nodes.push(node)
	}

	get json(){
		// validate config
		this.validate()

		return {
			"project": this._projectName, /// to be defined
			"binary": {
				"url": this._binaryUrl, // to be defined
				"version": "HEAD", // leave as 'HEAD'
				"name": this._binaryName, // to be defined
			},
			"validators": {
				"loggingFilter": "sync=trace,afg=trace,babe=debug", // leave as is
				"telemetry": true, // leave as is
				"chainspecPath": this._chainspecPath, // path to local chainspec 
				"useDefaultSpec": this._useDefaultSpec, // 
				"nodes": this._nodes
			}
		}
	}

	validate(){
		const errors = []
		if(!this._projectName) errors.push('Name must be defined')
		if(!this._binaryUrl) errors.push('Binary URL must be defined')
		if(!this._binaryName) errors.push('Binary Name must be defined')
		if(!this._chainspecPath && this._useDefaultSpec === null) errors.push('chainspecPath or useDefaultSpec must be defined')
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
			!!!VALIDATOR_IP_ADDRESSES ==> [["157.245.3.${Math.floor(Math.random() * 255)}","167.172.239.${Math.floor(Math.random() * 255)}"]]
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

const createNetwork = async ({configPath, providerCredentails, sshPrivateKey}) => {

	// map all provider credentails to env vars
	Object.keys(providerCredentails).map(name => {
		process.env[name] = providerCredentails[name]
	})

 	process.env['SSH_ID_RSA_VALIDATOR'] = sshPrivateKey;

 	let result

	try {
		// mock a network configure
		if(process.env.MOCK_CLI === 'true'){
			result = await mockResult()
		}
		// configure network
		else{
			const cmd = `gantree-cli sync --config ${configPath}`;
			result = execSync(cmd).toString()
		}
	} catch (error) {
		handleError(error)
	}

	return result
}

const deleteNetwork = async ({configPath}) => {

	try {
		// mock a network configure
		if(process.env.MOCK_CLI === 'true'){
			result = await mockDelete()
		}
		// configure network
		else{
			const cmd = `gantree-cli sync clean -c ${configPath}`;
			result = execSync(cmd).toString()
		}
	} catch (error) {
		handleError(error)
	}

	return result
}

module.exports = {
	createNetwork,
	deleteNetwork,
	config: Config
}