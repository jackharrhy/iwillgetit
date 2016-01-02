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

app.get('/iwillgetit/', function(req, res){
	res.render('index');
});

app.get('/iwillgetit/otto', function(req, res){
	res.render('otto');
});
app.post('/iwillgetit/otto', function(req, res){
	console.log(req.body);
	io.sockets.emit('card', req.body);
	res.render('otto');
});

app.get('*', function(req, res){
	res.send('Error');
});

var io = require('socket.io').listen(app.listen(4000));

io.sockets.on('connection', function (socket) {
	socket.on('thing', function (data) {
		//io.sockets.emit('thing', data);
	});
});

console.log('= iwillgetit running on port 4000 =');
