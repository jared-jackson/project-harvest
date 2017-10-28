var async = require('async');
var moment = require('moment');
var request = require('request');
var System = require('../models/System');
var User = require('../models/User');
var api_root = 'https://esi.tech.ccp.is/latest';
var zkill_api = 'https://zkillboard.com/api';
var options = {
    url: "",
    json: true,
    headers: {'User-Agent': 'request'}
};

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
            if (!system_object.solarsystem) {
                return res.status(400).send({msg: 'There was an error parsing the System ID'});
            } else {
                var system_id = system_object.solarsystem[0];
                request(api_root + '/universe/systems/' + system_id + '/?datasource=tranquility&language=en-us', function (error, response) {
                    var new_system_object = JSON.parse(response.body);
                    if (error) {
                        done(new Error("failed getting something system ID:" + error.message));
                    }
                    done(null, new_system_object);
                });
            }
        },
        function (system_object, done) {
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

exports.getSystems = function (req, res) {
    async.waterfall([
        function (done) {
            System.find({}, function (err, system) {
                var systems_array = system.map(function (system) {
                    return system;
                });
                done(null, systems_array);
            });
        },
        function (system, done) {
            var our_systems_ids = system;
            options.url = zkill_api + '/kills/regionID/10000003/';  //Hardcoded to Vale of The Silent
            request(options, function (error, response) {
                var region_stats = response.body;
                var found = region_stats.filter(function (el) {
                    var relevant_systems = {};
                    for(var id in our_systems_ids){
                        if(our_systems_ids[id].system_id === el.solar_system_id){
                            relevant_systems = el;
                            relevant_systems.system_name = our_systems_ids[id].system_name;
                            return relevant_systems;
                        }
                    }
                });
                done(null, res.status(200).send(found));
            });
        }
    ]);
};