var async = require('async');
var moment = require('moment');
var parseString = require('xml2js').parseString;
var request = require('request');
var User = require('../models/User');
var api_root = 'https://esi.tech.ccp.is/latest';
var legacy_api_root = 'http://api.eve-online.com/eve';
var zkill_api = 'https://zkillboard.com/api';
request.json = true;

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
};

exports.checkCynoPilot = function (req, res) {
    req.assert('character_name', 'You must select enter a player name to check for cyno').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    var character_name = req.body.character_name;

    async.waterfall([
        function (done) {
            request(legacy_api_root + '/CharacterID.xml.aspx?names=' + character_name, function (error, response) {
                var character = {};
                if (error) {
                    done(new Error("failed getting something system ID:" + error.message));
                } else {
                    parseString(response.body, function (err, result) {
                        var parsed_id = JSON.stringify(result.eveapi.result[0].rowset[0].row[0].$.characterID).replace(/['"]+/g, '');
                        character.character_id = parseInt(parsed_id);
                        character.character_name = character_name;
                    });
                }
                done(null, character);
            });
        },
        function (character, done) {
            if (character.character_id == 0) {
                return res.status(400).send({msg: 'There was an error retrieving cyno details for pilot : ' + character.character_name + '. Try checking the spelling of the pilots name.'});
            } else {
                var is_cyno = false;
                request(zkill_api + '/losses/characterID/' + character.character_id + '/', function (error, response) {
                    var status = response.statusCode;
                    var character_kills = JSON.parse(response.body);
                    if (error) {
                        done(new Error("failed getting this characters kills:" + error.message));
                    } else {
                        character_kills.map(function (kill) {
                            var dropped_items = kill.victim.items;
                            for (var index in dropped_items) {
                                if (dropped_items[index].item_type_id == 28646) { //If you want to check for newbie cyno as well : dropped_items[index].item_type_id == 21096 ||
                                    is_cyno = true;
                                }
                            }
                        });
                        done(null, res.status(status).send(is_cyno));
                    }
                });
            }
        }
    ]);
};
