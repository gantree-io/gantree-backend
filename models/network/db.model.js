const mongoose = require('mongoose')
const schema = require('./db.schema')
const model = mongoose.model('project', schema)

model.networkList = async (args, owner) => {
	return [
		{
			_id: '111',
			name: 'Ecommerce Network | Prod',
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
					status: 'OFFLINE'
				},
				{
					_id: '111-5',
					name: '111-5',
					ip: '111-2',
					provider: 'AWS',
					status: 'PENDING'
				}
			]
		},
		{
			_id: '222',
			name: 'Ecommerce Network | Staging',
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
		}
	]
}

module.exports = model