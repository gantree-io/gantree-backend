const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
    {
        ssh_private_key_alias: {
            type: String,
            trim: true,
        },
        ssh_user: {
            type: String,
            required: true,
            trim: true
        },
        provider: {
            type: String,
            required: true,
            trim: true,
            enum: ['DO', 'AWS', 'GCP'],
            // enum: provider_list,
        },
        ip: {
            type: String,
            trim: true
        },
    },
    { timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema