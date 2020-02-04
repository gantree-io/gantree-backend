const mongoose = require('mongoose')
const schema = require('./db.schema')
const model = mongoose.model('project', schema)

model.networkList = async (args, owner) => {
	return [
		{
			_id: '111',
			name: '111',
			nodes: [
				{
					_id: '111-1',
					name: '111-1',
					ip: '111-1',
					provider: 'DigitalOcean'
				},
				{
					_id: '111-2',
					name: '111-2',
					ip: '111-2',
					provider: 'AWS'
				}
			]
		},
		{
			_id: '222',
			name: '222',
			nodes: [
				{
					_id: '222-1',
					name: '222-1',
					ip: '222-1',
					provider: 'AWS'
				},
				{
					_id: '222-2',
					name: '222-2',
					ip: '222-2',
					provider: 'GCP'
				}
			]
		}
	]
}

module.exports = model