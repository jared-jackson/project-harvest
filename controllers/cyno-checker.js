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
            character.is_cyno = false;
            if (character.character_id == 0) {
                return res.status(400).send({msg: 'There was an error retrieving cyno details for pilot : ' + character.character_name + '. Try checking the spelling of the pilots name.'});
            } else {
                request(zkill_api + '/losses/characterID/' + character.character_id + '/', function (error, response) {
                    var character_kills = JSON.parse(response.body);
                    if (error) {
                        done(new Error("failed getting this characters kills:" + error.message));
                    } else {
                        for (var kill in character_kills) {
                            for (var items in character_kills[kill].victim.items) {
                                var item_id = character_kills[kill].victim.items[items].item_type_id;
                                if (item_id == 28646) {        //If you want to check for newbie cyno as well : dropped_items[index].item_type_id == 21096 ||
                                    var kill_timestamp = character_kills[kill].killmail_time.replace(/-|T|:|Z/g, "");
                                    kill_timestamp = kill_timestamp.substring(0, 10);
                                    kill_timestamp = kill_timestamp + "00";
                                    character.formatted_kill_time = kill_timestamp;
                                    character.kill_time = character_kills[kill].killmail_time;
                                    character.solar_system = character_kills[kill].solar_system_id;
                                    character.alliance_id = character_kills[kill].victim.alliance_id;
                                    character.victim_id = character_kills[kill].attackers[0].alliance_id;
                                    character.is_cyno = true;
                                    break;
                                }
                            }
                            if (character.is_cyno) {
                                break;
                            }
                        }
                        done(null, character);
                    }
                });
            }
        },
        function (character, done) {
            var drop_info = character;
            request(zkill_api + '/related/' + character.solar_system + '/' + character.formatted_kill_time + '/', function (error, response) {
                var related_kills = JSON.parse(response.body);
                if (error) {
                    done(new Error("Failed getting related kills to the drop:" + error.message));
                } else {
                    drop_info.drop_region = related_kills.regionName || "unknown";
                    drop_info.drop_system = related_kills.systemName || "unknown";
                    drop_info.summary = related_kills.summary || null;
                }
                done(null, res.status(200).send(drop_info));
            });
        }
    ]);
};
