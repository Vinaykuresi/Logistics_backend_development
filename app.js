var express = require('express');
var app = express();
var db = require('./db');
var verifyToken = require('./auth/VerifyToken')
var getDevices = require('./__CONCOX__db_transactions/GetDevices')
var getLocations = require('./__CONCOX__db_transactions/GetLocations')
var Gethalts = require('./__CONCOX__db_transactions/GetHalt')

global.__root   = __dirname + '/'; 

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

app.get('/getDevices', verifyToken, function (req, res) {
  getDevices.getDevices().then((result) => res.status(200).json(result),(error) => res.status(502).json({error:"Failed to fetch"})).catch(err => res.status(500).json({error:"Failed to fetch"}))
});

app.get('/getLocations/:deviceId/:page?', verifyToken, function (req, res) {
  getLocations.getLocations(req.params.deviceId, req.params.page).then((result) => res.status(200).json(result),(error) => res.status(502).json({error:"Failed to fetch"})).catch(err => res.status(500).json({error:"Failed to fetch"}))
});

app.get('/getHalts/:deviceId', verifyToken, function (req, res) {
  new Gethalts().haltStatus(req.params.deviceId).then((result) => res.status(200).json(result),(error) => res.status(502).json({error:"Failed to fetch"})).catch(err => res.status(500).json({error:"Failed to fetch"}))
});

module.exports = app;