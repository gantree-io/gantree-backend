const mongoose = require('mongoose')
const util = require('./_util');

const schema = new mongoose.Schema(
    {
        path: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: util.timestamps }
)

schema.plugin(require('mongoose-autopopulate'));
schema.set('toJSON', { virtuals: true })

module.exports = schema