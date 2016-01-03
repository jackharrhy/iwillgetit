var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	  extended: true
})); 

app.use(express.static(__dirname + '/static'));

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res){
	console.log(req.url);
	res.render('index');
});

app.get('/otto', function(req, res){
	console.log(req.url);
	res.render('otto');
});
app.post('/otto', function(req, res){
	console.log(req.url);
	console.log(req.body);
	io.sockets.emit('card', req.body);
	res.render('otto');
});

app.get('*', function(req, res){
	console.log(req.url);
	res.send('Error');
});
var io = require('socket.io').listen(app.listen(7575));

io.sockets.on('connection', function (socket) {});

console.log('= iwillgetit running on port 7575 =');
