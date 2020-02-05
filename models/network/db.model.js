const mongoose = require('mongoose')
const schema = require('./db.schema')
const model = mongoose.model('project', schema)


model.networkList = async (args, owner) => {
	
	await new Promise(r => setTimeout(r, 1500));

	return [
		{
			_id: '111',
			name: 'Ecommerce Network - Prod',
			nodes: [
				{
					_id: '111-1',
					name: '111-1',
					ip: '111-1',
					provider: 'DigitalOcean',
					status: 'ONLINE'
				},
				{
					_id: '111-2',
					name: '111-2',
					ip: '111-1',
					provider: 'DigitalOcean',
					status: 'ONLINE'
				},
				{
					_id: '111-3',
					name: '111-3',
					ip: '111-1',
					provider: 'DigitalOcean',
					status: 'ONLINE'
				},
				{
					_id: '111-4',
					name: '111-4',
					ip: '111-1',
					provider: 'DigitalOcean',
					status: 'ONLINE'
				},
				{
					_id: '111-5',
					name: '111-5',
					ip: '111-2',
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
					name: '222-1',
					ip: '222-1',
					provider: 'AWS',
					status: 'ONLINE'
				},
				{
					_id: '222-2',
					name: '222-2',
					ip: '222-2',
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
					name: '333-1',
					ip: '333-1',
					provider: 'AWS',
					status: 'ONLINE'
				},
				{
					_id: '333-2',
					name: '333-2',
					ip: '333-2',
					provider: 'GCP',
					status: 'PENDING'
				},
				{
					_id: '333-2',
					name: '333-2',
					ip: '333-2',
					provider: 'GCP',
					status: 'PENDING'
				},
				{
					_id: '333-2',
					name: '333-2',
					ip: '333-2',
					provider: 'GCP',
					status: 'PENDING'
				},
				{
					_id: '333-2',
					name: '333-2',
					ip: '333-2',
					provider: 'GCP',
					status: 'PENDING'
				}
			]
		}
	]
}

module.exports = model