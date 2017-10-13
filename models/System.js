var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var systemSchema = new mongoose.Schema({
    system_id: Number,
    system_name: String,
    security_status: Number,
    added_by: String
}, schemaOptions);

// systemSchema.options.toJSON = {
//     transform: function(doc, ret, options) {
//         delete ret.user_id;
//     }
// };

var System = mongoose.model('System', systemSchema);

module.exports = System;
