var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var growSchema = new mongoose.Schema({
    user_id: String,
    grow_id: String,
    grow_name: String,
    environment: String,
    grow_items:{type:[{
        plant_name: String,
        plant_id: String,
        plant_vitals: {type:[Number]}
    }]}
}, schemaOptions);

growSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret.user_id;
    }
};

var Grow = mongoose.model('Grow', growSchema);

module.exports = Grow;
