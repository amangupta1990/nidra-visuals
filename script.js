// ported from http://oos.moxiecode.com/js_webgl/forest/index.html

let camera, cameraTarget, scene, renderer, clock, textureLoader, glTFLoader, metronome, composer, bloomPass, moon;

let ground1, ground2;
let animatedRings = [];
let particles1, particles2;

const trees = new Set();
const rocks = new Set();
const flowers = new Set();

var soundBuffer = null;
var source = null;
var moonRing = null;
var moonRingAnimParms = {
	scale: 0,
	opacity: 1,
	moonScale: 1
}

var clickCounter = 0;

let r = 0;

var bloomParams = {
	exposure: 0.1,
	bloomStrength: 0.25,
	bloomThreshold: 0.25,
	bloomRadius: 1
};




window.onload = onLoad

function init() {

	clock = new THREE.Clock();
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
	cameraTarget = new THREE.Vector3(0, 0, - 400);


	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x473768);
	scene.fog = new THREE.FogExp2(0x473768, 0.0008);

	//

	const loadingManager = new THREE.LoadingManager();

	textureLoader = new THREE.TextureLoader(loadingManager);
	glTFLoader = new THREE.GLTFLoader(loadingManager);

	// setup scene

	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);



	addGround();
	addTrees();
	addRocks();
	addFlowers();
	addMoon();
	addMoonrings();
	addCloud();
	addParticles();
	addFox();

	//

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);


	var renderScene = new THREE.RenderPass( scene, camera );
	bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
	bloomPass.threshold = bloomParams.bloomThreshold;
	bloomPass.strength = bloomParams.bloomStrength;
	bloomPass.radius = bloomParams.bloomRadius;
	renderer.toneMappingExposure = bloomParams.exposure
	composer = new THREE.EffectComposer(renderer);
	composer.setSize(window.innerWidth, window.innerHeight);
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
	
	

	


	document.body.appendChild(renderer.domElement);

	//

	window.addEventListener('resize', onWindowResize, false);

	// 

	var gui = new dat.GUI();
	gui.add( bloomParams, 'exposure', 0.1, 2 ).onChange( function ( value ) {
		renderer.toneMappingExposure = Math.pow( value, 4.0 );
	} );
	gui.add( bloomParams, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
		bloomPass.threshold = Number( value );
	} );
	gui.add( bloomParams, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
		bloomPass.strength = Number( value );
	} );
	gui.add( bloomParams, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
		bloomPass.radius = Number( value );
	} );
	window.onresize = function () {
		var width = window.innerWidth;
		var height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
		composer.setSize( width, height );
	};



}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {


	requestAnimationFrame(animate);

	const delta = clock.getDelta();
	if (metronome) {
		let ticks = metronome.tick();
		
	}
	run(delta);

	composer.render();

}

function run(delta) {

	const speed = delta * 700;
	r += delta / 2;

	// animate camera

	camera.position.x = 20 * Math.cos(r * 2);


	cameraTarget.x = 5 * Math.sin(r);
	cameraTarget.y = 100;

	camera.lookAt(cameraTarget);

	// animate particles

	particles1.position.x = 80 * Math.cos(r * 2);
	particles1.position.y = Math.sin(r * 2) + 100;

	particles2.position.x = 80 * Math.cos(r * 2);
	particles2.position.y = Math.sin(r * 2) + 100;

	// respawn trees if necessary

	



	for (let tree of trees) {

		tree.position.z += speed;
		if (tree.position.z > camera.position.z) tree.position.z -= 3000;

	}

	// respawn rocks if necessary



	for (let rock of rocks) {

		rock.position.z += speed;
		if (rock.position.z > camera.position.z) rock.position.z -= 3000;




		//rock.material.color.setRGB(data[10], data[20], data[30])

	}

	// respawn flowers if necessary

	for (let flower of flowers) {

		flower.position.z += speed;
		if (flower.position.z > camera.position.z) flower.position.z -= 3000;
		
	
	}

	// respawn particles if necessary

	particles1.position.z += speed;
	particles2.position.z += speed;

	if (particles1.position.z - 1500 > camera.position.z) particles1.position.z -= 6000;

	if (particles2.position.z - 1500 > camera.position.z) particles2.position.z -= 6000;


	// respawn ground if necessary

	ground1.position.z += speed;
	ground2.position.z += speed;

	if (ground1.position.z - 10000 > camera.position.z) ground1.position.z -= 40000;

	if (ground2.position.z - 10000 > camera.position.z) ground2.position.z -= 40000;


	// find animations and play them

	animation = storyBoard.find(s=> s.tick == metronome.tick() )

	if(animation){
		if(!animation.done){
			animation.anim()
		}
	}

}

function addGround() {

	const plane = new THREE.PlaneBufferGeometry(8000, 20000, 9, 24);

	const position = plane.attributes.position;

	for (let i = 0; i < position.count; i++) {

		const y = Math.floor(i / 10);
		const x = i - (y * 10);

		if (x === 4 || x === 5) {

			position.setZ(i, - 60 + ((Math.random() * 80) - 40));

		} else {

			position.setZ(i, (Math.random() * 240) - 120);

		}

		if (y === 0 || y === 24) {

			position.setZ(i, - 60);

		}

	}

	// ground 1

	ground1 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x060606 }));

	ground1.rotation.x = - Math.PI / 2;
	ground1.position.y = - 300;
	ground1.position.z = - 10000;

	scene.add(ground1);

	// ground 2

	ground2 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x060606 }));

	ground2.rotation.x = - Math.PI / 2;
	ground2.position.y = - 300;
	ground2.position.z = - 30000;

	scene.add(ground2);

}

function addTrees() {

	glTFLoader.load('tree.glb', (gltf) => {

		const tree = gltf.scene.children[0];

		for (let i = 0; i < 50; i++) {

			const scale = 2 + (Math.random() * 1.5);

			const mesh = tree.clone();

			mesh.scale.set(scale * 1.5, scale * 2, scale * 1.5);

			mesh.rotation.x = (Math.random() * 0.2) - 0.1;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = (Math.random() * 0.2) - 0.1;

			mesh.position.x = (Math.random() * 4000) - 2000;
			mesh.position.y = - 400;
			mesh.position.z = (Math.random() * 3000) - 3000;

			// keep the way through the forest free of trees

			if (mesh.position.x < 200 && mesh.position.x > 0) mesh.position.x += 200;
			if (mesh.position.x > - 200 && mesh.position.x < 0) mesh.position.x -= 200;

			scene.add(mesh);
			trees.add(mesh);

		}

	});

}

function addFox() {

	glTFLoader.load('fox/scene.gltf', (gltf) => {
		debugger;
		const fox = gltf.scene;

	

			const scale = 2 + (Math.random() * 1.5);

			const mesh = fox;

			mesh.scale.set(scale * 1.5, scale * 2, scale * 1.5);

			mesh.rotation.x = (Math.random() * 0.2) - 0.1;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = (Math.random() * 0.2) - 0.1;

			mesh.position.x = (Math.random() * 4000) - 2000;
			mesh.position.y = - 400;
			mesh.position.z = (Math.random() * 3000) - 3000;

			// keep the way through the forest free of trees

			if (mesh.position.x < 200 && mesh.position.x > 0) mesh.position.x += 200;
			if (mesh.position.x > - 200 && mesh.position.x < 0) mesh.position.x -= 200;

			scene.add(mesh);
			trees.add(mesh);

		

	});

}

function addRocks() {

	glTFLoader.load('rock.glb', (gltf) => {

		const rock = gltf.scene.children[0];

		for (let i = 0; i < 30; i++) {

			const scale = 8 + (Math.random() * 5);

			const mesh = rock.clone();
			mesh.scale.set(scale, scale, scale);


			mesh.rotation.x = 0;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = 0;

			mesh.position.x = (Math.random() * 4000) - 2000;
			mesh.position.y = - 400;
			mesh.position.z = (Math.random() * 3000) - 3000;

			// keep the way through the forest free of rocks

			if (mesh.position.x < 400 && mesh.position.x > 0) mesh.position.x += 400;
			if (mesh.position.x > - 400 && mesh.position.x < 0) mesh.position.x -= 400;

			scene.add(mesh);
			rocks.add(mesh);

		

		
		

		}

	});

}

function addFlowers() {

	glTFLoader.load('flower.glb', (gltf) => {

		const flower = gltf.scene.children[0];

		for (let i = 0; i < 30; i++) {

			const scale = 1 + Math.random();

			const mesh = flower.clone();

			mesh.scale.set(scale, scale, scale);

			mesh.rotation.x = 0;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = 0;

			mesh.position.x = (Math.random() * 4000) - 2000;
			mesh.position.y = - 400;
			mesh.position.z = (Math.random() * 3000) - 3000;

			scene.add(mesh);
			flowers.add(mesh);
		}

	});

}


function addMoonrings() {



	var geometry = new THREE.RingGeometry(0, 10000, 100);
	var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true });
	moonRing = new THREE.Mesh(geometry, material);
	moonRing.position.set(0, 2800, - 2800);

	moonRing.material.color.setRGB(255, 255, 255)
	scene.add(moonRing);

	moonRing.scale = moonRingAnimParms.scale;
	moonRing.lookAt(camera.position)




}

function addMoon() {

	const texture = textureLoader.load('https://yume.human-interactive.org/examples/forest/moon.png');

	const material = new THREE.SpriteMaterial({ map: texture, fog: false, opacity: 0.1 });
    moon = new THREE.Sprite(material);
	moon.position.set(0, 2500, - 2500);
	moon.scale.set(500 * 2, 500 * 2, 1);

	


	scene.add(moon);


}

function addCloud() {

	const texture = textureLoader.load('https://yume.human-interactive.org/examples/forest/cloud.png');
	texture.minFilter = THREE.LinearFilter;

	const material = new THREE.SpriteMaterial({ map: texture, opacity: 0.5 });
	const cloud = new THREE.Sprite(material);
	cloud.position.set(300, 2000, - 1400);
	cloud.scale.set(749 * 8, 328 * 2, 1);

	scene.add(cloud);

}

function addParticles() {

	const texture = textureLoader.load('https://yume.human-interactive.org/examples/forest/particle.png');

	const material = new THREE.PointsMaterial({
		color: 0x9274ce,
		size: 8,
		map: texture,
		blending: THREE.AdditiveBlending,
		opacity: 0.50,
		transparent: true
	});

	const geometry = new THREE.BufferGeometry();
	const points = [];

	for (let i = 0; i < 500; i++) {

		points.push((Math.random() * 1500) - 750);
		points.push((Math.random() * 1000) - 400);
		points.push((Math.random() * 3000) - 1500);

	}

	geometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));

	particles1 = new THREE.Points(geometry, material);
	particles2 = new THREE.Points(geometry, material);

	particles1.position.z = - 1500;
	particles2.position.z = - 4500;

	scene.add(particles1);
	scene.add(particles2);

}

function onLoad() {

	const loadingScreen = document.getElementById('loading-screen');
	loadingScreen.classList.add('fade-out');
	const startButton = document.getElementById('start');
	startButton.addEventListener('click', onStart, false);

	loadingScreen.addEventListener('transitionend', onTransitionEnd, false);

}

function onStart(event) {

	const startScreen = document.getElementById('start-screen');

	startScreen.addEventListener('transitionend', onTransitionEnd, false);

	var request = new XMLHttpRequest();
	request.open('GET', './nidra.mp3', true);



	request.responseType = 'arraybuffer';
	request.onload = function () {

		const ambient = document.getElementById('ambient');
		metronome = new Metronome(98, ambient);
		init();
		ambient.play();
		animate();
		startScreen.classList.add('fade-out');


	}

	request.send()


	event.target.removeEventListener('click', onStart, false);

}

function onTransitionEnd(event) {

	event.target.remove(); // remove target from DOM

}


class Metronome {
	constructor(BPM, sound) {


		this.tickCount = 0;
		this.playing = true;
		this.start = Date.now();
		this.bpm = BPM;
		this.currentTick = 0;
		this.track = sound;
		this.totalClicks = (sound.duration * (this.bpm / 60)) | 0;
		this.bars = 0;
		this.quaterNoteLength = (BPM / 60) * 1000;


	}

	play() {
		this.tickCount = 0;
		this.playing = true;
		this.start = Date.now();
		this.clock.start();
	}

	tick() {
		// if (!this.playing) return;

		// Compute the number of ticks that fit in the
		// amount of time passed since we started

		let diff = this.track.currentTime;

		// first form a large integer, which JS can cope with just fine,
		// and only use division as the final operation.

		this.tickCount = (diff * (this.bpm / 60)) | 0;




		// Inform each track that there is a tick update,
		// and then schedule the next tick.


		return this.tickCount

	}
}