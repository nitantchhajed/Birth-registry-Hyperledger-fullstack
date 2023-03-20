
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
const prometheus = require('prom-client');
const generateUniqueId = require('generate-unique-id');

require('./config.js');
var hfc = require('fabric-client');

var helper = require('./app/helper.js');
var invoke = require('./app/invoke-transaction.js');
// var invoke = require('./app/invoke-offline');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////
const writeLatencyGauge = new prometheus.Gauge({ name: 'write_latency', help: 'latency for write requests' });
const requestCountGauge = new prometheus.Gauge({ name: 'request_count', help: 'requests count' });
const readLatencyGauge = new prometheus.Gauge({ name: 'read_latency', help: 'latency for read requests' });
const queriesCountGauge = new prometheus.Gauge({ name: 'queries_count', help: 'queries count' });
const totalTransaction = new prometheus.Gauge({ name: 'total_transaction', help: 'Counter for total transaction' })
const failedTransaction = new prometheus.Gauge({ name: 'failed_transaction', help: 'Counter for failed transaction' })
const successfulTransaction = new prometheus.Gauge({ name: 'successful_transaction', help: 'counter for successful transaction' })

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));
// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
	secret: 'thisismysecret'
}).unless({
	path: ['/users', '/metrics']
}));
app.use(bearerToken());
app.use(function (req, res, next) {
	logger.debug(' ------>>>>>> new request for %s', req.originalUrl);
	if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/metrics') >= 0) {
		return next();
	}

	var token = req.token;
	jwt.verify(token, app.get('secret'), function (err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function () { });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Register and enroll user
app.post('/users', async function (req, res) {
	var username = req.body.username;
	var orgName = req.body.orgName;
	logger.debug('End point : /users');
	logger.debug('User name : ' + username);
	logger.debug('Org name  : ' + orgName);
	if (!username) {
		res.json(getErrorMessage('\'username\''));
		return;
	}
	if (!orgName) {
		res.json(getErrorMessage('\'orgName\''));
		return;
	}
	var token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
		username: username,
		orgName: orgName
	}, app.get('secret'));
	let response = await helper.getRegisteredUser(username, orgName, true);
	logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
	if (response && typeof response !== 'string') {
		logger.debug('Successfully registered the username %s for organization %s', username, orgName);
		response.token = token;
		res.json(response);
	} else {
		logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
		res.json({ success: false, message: response });
	}

});

// Invoke transaction on chaincode on target peers
app.post('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
	totalTransaction.inc()
	try {
		logger.debug('==================== INVOKE ON CHAINCODE ==================');
		
		var peers = ["peer0.org1.example.com"];
		var chaincodeName = "birthcert";
		var channelName = "mychannel";
		var fcn = "createBirthCert";
		var args = [];
		const id = generateUniqueId();
		console.log("=================================================")
		console.log("id", id);
		console.log("=================================================")

		args.push(id, req.body.name, req.body.place, req.body.time, req.body.gender, req.body.parentName);

		logger.debug('channelName  : ' + channelName);
		logger.debug('chaincodeName : ' + chaincodeName);
		logger.debug('fcn  : ' + fcn);
		logger.debug('args  : ' + args);
		if (!chaincodeName) {
			res.json(getErrorMessage('\'chaincodeName\''));
			return;
		}
		if (!channelName) {
			res.json(getErrorMessage('\'channelName\''));
			return;
		}
		if (!fcn) {
			res.json(getErrorMessage('\'fcn\''));
			return;
		}
		if (!args) {
			res.json(getErrorMessage('\'args\''));
			return;
		}

		const start = Date.now();
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.username, req.orgname);
		const latency = Date.now() - start;

		writeLatencyGauge.inc(latency)
		requestCountGauge.inc()
		successfulTransaction.inc()


		const response_payload = {
			result: message,
			error: null,
			errorData: null
		}
		res.send(response_payload);

	} catch (error) {
		failedTransaction.inc()
		const response_payload = {
			result: null,
			error: error.name,
			errorData: error.message
		}
		res.send(response_payload)
	}
});

// Query on chaincode on target peers
app.get('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
	try {
		logger.debug('==================== QUERY BY CHAINCODE ==================');

		var channelName = req.params.channelName;
		var chaincodeName = req.params.chaincodeName;
		let args = req.query.args;
		let fcn = 'allList';
		let peer = 'peer0.org1.example.com';

		// res.send([{
		// 	'name':"Rahul",
		// 	'place': 'Mumbai',
		// 	'time' : '23 March',
		// 	'gender': 'Male',
		// 	'parentName':'Aniket'
		// },
		// {
		// 	'name':"Rekha",
		// 	'place': 'Mumbai',
		// 	'time' : '40 March',
		// 	'gender': 'Male',
		// 	'parentName':'Neha'
		// }]) 

		if (!chaincodeName) {
			res.json(getErrorMessage('\'chaincodeName\''));
			return;
		}
		if (!channelName) {
			res.json(getErrorMessage('\'channelName\''));
			return;
		}
		if (!fcn) {
			res.json(getErrorMessage('\'fcn\''));
			return;
		}
		if (!args) {
			res.json(getErrorMessage('\'args\''));
			return;
		}
		console.log('args==========', args);
		args = args.replace(/'/g, '"');
		args = JSON.parse(args);
		logger.debug(args);

		const start = Date.now();
		let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
		const latency = Date.now() - start;

		readLatencyGauge.inc(latency)
		queriesCountGauge.inc()

		const response_payload = {
			result: message,
			error: null,
			errorData: null
		}

		var result=[];
		response_payload.result.forEach(item => {
			result.push(item.Record)
		});
		
		res.send(result);


		// console.log(response_payload.result)


	} catch (error) {
		const response_payload = {
			result: null,
			error: error.name,
			errorData: error.message
		}
		res.send(response_payload)
	}
});

app.get('/getchannels', async function (req, res) {
	try {
		logger.debug('==================== QUERY BY CHAINCODE ==================');

		var channelName = req.params.channelName;
		var chaincodeName = req.params.chaincodeName;
		var args = req.query.args;
		var fcn = req.query.fcn;
		var peer = req.query.peer;

		console.log("eq.params", req.params);
		console.log("req.query", req.query)

		res.send([{
			'name':"Rahul",
			'place': 'Mumbai',
			'time' : '23 March',
			'gender': 'Male',
			'parentName':'Aniket'
		},
		{
			'name':"Rekha",
			'place': 'Mumbai',
			'time' : '40 March',
			'gender': 'Male',
			'parentName':'Neha'
		}]) 

	} catch (error) {
		const response_payload = {
			result: null,
			error: error.name,
			errorData: error.message
		}
		res.send(response_payload)
	}
});

app.post('/addData', async function(req, res){

	console.log("req.body", req)
	console.log("req.body", req.body);
	
	
	
	res.send(args);
	

})

//api for Prometheus
app.get('/metrics', (req, res) => {
	res.set('Content-Type', prometheus.register.contentType);
	res.end(prometheus.register.metrics());
});



module.exports = app
