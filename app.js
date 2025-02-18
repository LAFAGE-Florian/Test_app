var express = require('express');
var app = express();
var path = require('path');

var uuid = require('node-uuid');

var bodyParser = require('body-parser');

//setting assets/static files
app.use(express.static('./public'));

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var users = new Object();

app.post('/users', function(req, res) {
	console.log("Received for add>"+JSON.stringify(req.body));
	var user = req.body;
	var uid = uuid.v1();
	user['uid'] = uid;	
	users[uid]=user;
	console.log("user with id>"+uid+" created!");
	res.setHeader('Location', '/users/' + uid);
	res.status(201).send(null);	
});

app.get('/users', function(req, res) {	
    var keys = Object.keys(users);
	result = keys.map(function(v) { return users[v]; });
    res.json(result);
});

app.get('/users/:id', function(req, res) {	
    var uid = req.params.id;
    if (uid in users) {
    	res.json(users[uid]);
    } else {
    	res.status(404);
    }
});

app.delete('/users/:id', function(req, res){
	var uid = req.params.id;
    if (uid in users) {
    	delete users[uid];
    	console.log("user with id>"+uid+" has been deleted");
    	res.status(200).end();
    } else {
    	res.status(404);
    }
});

app.put('/users', function(req, res) {
	console.log("Receive for update>"+JSON.stringify(req.body));
	var toUpdate = req.body;
	var uid = toUpdate['uid'];
	if (uid in users) {
    	users[uid] = toUpdate;
    	console.log("user with id>"+uid+" has been updated");
    	res.status(200).end();
    } else {
    	res.status(404);
    }	
});

app.listen(8081);