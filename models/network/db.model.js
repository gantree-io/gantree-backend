const mongoose = require('mongoose')
const schema = require('./db.schema')
const model = mongoose.model('project', schema)
const _ = require('lodash');

const placeholderNetworks = [
	{
		_id: '111',
		name: 'Ecommerce Network - Prod',
		nodes: [
			{
				_id: '111-1',
				name: 'Node 1',
				ip: '123.45.67.89',
				provider: 'DigitalOcean',
				status: 'ONLINE'
			},
			{
				_id: '111-2',
				name: 'Node 2',
				ip: '123.45.67.89',
				provider: 'DigitalOcean',
				status: 'ONLINE'
			},
			{
				_id: '111-3',
				name: 'Node 3',
				ip: '123.45.67.89',
				provider: 'DigitalOcean',
				status: 'ONLINE'
			},
			{
				_id: '111-4',
				name: 'Node 4',
				ip: '123.45.67.89',
				provider: 'DigitalOcean',
				status: 'ONLINE'
			},
			{
				_id: '111-5',
				name: 'Node 5',
				ip: '123.45.67.89',
				provider: 'AWS',
				status: 'ONLINE'
			}
		]
	},
	{
		_id: '222',
		name: 'Ecommerce Network - Staging',
		nodes: [
			{
				_id: '222-1',
				name: 'Node 1',
				ip: '123.45.67.89',
				provider: 'AWS',
				status: 'ONLINE'
			},
			{
				_id: '222-2',
				name: 'Node 2',
				ip: '123.45.67.89',
				provider: 'GCP',
				status: 'OFFLINE'
			}
		]
	},
	{
		_id: '333',
		name: 'Ecommerce Network - Dev',
		nodes: [
			{
				_id: '333-1',
				name: 'Node 1',
				ip: '123.45.67.89',
				provider: 'AWS',
				status: 'ONLINE'
			},
			{
				_id: '333-2',
				name: 'Node 2',
				ip: '123.45.67.89',
				provider: 'GCP',
				status: 'PENDING'
			},
			{
				_id: '333-2',
				name: 'Node 3',
				ip: '123.45.67.89',
				provider: 'GCP',
				status: 'PENDING'
			},
			{
				_id: '333-2',
				name: 'Node 4',
				ip: '123.45.67.89',
				provider: 'GCP',
				status: 'PENDING'
			},
			{
				_id: '333-2',
				name: 'Node 5',
				ip: '123.45.67.89',
				provider: 'GCP',
				status: 'OFFLINE'
			}
		]
	}
]

model.nodeList = async (networkId) => {
	await new Promise(r => setTimeout(r, 500));
	return _.find(placeholderNetworks, {_id: networkId}).nodes
}

model.networkList = async (args) => {
	//await new Promise(r => setTimeout(r, 1500));
	return placeholderNetworks
}

module.exports = model