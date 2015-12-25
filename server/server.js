var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res){
	res.render('index');
});

app.get('*', function(req, res){
	res.send('Error');
});

var io = require('socket.io').listen(app.listen(4000));

io.sockets.on('connection', function (socket) {
	socket.emit('init', true);
	socket.on('thing', function (data) {
		//io.sockets.emit('thing', data);
	});
});
