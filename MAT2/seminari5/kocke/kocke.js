import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';


var manager = new THREE.LoadingManager();
manager.onLoad = function() { // when all resources are loaded
	init();
}

var texture = null;
var normalMap = null;

var textureloader = new THREE.TextureLoader(manager);
textureloader.load('./pic/foam.jpg', function(response) {texture = response});

var normalMaploader = new THREE.TextureLoader(manager);
normalMaploader.load('./pic/foam_normal.jpg', function(response) {normalMap = response});
console.log(normalMaploader);

function init() {
	var y_pogled = 25;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0xA9A9A9, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	$("#WebGL-output").append(renderer.domElement);

	camera.position.x = 50;
	camera.position.y = 30;
	camera.position.z = 50;

	scene.add(camera);

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
	directionalLight.position.set(100,100,100);
	camera.add( directionalLight );

	const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight2.position.set(-100,100,100);
	camera.add( directionalLight2 );

	var mat1 = make_material(0xCC9900);
	var mat2 = make_material(0x00BB00);
	var mat3 = make_material(0x0099FF);
	var mat4 = make_material(0xCCCC00);
	var mat5 = make_material(0xDD00DD);
	var mat6 = make_material(0x00CC88);
	var mat7 = make_material(0xFF0088);

	var ravninaXY = new THREE.GridHelper(200, 50, 0x800000, 0x800000);
	scene.add(ravninaXY);

	var a1 = 10;
	var a2 = a1 / Math.sqrt(2);
	var a3 = a1 / 2;
	var a4 = a3 / Math.sqrt(2);
	var a5 = a3 / 2;
	var a6 = a5 / Math.sqrt(2);
	var a7 = a5 / 2;
	var suma = a1;
	
	var geo1 = new THREE.BoxGeometry(a1, a1, a1);
	geo1.translate(0, a1/2, 0);
	var kocka1 = new THREE.Mesh(geo1, mat1);
	kocka1.material.transparent = true;
	scene.add(kocka1);

	var geo2 = open_box(a2);
	geo2.translate(0, suma + a2/2, 0);
	geo2.rotateY(Math.PI / 4);
	var kocka2 = new THREE.Mesh(geo2, mat2);
	kocka2.material.transparent = true;
	scene.add(kocka2);

	suma += a2;
	var geo3 = open_box(a3);
	geo3.translate(0, suma + a3/2, 0);
	var kocka3 = new THREE.Mesh(geo3, mat3);
	kocka3.material.transparent = true;
	scene.add(kocka3);

	suma += a3;
	var geo4 = open_box(a4);
	geo4.translate(0, suma + a4/2, 0);
	geo4.rotateY(Math.PI / 4);
	var kocka4 = new THREE.Mesh(geo4, mat4);
	kocka4.material.transparent = true;
	scene.add(kocka4);

	suma += a4;
	var geo5 = open_box(a5);
	geo5.translate(0, suma + a5/2, 0);
	var kocka5 = new THREE.Mesh(geo5, mat5);
	kocka5.material.transparent = true;
	scene.add(kocka5);

	suma += a5;
	var geo6 = open_box(a6);
	geo6.translate(0, suma + a6/2, 0);
	geo6.rotateY(Math.PI / 4);
	var kocka6 = new THREE.Mesh(geo6, mat6);
	kocka6.material.transparent = true;
	scene.add(kocka6);

	suma += a6;
	var geo7 = open_box(a7);
	geo7.translate(0, suma + a7/2, 0);
	var kocka7 = new THREE.Mesh(geo7, mat7);
	kocka7.material.transparent = true;
	scene.add(kocka7);

	//lista svih kocki
	var sve_kocke = [kocka1, kocka2, kocka3, kocka4, kocka5, kocka6, kocka7];

	var orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.minDistance = 5;
	orbitControls.maxDistance = 100;
	orbitControls.enablePan = false;
	orbitControls.maxPolarAngle = 3.14;
	orbitControls.minPolarAngle = 0;
	orbitControls.zoomSpeed = 1.5;
	orbitControls.target = new THREE.Vector3(0, y_pogled, 0);
	orbitControls.update();

	orbitControls.addEventListener('change', render);

	var controls = new function() {
		this.prozirnost = 1;
		this.kocke = 7;
		this.zadatak = function() {
			$("#infoModal").modal('toggle');
		};
	}

	var gui = new dat.GUI({resizable : false});

	var prozirnost = gui.addFolder('Prozirnost kocki');
	prozirnost.add(controls, 'prozirnost', 0.5, 1).step(0.05).onChange(function(value) { 
		prozirnost = value;
		kocka1.material.opacity = prozirnost;
		kocka2.material.opacity = prozirnost;
		kocka3.material.opacity = prozirnost;
		kocka4.material.opacity = prozirnost;
		kocka5.material.opacity = prozirnost;
		kocka6.material.opacity = prozirnost;
		kocka7.material.opacity = prozirnost;		
		render();});

	prozirnost.open();

	var kocke = gui.addFolder('Broj prikazanih kocki');
	kocke.add(controls, 'kocke', 1, 7).step(1).onChange(function(value) {
		kocke = value;
		for (let i = 0; i < 7; i++) {
			if (i < kocke) sve_kocke[i].visible = true;
			else sve_kocke[i].visible = false;
		}
		render();
	});

	kocke.open();

	gui.add(controls,'zadatak');

	render();

	function render() {
		renderer.render(scene, camera);
	}

	$(window).resize( function() {
		camera.aspect = (window.innerWidth) / (window.innerHeight);
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight);
		render();
	});	

	function open_box(a) {
		var kocka = new THREE.BoxGeometry(a, a, a);
		var vrhovi = [...kocka.getAttribute('position').array];
		var normale = [...kocka.getAttribute('normal').array];
		var tex = [...kocka.getAttribute('uv').array];
		var indeksi = [...kocka.index.array];
		
		// ukupno vrhova: 24, duljina liste: 24*3=72
		// vrhova za svaku stranu kocke je ukupno 4
		// micemo donju stranu kocke: 4. po redu, 
		// dakle od 36. elementa liste vrhova makni 4 vrha (12 elemenata) 
		vrhovi.splice(36, 12);
		normale.splice(36, 12);
		// za koordinate teksture po vrhu su dva podatka
		// za cetvrtu stranu pocinje od 24. elementa, 4 vrha maknuti (8 podataka)
		tex.splice(24, 8);
		//indeksi.splice(12, 6);
		// iz indeksa treba maknuti elemente 12,13,14,15
		// nakon toga elemente vece od 15 treba smanjiti za 4
		indeksi = indeksi.filter(x => ![12,13,14,15].includes(x)).map(x => x > 15 ? x - 4 : x)
		vrhovi = new Float32Array(vrhovi);
		normale = new Float32Array(normale);
		tex = new Float32Array(tex);

		var geo = new THREE.BufferGeometry();
		geo.setIndex(indeksi);
		geo.setAttribute('position', new THREE.BufferAttribute(vrhovi, 3));
		geo.setAttribute('normal', new THREE.BufferAttribute(normale, 3));
		geo.setAttribute('uv', new THREE.BufferAttribute(tex, 2));

		return geo;		
	}

	function make_material(boja) {
		return new THREE.MeshPhongMaterial({color:boja, emissive:0x000000,	
			                         side:THREE.DoubleSide, map:texture, 
			                         normalMap:normalMap, 
			                         normalScale:new THREE.Vector2(1,1), 
									 flatShading: true});
	}

	window.addEventListener("keydown", event => {
		if (!$('#infoModal').is(':visible')) {
			switch (event.key) {
			case 'ArrowDown':
				y_pogled -= 1;
				if (y_pogled < 1) y_pogled = 1;
				$('#pogkam').html(`${y_pogled}`);
				orbitControls.target = new THREE.Vector3(0, y_pogled, 0);
				orbitControls.update();
				break;
			case 'ArrowUp':
				y_pogled += 1;
				if (y_pogled > 32) y_pogled = 32;
				$('#pogkam').html(`${y_pogled}`);
				orbitControls.target = new THREE.Vector3(0, y_pogled, 0);
				orbitControls.update();
			}
		}
	});

}
