var async = require('async');
var moment = require('moment');
var request = require('request');
var System = require('../models/System');
var User = require('../models/User');
var uuid = require('uuid/v1');
var q = require('q');

var api_root = 'https://esi.tech.ccp.is/latest';
request.json = true;
exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
};

exports.newSystem = function (req, res) {
    req.assert('system_name', 'You must select a system to monitor').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    var user_id = req.user.id;
    var system_name = req.body.system_name;
    async.waterfall([
        function (done) {
            request(api_root + '/search/?categories=solarsystem&datasource=tranquility&language=en-us&search=' + system_name + '&strict=true', function (error, response) {
                var system_object;
                if (error) {
                    done(new Error("failed getting something system ID:" + error.message));
                } else {
                    system_object = JSON.parse(response.body);
                }
                done(null, system_object);
            });
        },
        function (system_object, done) {
            var system_id = system_object.solarsystem[0]; //Only one system is ever returned. Duplicate systems are nonexistant
            request(api_root + '/universe/systems/' + system_id + '/?datasource=tranquility&language=en-us', function (error, response) {
                var new_system_object = JSON.parse(response.body);
                if (error) {
                    done(new Error("failed getting something system ID:" + error.message));
                }
                done(null, new_system_object);
            });
        },
        function (system_object, done) {


            console.log(system_object);
            console.log(req.user);

            System.findOne({system_id: system_object.system_id}, function (err, system) {
                if (system) {
                    return res.status(400).send({msg: 'This system is already being monitored'});
                }
                system = new System({
                    system_id: system_object.system_id,
                    system_name: system_object.name,
                    security_status: system_object.security_status,
                    added_by: req.user.name
                });
                system.save(function (err) {
                    if (err) {
                        res.status(400).send({msg: 'There was an error saving ' + system_object.name + 'to the dashboard'});
                    } else {
                        res.status(200).send({msg: 'New System has been saved to the Dashboard'});
                    }
                });
            });

        }
    ]);
};

exports.getSystem = function (req, res) {
    // var user_id = req.user.id;
    // Grow.find({user_id: user_id}, function (err, grows) {
    //     if (!grows) {
    //         return res.status(400).send({msg: 'The email address you have entered is already associated with another account.'});
    //     } else {
    //         res.status(200).send(grows);
    //     }
    // });
};

