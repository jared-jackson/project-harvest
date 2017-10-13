var async = require('async');
var moment = require('moment');
var request = require('request');
var Grow = require('../models/Grow');
var User = require('../models/User');
var uuid = require('uuid/v1');


exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
};

exports.createGrow = function (req, res) {
    req.assert('grow_name', 'Name cannot be blank').notEmpty();
    req.assert('grow_items', 'You are wanting to grow what type of plant?').notEmpty();
    //TODO add some additional form validation
    var user_id = req.user.id;

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    User.findOne({_id: user_id}, function (err, grow) {
        if (!grow) {
            return res.status(400).send({msg: 'The email address you have entered is already associated with another account.'});
        }
        grow = new Grow({
            user_id: user_id,
            grow_id: uuid(),
            grow_name: req.body.grow_name,
            environment: "Indoors",
            grow_items:[{
                plant_name: "test",
                plant_id: uuid(),
                plant_vitals:[Math.random() , Math.random(), Math.random(), Math.random(),Math.random(), Math.random(), Math.random()]
            }]
        });
        grow.save(function (err) {
            if(err){
                res.status(400).send({msg: 'The email address you have entered is already associated with another account.'});
            } else {
                res.status(200).send({msg: 'New Grow has been Saved'});
            }
        });
    });
};

exports.getGrows = function (req, res) {
    var user_id = req.user.id;
    Grow.find({user_id: user_id}, function (err, grows) {
        if (!grows) {
            return res.status(400).send({msg: 'The email address you have entered is already associated with another account.'});
        } else {
            res.status(200).send(grows);
        }
    });
};

