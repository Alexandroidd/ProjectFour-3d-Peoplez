

$(document).ready(function(){
	var database = firebase.database();

	






	
	

	///////////////
	// GUI MAKER //
	///////////////
	var controlla;
	var gui = new dat.GUI();
	var parameters = 
	{
		a: 'CONTROL YOUR PLAYER', //numeric
		b: 200, //numeric slider
		c: 'Hello, GUI', //string
		d: false, // boolean (checkbox)
		e: '#ff8800', //color(hex)
		f: function() {deleteCharacter()},
		g: function() {alert (parameters.c)},
		v: 0, //dummy value, only type is impt
		w: '...', // dummy value, only type is important
		x: 0, y: 0, z: 0
	};


	gui.add(parameters, 'a');
	controlla = gui.add(parameters, 'c').name('String');
	gui.add(parameters, 'f').name('Delete Me');





//////////////////////////////
// Seperate positioning for //
// different animal types ////
//////////////////////////////
	
	// Goat
	var goatPosition = new THREE.Vector3();
		goatPosition.x = 0;
		goatPosition.y = 0;
		goatPosition.z = -50;
		goatHeightAdd = 20;

	var ratPosition = new THREE.Vector3();
		ratPosition.x = -50;
		ratPosition.y = -2;
		ratPosition.z = 0;

	var rhinoPosition = new THREE.Vector3();
		rhinoPosition.x = 0;
		rhinoPosition.y = 16;
		rhinoPosition.z = 150;
	
	

////////////////////////////
// Functions that make /////
// and check animal types //
////////////////////////////


// makes a goat
function makeGoat(saying, character, name) {
	saying = saying;
	character = character;
	name = name;
	var goatLoader = new THREE.OBJLoader();
  	goatLoader.load('objs/goat.obj', function(object){
	// var material = new THREE.MeshLambertMaterial({color:0xFF0000});
	object.scale.y = object.scale.x = object.scale.z = 0.1;
	object.name = name;
	
	object.traverse( function ( child ) {
    if ( child instanceof THREE.Mesh )
        child.material.color.setRGB (1, 0, 0);
    	child.position.set(goatPosition.x, goatPosition.y, goatPosition.z);
		// goatPosition = child.position;

	});
	scene.add(object);
	makeText(saying, goatPosition, character, name);
	goatPosition.z -= 150;
	
  	});
 }

// makes a rat
function makeRat(saying, character, name) {
	saying = saying;
	character = character;
	name = name;
	var ratLoader = new THREE.OBJLoader();
	ratLoader.load('objs/rat.obj', function(object){
		object.scale.y = object.scale.x = object.scale.z = 1;
		object.name = name;

		object.traverse(function (child){
			if(child instanceof THREE.Mesh)
				child.material.color.setRGB(0,1,0);
				child.position.set(ratPosition.x, ratPosition.y, ratPosition.z);
				
		});
		
		scene.add(object);
		makeText(saying, ratPosition, character, name);
		ratPosition.x -= 150;
	});
}

// makes a rhino
function makeRhino(saying, character, name) {
	saying = saying;
	character = character;
	name = name;
	
	var rhinoLoader = new THREE.OBJLoader();
	rhinoLoader.load('objs/rhino.obj', function(object){
		object.scale.y = object.scale.x = object.scale.z = 2;
		object.name = name;

		object.traverse(function(child){
			if(child instanceof THREE.Mesh)
				child.material.color.setRGB(0,0,1);
				child.position.set(rhinoPosition.x, rhinoPosition.y, rhinoPosition.z);
				
		});
		scene.add(object);
		makeText(saying, rhinoPosition, character, name);
		rhinoPosition.z += 120;
	});
}


// checks which character to make
function checkCharacter(character, text, name) {
		  	character = character;
		  	text = text;
		  	name = name;
		  	switch(character) {
		  		case 'Goat':
			  		makeGoat(text, character, name);
			  		break;
			  	case 'Rat':
			  		makeRat(text, character, name);
			  		break;
			  	case 'Rhino':
			  		makeRhino(text, character, name);
			  		break;
			  	default:
			  		console.log('no animals to make');
		  	}
		  }

// End of Animal make/check functions ////////////


//---------------------------------//
/////////////////////////////////////
///////  EDITING FUNCTIONS //////////
/////////////////////////////////////
/////////////////////////////////////

	// changes any field to --> 'value'
	controlla.onFinishChange(function(value){
		value = value;
		getMyCharacter(value);
		console.log('The new Value is ' + value);
	});



///////////////////////////
// FIREBASE FUNCTIONS /////
// DEFINITION SPACE ///////
///////////////////////////


// this gets the curent character
// that you're logged in with
// its used to edit characters on the fly
function getMyCharacter(valueToChange){
	var lastItemKey;
	var lastName;
	valueToChange = valueToChange;
	database.ref('/characters/').limitToLast(1).on('child_added', function(snapshot){
		lastItemKey = snapshot.key;
		lastItem = snapshot.val();
		// console.log('last entered char was ' + lastItem.name);
	});

	firebase.database().ref('characters/' + lastItemKey).set({
    character: lastItem.character,
    name: lastItem.name,
    saying: valueToChange,
    whatChanged: 'saying'
  });
}


// gets player data from firebase to be used by functions //
	function pullCharacters(){
		database.ref('/characters').orderByChild("character").on("child_added", function(snapshot) {
		  var names = snapshot.val();
		  checkCharacter(names.character, names.saying, names.name);
		  // console.log(names.name);   
		});
	}


// looks for updates in any child nodes of 'characters'
	function updateCharacters(){
	var charName;

	// console.log(scene.children);
		database.ref('/characters').on('child_changed', function(snapshot){
			var names = snapshot.val();
			var obj = scene.getObjectByName(names.name);
			var objName = names.name +'text';

			// if you're changing the Saying
			if(names.whatChanged == 'saying'){
				var textToEdit = scene.getObjectByName(objName);
				console.log(textToEdit);
				scene.remove(textToEdit);
				
				var newCanvas = document.createElement('canvas');
				var newContext = newCanvas.getContext('2d');

				newContext.font = 'Bold 20px Arial';

				newContext.fillStyle = 'rgba(255,0,0,0.95';
				newContext.fillText(names.saying, 0, 50);

				//canvas contents used as a texture
				var newTexture = new THREE.Texture(newCanvas);
				newTexture.needsUpdate = true;

				var newMaterial = new THREE.MeshBasicMaterial(
					{map: newTexture, side: THREE.DoubleSide});
				newMaterial.transparent = true;

				var newMesh = new THREE.Mesh(
					new THREE.PlaneGeometry(
						newCanvas.width,
						newCanvas.height), newMaterial);
				if(names.character == 'Rhino'){
					newMesh.position.set(obj.position.x+100, obj.position.y+65, obj.position.z+100);
					newMesh.name = objName;
				} else if(names.character == 'Rat'){
					newMesh.position.set(obj.position.x+20, obj.position.y+30, obj.position.z);
					newMesh.name = objName;
				} else if(names.character == 'Goat'){
				newMesh.position.set(obj.position.x+100, obj.position.y+50, obj.position.z);
				newMesh.name = objName;
				}	
				scene.add(newMesh);
			} // << -- End of 'if' Saying -- >

		});
	} // << -- End of Update Function -- >>

// deletes user's character
function deleteCharacter(){
		database.ref('/characters/').limitToLast(1).once('child_added', function(snapshot){
		var objKey = snapshot.key;
		let charToDelete = snapshot.val();
		let charName = charToDelete.name;
		var deleteObj = scene.getObjectByName(charName);
		scene.remove(deleteObj);
		var deleteText = scene.getObjectByName(charName + 'text');
		scene.remove(deleteText);
		console.log(objKey);
		database.ref().child('/characters/' + objKey).remove();
		window.location.href = '../index.html';
		});
	}

	



///////////////////////////////////
/// FIREBASE LISTENING FUNCTIONS///
/////// RUN SPACE /////////////////
///////////////////////////////////

	pullCharacters();
	updateCharacters();
	



}); // << -- END OF DOCU READY -- >> //




//global
var scene, camera, renderer, controls;


init();
animate();


function init(){

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(105, 
		window.innerWidth/window.innerHeight,
		0.1,
		30000
	);

	camera.position.set(0,150,400);
	camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer({ antialias:
	true });

	// size shoudl be the same as the window
	renderer.setSize(window.innerWidth, window.innerHeight);

	// set a near white clear color (default is black)
	renderer.setClearColor(0xeeeeee);
	// var effect = new THREE.StereoEffect(renderer);

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
	var light2 = new THREE.PointLight(0xffffff);
	light2.position.set(0,300,400);
	scene.add(light);
	scene.add(light2);

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);

	var colorMine = new THREE.Color("rgb(255, 0, 0)");

	// FLOOR
	var loader = new THREE.TextureLoader();
	var floorTexture = loader.load('images/checkerboard.jpg', function(texture){
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(35,35);
	});
	
	var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneGeometry(8000,8000,1,1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);


} // << --- end of init ---- >>




	// add text
	function makeText(text, posit, character, name){
	character = character;
	text = text;
	posit = posit;
	name = name;
	var canvas1 = document.createElement('canvas');
	var context1 = canvas1.getContext('2d');

	if(character == 'Rat'){
		context1.font = 'Bold 15px Arial';
	} else {context1.font = 'Bold 20px Arial';}

	context1.fillStyle = 'rgba(255,0,0,0.95';
	context1.fillText(text, 0, 50);

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


	if (character == 'Goat'){
		mesh1.position.set(posit.x+100,posit.y+50,posit.z);
	} else if (character == 'Rhino'){
		mesh1.position.set(posit.x+100, posit.y+65, posit.z+100);
		
	} else if (character == 'Rat'){
		mesh1.position.set(posit.x+20, posit.y+30, posit.z);

	}
	mesh1.name = name + 'text';
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

	




////////////////////////////
// Drone Strike API Calls //
////////////////////////////
var droneInfo;

$.ajax({
	url: '/drones',
	type: 'GET',
	success: function(data){
		console.log(data[1]);
		makeEvilRhino(data[0],data[1],data[2],data[3],data[4],data[5]);

	},
	error: function(error){
		alert('error: ' + error);
	}
});


var evilRhinoPosition = new THREE.Vector3();
		evilRhinoPosition.x = 0;
		evilRhinoPosition.y = 10;
		evilRhinoPosition.z = -100;


function makeEvilRhino(droneInfo, moreDroneInfo, t, f, ff, sx) {
	droneInfo = droneInfo;
	moreDroneInfo = moreDroneInfo;
	t = t;
	f = f;
	ff = ff;
	sx = sx;
	
	var evilRhinoLoader = new THREE.OBJLoader();
	evilRhinoLoader.load('objs/rhino.obj', function(object){
		object.scale.y = object.scale.x = object.scale.z = 20;
		object.name = 'evilRhino';

		object.traverse(function(child){
			if(child instanceof THREE.Mesh)
				child.material.color.setRGB(0,0,0);
				child.position.set(evilRhinoPosition.x, evilRhinoPosition.y, evilRhinoPosition.z);
				
		});
		scene.add(object);
		makeEvilText(droneInfo);
		makeEvilText(moreDroneInfo);
		makeEvilText(t);
		makeEvilText(f);
		makeEvilText(ff);
		makeEvilText(sx);
	});
}


var evilRhinoTextPosition = new THREE.Vector3();
		evilRhinoTextPosition.x = 0;
		evilRhinoTextPosition.y = 1000;
		evilRhinoTextPosition.z = -3500;


function makeEvilText(droneInfo){
	droneInfo = droneInfo;
	var evilCanvas = document.createElement('canvas');
	evilCanvas.width = 7200;
	evilCanvas.height = 1000;
	var evilContext = evilCanvas.getContext('2d');

	evilContext.font = 'Bold 200px Arial';

	evilContext.fillStyle = 'rgba(10,10,10,0.95';
	evilContext.fillText(droneInfo, 0, 200);

	//canvas contents used as a texture
	var evilTexture = new THREE.Texture(evilCanvas);
	evilTexture.needsUpdate = true;

	var evilMaterial = new THREE.MeshBasicMaterial(
		{map: evilTexture, side: THREE.DoubleSide});
	evilMaterial.transparent = true;

	var evilMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(
			evilCanvas.width,
			evilCanvas.height), evilMaterial);


	
	evilMesh.position.set(evilRhinoTextPosition.x, evilRhinoTextPosition.y, evilRhinoTextPosition.z);
		

	evilMesh.name = 'evilRhinoText';
	scene.add(evilMesh);
	evilRhinoTextPosition.y+=200;
}












/////////////////////
// SAVE FOR LATER ///
/////////////////////
// database.ref('/characters').orderByChild("character").equalTo('Goat').on("child_added", function(snapshot) {
// 		  // console.log(snapshot.val());
// 		  var names = snapshot.val();
// 		  makeGoat();



// var lastCharacter = database.ref('/characters').length-1;

		// return database.ref('/characters').once('value').then(function(snapshot) {
		//   var name = snapshot.exportVal();

		//   console.log(name);
		// });
		// position = ()





// Goat Object
	// var theGoat;

	// var objLoader = new THREE.OBJLoader();
	// objLoader.load('objs/goat.obj', function(object){
	// 	// var material = new THREE.MeshLambertMaterial({color:0xFF0000});
	// 	object.scale.y = object.scale.x = object.scale.z = 0.1;
	// 	object.name = 'Goat';
	// 	object.id = 2;
	// 	object.traverse( function ( child ) {
 //        if ( child instanceof THREE.Mesh )
 //            child.material.color.setRGB (1, 0, 0);
        	
      
 //    });
		
	// 	scene.add(object);
		
	// });

	// theGoat = scene.getObjectByName('Goat');



