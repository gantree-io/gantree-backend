const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        sha256: {
            type: String,
            required: true,
            trim: true,
        }
    },
    { timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema