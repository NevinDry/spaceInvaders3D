
// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 800, fieldHeight = 400;

// spaceShip variables
var spaceShipWidth, spaceShipHeight, spaceShipDepth, spaceShipQuality, h;
var spaceShipDirY = 0, spaceShip2DirY = 0, spaceShipSpeed = 5, missileSpeed = 7, shotMissile = 0;
var collidableMeshList = [];
var konamiCode = false;


/*
Appel aux fonctions de création de l'environenement et de démarrage
*/
function setup()
{
	createScene();
	draw();
}

/*
Création de la scène en faisant appel aux fonctions de génération d'objets contenues dans ENTITY.JS
*/
function createScene()
{
	//taille de la scene
	var WIDTH = 1280,
	HEIGHT = 640;

	//déclaration du canvas de jeu
	var c = document.getElementById("gameCanvas");

	//Création du render
	renderer = new THREE.WebGLRenderer({ clearAlpha: 1 });

	//Création de la camera (entity.js)
	createCamera(WIDTH, HEIGHT);
	renderer.setSize(WIDTH, HEIGHT);

	if(c.firstChild != null){
		c.removeChild(c.firstChild);
	}
	c.appendChild(renderer.domElement);

	//Création du plan perspective (entity.js)
	createPlane(fieldWidth, fieldHeight);

	//Création du vaisseau :P (entity.js)
	createSpaceShip(fieldWidth);

	//Créaton du premier missile (entity.js)
	createMissile();

	//Initialisation des bunker de départ (entity.js)
    createBunker(120);
    createBunker(-120);
    createBunker(40);
    createBunker(-40);

    //Que la lumière soie !
    createLight();

    createBackgroundParticles();
    addStatsObject();
		
}

/*
Rendu dynamique dans le canvas, appel des fonctions de Gameplay (collisions, mouvement, mécanique) 
*/
function draw()
{	
	renderer.render(scene, camera);
	requestAnimationFrame(draw);
	cameraPhysics();
	playerspaceShipMovement();
	playerMissile();
	detectCollision();
	if(konamiCode){
		var time = Date.now() * 0.0005;	
		h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
		material.color.setHSL( h, 0.25, 0.5 );
		material.size = 20;
		spaceship.material.color.setHSL( h, 0.25, 0.2 );
	}

}


/*
Détéction des collisions
*/
function detectCollision(){
	//utilisation de Raycaster
	var caster = new THREE.Raycaster();
	  caster.set(missile.position, new THREE.Vector3(1, 0, 1));
	  //On test s'il y a une collision
	  var collisions = caster.intersectObjects(collidableMeshList);
	  if (collisions.length > 0) {
	  		//SI collision il ya , on retire de l'opacité au bunker concerné, on supprime le missile qui a touché
	  		collisions[0].object.material.opacity -= 0.1;
	  		scene.remove(missile);
	  		//on suprime le bunker quand celui si n'a plus de vie (pus d'opacité)
	  		if(collisions[0].object.material.opacity < 0){
	  			console.log(collidableMeshList.indexOf(collisions[0].object));
	  			collidableMeshList.splice(collidableMeshList.indexOf(collisions[0].object),1);
	  			scene.remove(collisions[0].object);
	  		}
	  		shotMissile = 0;
	  		//on recréé un missile sous le vaisseau
	  		createMissile();
	  }
}

/*
Gestion du missile (mouvement, position)
*/
function playerMissile()
{

	if (Key.isDown(Key.U))		
	{
	// lorsqu'on tire, deplacement du missile
		if (Key.isDown(Key.U))		
		{
			shotMissile = missileSpeed*2;
	
	    }
	}
	if(missile.position.x > spaceship.position.x+1 && missile.position.x < spaceship.position.x+20){
		var audio = new Audio('./song/blast.wav');
		audio.play();
	}
    //si le missile sort du champ de tir, on le supprime et on en créé un nouveau au vaisseau 
    if(missile.position.x > 200){
    	shotMissile = 0;
    	scene.remove(missile);
    	createMissile();
    }
    missile.position.x += shotMissile;
}	

/*
Déplacement du vaisseau
*/
function playerspaceShipMovement()
{
	// Move gauche
	if (Key.isDown(Key.L))		
	{
		//tant qu'on reste sur la table de jeu, on peut bouger
		if (spaceship.position.y < fieldHeight * 0.45)
		{
			spaceshipDirY = spaceShipSpeed * 0.9;
		}
		
		//Si le vaisseau arrive au bout de la table, on le stop
		else
		{
			spaceshipDirY = 0;
		}
	}	
	// move droite
	else if (Key.isDown(Key.R))
	{
		//tant qu'on reste sur la table de jeu, on peut bouger
		if (spaceship.position.y > -fieldHeight * 0.45)
		{
			spaceshipDirY = -spaceShipSpeed * 0.9;
		}

		//Si le vaisseau arrive au bout de la table, on le stop
		else
		{
			spaceshipDirY = 0;
		}
	}
	else
	{
		spaceshipDirY = 0;
	}
	
	//deplacement
	spaceship.position.y += spaceshipDirY;

	//si le missile est sous le vaisseau, il se deplace avec lui
	if(missile.position.x == spaceship.position.x){
		missile.position.y += spaceshipDirY;
	}


	if (Key.isDown(Key.D))		
	{
		spaceship.position.y += 2;
		setTimeout(function(){spaceship.position.y -= 2;},100);
		setTimeout(function(){spaceship.position.y += 2;},200);
		setTimeout(function(){spaceship.position.y -= 2;},300);
		setTimeout(function(){spaceship.position.y += 2;},400);
		setTimeout(function(){spaceship.position.y -= 2;},500);
		setTimeout(function(){spaceship.position.y += 2;},600);
		setTimeout(function(){spaceship.position.y -= 2;},700);	

	}

}

/* 
Definition des mouvement de camera
*/
function cameraPhysics()
{	
	// On fait en sorte que la camera suive notre vaisseau
	camera.position.x = spaceship.position.x - 100;
	camera.position.y += (spaceship.position.y - camera.position.y) * 0.05;
	camera.position.z = spaceship.position.z + 100 + 0.04 * (-spaceship.position.x + spaceship.position.x);
	
	//On palce la camera correctement face au plan 
	camera.rotation.x = -0.01 * (spaceship.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

function addStatsObject(){
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);
}

