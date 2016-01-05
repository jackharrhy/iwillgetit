function numToCard() {
	var suit; toTake = 0;
	if(i < 13) {
		suit = 'clubs';
	} else if(i < 26) {
		suit = 'diamonds';
		toTake = 13;
	} else if(i < 39) {
		suit = 'hearts';
		toTake = 26;
	} else {
		suit = 'spades';
		toTake = 39;
	}

	return [suit, toTake];
}

function cardToNum(suit, num) {
	var toAdd = 0;
	if(suit === 'diamonds') {
		toAdd = 13;
	} else if(suit === 'hearts') {
		toAdd = 26;
	} else if(suit === 'spades') {
		toAdd = 39;
	}

	return toAdd + parseInt(num);
}

function randInt(min, max) {
	return Math.floor(Math.random() * max) + min;
}

function newQuestion() {
	var qNum  = randInt(0, questions.length);
	$('#questions').empty().delay(300 + randInt(0,800)).fadeIn(600).append(
		$('<h2>'+questions[qNum].q+'</h2>')
	);

	for(var i in questions[qNum].a) {
		$('#questions').append(
			$('<h3>'+questions[qNum].a[i]+'</h3>)')
		);
	}
}

var tween = {}, pos, rot;
function reveal(postDataBody) {
	$('h1').html('I HAVE GOT IT!');
	$('header').css('background-color', 'purple');
	renderer.setClearColor(0xff11ff1, 1);
	glitchPass.goWild = true;
	$('#questions').hide();

	var toAdd = cardToNum(postDataBody.suit, postDataBody.card);
	var c = toAdd;
	virCards[c].chosen = true;

	rot = { x: virCards[c].cube.rotation.x , y: virCards[c].cube.rotation.y, z: virCards[c].cube.rotation.z };
	tween.rot = new TWEEN.Tween(rot).to({ x: 0, y: 0, z: 0 }, 6000);
	tween.rot.onUpdate(function() {
		virCards[c].cube.rotation.x = rot.x;
		virCards[c].cube.rotation.y = rot.y;
		virCards[c].cube.rotation.z = rot.z;
	});
	tween.rot.easing(TWEEN.Easing.Elastic.Out)
	tween.rot.start();

	pos = { x: virCards[c].cube.position.x , y: virCards[c].cube.position.y, z: virCards[c].cube.position.z };
	tween.pos = new TWEEN.Tween(pos).to({ x: 0, y: 0, z: 5 }, 3000);
	tween.pos.onUpdate(function() {
		virCards[c].cube.position.x = pos.x;
		virCards[c].cube.position.y = pos.y;
		virCards[c].cube.position.z = pos.z;
	});
	tween.pos.easing(TWEEN.Easing.Exponential.Out)
	tween.pos.start();
}

var frameCanInc = false;
$(document).ready(function() {
	$('#questions').delay(2000).fadeIn(2000).click(function() {
		frameCanInc = true;
		$(this).delay(500).fadeOut(1500, newQuestion);
	});
});

var socket = io({ path: '/iwillgetit/socket.io'});
socket.on('card', function(postDataBody) {
	cardToKeep = cardToNum(postDataBody.suit, postDataBody.card);
	reveal(postDataBody);
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x003831, 1);
document.body.appendChild(renderer.domElement);

var composer = new THREE.EffectComposer(renderer);
composer.addPass( new THREE.RenderPass(scene, camera));

var glitchPass = new THREE.GlitchPass();
glitchPass.renderToScreen = true;
composer.addPass(glitchPass);

var virCards = [];

cubeGeo = new THREE.BoxGeometry(0.65, 1, 0.05);
for(var i=0; i<52; i++) {
	var cardDes = numToCard();

	virCards[i] = {
		material: new THREE.MeshPhongMaterial({ color: 0xffffff, map: THREE.ImageUtils.loadTexture(cardPrefix + cardURLs[cardDes[0]][i - cardDes[1]]) })
	}
	virCards[i].cube = new THREE.Mesh(cubeGeo, virCards[i].material);

	virCards[i].cube.position.x = i/7 - 3.5;

	scene.add(virCards[i].cube);
}

camera.position.z = 6;

var light = new THREE.AmbientLight(0xffffff);
light.position.z = 5;
scene.add(light);

var frame = -1;
var timeSinceChosen = 1;
var canCompose = true;
var render = function () {
	if(frameCanInc) {
		frame++;
	}

	if(timeSinceChosen !== 1) {
		if(canCompose) {
			composer.render();
		} else {
			renderer.render(scene, camera);
		}
	} else {
		renderer.render(scene, camera);
	}

	requestAnimationFrame(render);

	for(var i=0; i<52; i++) {
		if(virCards[i].chosen || frame < i * 20) {
			if(virCards[i].chosen) {
				if(virCards[i].cube.position.x === 0 && virCards[i].cube.position.y === 0 && virCards[i].cube.position.z === 5) {
					if(canCompose) {
						$('header').css('background-color', '#007c02');
						renderer.setClearColor(0x003831, 1);
					}
					canCompose = false;
				}
				timeSinceChosen += 0.005;
			}
		} else {
			virCards[i].cube.position.x += (Math.cos(frame/50 - i/1.2 + Math.random()/10)/20) * timeSinceChosen;
			virCards[i].cube.position.y -= (Math.sin(frame/50 - i/1.2 + Math.random()/10)/25) * timeSinceChosen;
			virCards[i].cube.position.z += (Math.sin(frame/50 - i/2)/30) * timeSinceChosen;

			virCards[i].cube.rotation.y += (Math.cos(frame/100 + i/10)/40) * (timeSinceChosen);
			virCards[i].cube.rotation.z += (Math.cos(frame/100 + i/10)/50) * (timeSinceChosen);
			virCards[i].cube.rotation.x += (Math.cos(frame/100 + i/10)/60) * (timeSinceChosen);
		}
	}

	TWEEN.update();
};

render();
