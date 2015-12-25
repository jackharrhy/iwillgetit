var frame = -1;

var scn = new DivSugar.Scene().setSize(400,250).setImage('#f9f9f9').appendTo(document.getElementById('header')),
	rotNode = new DivSugar.Node().setPosition(200,125,0).appendTo(scn),
	textNode = new DivSugar.Node().setSize(400,125).setPosition(-200,-75,0).appendTo(rotNode);

textNode.div.innerHTML = '<h1>jackharrhy</h1><h2>i make stuff</h2>';

var task = new DivSugar.Task().appendTo(DivSugar.rootTask);
task.onUpdate = function() { rotNode.rotate(0, this.deltaTime * 0.005, this.deltaTime * 0.0025); };

var io = socket();
var socketConnection = false;

io.on('init', function() {
	socketConnection = true;
});
