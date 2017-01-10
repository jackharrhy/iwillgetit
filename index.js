var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 

app.use(express.static(__dirname + '/static'));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.engine('pug', require('pug').__express);

app.get('/', function(req, res){
	res.render('index');
});

app.get('/thetrick', function(req, res){
	res.render('thetrick');
});
app.post('/thetrick', function(req, res){
	console.log(req.body);
	io.sockets.emit('card', req.body);
	res.render('thetrick');
});

app.get('*', function(req, res){
	res.send('Error');
});
var io = require('socket.io').listen(app.listen(7575));

io.sockets.on('connection', function (socket) {});

console.log('iwillgetit running on port 7575');
