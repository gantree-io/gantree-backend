const mongoose = require('mongoose')
const BinarySchema = require('@schemas/binary');

const validate_method = ({ method, repository_method, fetch_method, local_method, preset_method }) => {
  methods = {
    repository: repository_method,
    fetch: fetch_method,
    local: local_method,
    preset: preset_method
  }
  const method_options = methods[method]
  if (method_options !== undefined) { return true }
  throw new Error(`method '${method}' options missing`)
}

// model
const Binary = mongoose.model('binary', BinarySchema)

// Binary.fetchByNetwork = async network_id => await Binary.find({ network: network_id })

Binary.add = async ({ method, repository_method, fetch_method, local_method, preset_method, filename }, team_id) => {
  await validate_method({ method, repository_method, fetch_method, local_method, preset_method })

  return await Binary.create({
    method: method,
    repository_method: repository_method,
    fetch_method: fetch_method,
    local_method: local_method,
    preset_method: preset_method,
    filename: filename,
    team: team_id
  })
}

module.exports = Binary
