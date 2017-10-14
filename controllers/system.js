var async = require('async');
var moment = require('moment');
var request = require('request');
var System = require('../models/System');
var User = require('../models/User');
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
           if(!system_object.solarsystem){
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
                done(null, system);
            });
        },
        function (system, done) {
            var our_systems = system;
            request(api_root + '/universe/system_kills/?datasource=tranquility', function (error, response) {
                var system_stats;
                if (error) {
                    res.status(400).send({msg: 'Error getting system information'});
                } else {
                    system_stats = JSON.parse(response.body);
                    //TODO Clean this up, it sucks.
                    var response_systems = [];
                    system_stats.filter(function(system){
                        for(var index in our_systems){
                            var filtered_object = {};
                            if(our_systems[index].system_id == system.system_id){
                                filtered_object.system_name = our_systems[index].system_name;
                                filtered_object.security_status = our_systems[index].security_status;
                                filtered_object.ship_kills = system.ship_kills;
                                filtered_object.npc_kills = system.npc_kills;
                                filtered_object.pod_kills = system.pod_kills;
                                response_systems.push(filtered_object);
                            }
                        }
                        return null;
                    });
                    done(null, res.status(200).send(response_systems));
                }
            });
        }
    ]);
};