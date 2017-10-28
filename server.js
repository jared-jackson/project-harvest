var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var async = require('async');
var request = require('request');

// Load environment variables from .env file
dotenv.load();

// Models
var User = require('./models/User');
var System = require('./models/System');

// Controllers
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var systemController = require('./controllers/system');
var cynoController = require('./controllers/cyno-checker');

var app = express();

//Socket.IO Initialization
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Database Initialization
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function () {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.isAuthenticated = function () {
        var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            return false;
        }
    };

    if (req.isAuthenticated()) {
        var payload = req.isAuthenticated();
        User.findById(payload.sub, function (err, user) {
            req.user = user;
            next();
        });
    } else {
        next();
    }
});

app.post('/contact', contactController.contactPost);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset/:token', userController.resetPost);
// app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
// app.post('/auth/facebook', userController.authFacebook);
// app.get('/auth/facebook/callback', userController.authFacebookCallback);
// app.post('/auth/google', userController.authGoogle);
// app.get('/auth/google/callback', userController.authGoogleCallback);
// app.post('/auth/twitter', userController.authTwitter);
// app.get('/auth/twitter/callback', userController.authTwitterCallback);

//System Routes
app.post('/newSystem', userController.ensureAuthenticated, systemController.newSystem);
app.get('/getSystems', userController.ensureAuthenticated, systemController.getSystems);

//Cyno Checker Routes
app.post('/checkCynoPilot', userController.ensureAuthenticated, cynoController.checkCynoPilot);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.get('*', function (req, res) {
    res.redirect('/#' + req.originalUrl);
});


var clients = {};
dashboard = io.of('dashboard');
dashboard.on('connection', function (socket) {
    console.log('Client ' + socket.id + ' is connected');
    clients[socket.id] = true;
    var requestLoop;

    var zkill_api = 'https://zkillboard.com/api';
    var options = {
        url: "",
        json: true,
        headers: {'User-Agent': 'request'}
    };

    System.find({}, function (err, system) {
        var systems_array = system.map(function (system) {
            return system;
        });
        options.url = zkill_api + '/kills/regionID/10000003/';  //Hardcoded to Vale of The Silent
        requestLoop = setInterval(function () {
            request(options, function (error, response) {
                var region_stats = response.body;
                var found = region_stats.filter(function (el) {
                    var relevant_systems = {};
                    for (var id in systems_array) {
                        if (systems_array[id].system_id === el.solar_system_id) {
                            relevant_systems = el;
                            relevant_systems.system_name = systems_array[id].system_name;
                            relevant_systems.last_updated = Date(Date.now()).toLocaleString();
                            return relevant_systems;
                        }
                    }
                });
                socket.emit("getInsights", found);
            });
        }, 25000);
    });

    // Goodbye client!
    socket.on('disconnect', function () {
        console.log("disconnected: dashboard, id: " + socket.id);
        clearInterval(requestLoop);
        //TODO we need to remove the client ID from stack

    });

});

// Production error handler
if (app.get('env') === 'production') {
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}

// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });

http.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});


//Keep Program from terminating on exception being thrown
process.on('uncaughtException', function (err) {
    console.log(err); //TODO log exceptions being thrown better. This is NOT how you're supposed to do it.
});


module.exports = app;


