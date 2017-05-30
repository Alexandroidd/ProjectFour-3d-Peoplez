$(document).ready(function(){
	var database = firebase.database();
	var goatLoader = new THREE.OBJLoader();
	var position = new THREE.Vector3();
			position.x = 50;
			position.y = 0;
			position.z = 50;
	
//

function makeGoat() {
		  	
		  	goatLoader.load('objs/goat.obj', function(object){
			// var material = new THREE.MeshLambertMaterial({color:0xFF0000});
			object.scale.y = object.scale.x = object.scale.z = 0.1;
			object.name = 'Goat';
			object.id = 2;
			
			object.traverse( function ( child ) {
	        if ( child instanceof THREE.Mesh )
	            child.material.color.setRGB (1, 0, 0);
	        	child.position.set(position.x, position.y, position.z);
        	
      
    		});
			scene.add(object);
			position.x += 50;
			// console.log(position);
		  	});
		 }





//




	function pullCharacters(){
		// var lastCharacter = database.ref('/characters').length-1;

		// return database.ref('/characters').once('value').then(function(snapshot) {
		//   var name = snapshot.exportVal();

		//   console.log(name);
		// });
		// position = ()
		
		var arr = [];
		// this works
		database.ref('/characters').orderByChild("character").equalTo('Goat').on("child_added", function(snapshot) {
		  // console.log(snapshot.val());
		  var names = snapshot.val();
		  makeGoat();
		  
		  
		  // console.log(names);
		  
		});
		
		



	}




	// Functions to Run //
	pullCharacters();



});

//global
var scene, camera, renderer, controls;


init();
animate();


function init(){

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(105, 
		window.innerWidth/window.innerHeight,
		0.1,
		20000
	);

	camera.position.set(0,150,400);
	camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer({ antialias:
	true });

	// size shoudl be the same as the window
	renderer.setSize(window.innerWidth, window.innerHeight);

	// set a near white clear color (default is black)
	renderer.setClearColor(0xeeeeee);
	var effect = new THREE.StereoEffect(renderer);

	// set renderer shadow
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// append to document
	document.body.appendChild(renderer.domElement);

	//Render the scene/camera combination
	renderer.render(scene,camera);

	// Events
	// THREEx.WindowResize(renderer, camera);


	// CONTROLS
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);

	var colorMine = new THREE.Color("rgb(255, 0, 0)");

	// FLOOR
	var loader = new THREE.TextureLoader();
	var floorTexture = loader.load('images/checkerboard.jpg', function(texture){
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(10,10);
	});
	
	var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneGeometry(1000,1000,1,1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);


	// Goat Object
	var theGoat;

	var objLoader = new THREE.OBJLoader();
	objLoader.load('objs/goat.obj', function(object){
		// var material = new THREE.MeshLambertMaterial({color:0xFF0000});
		object.scale.y = object.scale.x = object.scale.z = 0.1;
		object.name = 'Goat';
		object.id = 2;
		object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh )
            child.material.color.setRGB (1, 0, 0);
        	
      
    });
		
		scene.add(object);
		
	});

	theGoat = scene.getObjectByName('Goat');
	// console.log(theGoat);
	

	// var lastIndex = scene.children.length-1;
	// theGoat = scene.children[3];
	// theGoat.name = 'goatman';
	// theGoat.material.color.setRGB(0,1,0);

	// console.log(theGoat.name);


	// add text
	var canvas1 = document.createElement('canvas');
	var context1 = canvas1.getContext('2d');
	context1.font = 'Bold 40px Arial';
	context1.fillStyle = 'rgba(255,0,0,0.95';
	context1.fillText('Hello World!', 0, 50);

	//canvas contents used as a texture
	var texture1 = new THREE.Texture(canvas1);
	texture1.needsUpdate = true;

	var material1 = new THREE.MeshBasicMaterial(
		{map: texture1, side: THREE.DoubleSide});
	material1.transparent = true;

	var mesh1 = new THREE.Mesh(
		new THREE.PlaneGeometry(
			canvas1.width,
			canvas1.height), material1);

	mesh1.position.set(0,50,0);
	scene.add(mesh1);
}



		
	//render it
	function animate(){
		requestAnimationFrame(animate);
		render();


	}

	function render(){
		renderer.render(scene,camera);
	}

	












// $.ajax({
// 	url: 'https://d-people-party.firebaseio.com/.json',
// 	type: 'POST',
// 	data: JSON.stringify(param),
// 	success: function(){
// 		alert('success');
// 	},
// 	error: function(error){
// 		alert('error: ' + error);
// 	}
// });









