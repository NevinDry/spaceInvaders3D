
// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 800, fieldHeight = 400;

// spaceShip variables
var spaceShipWidth, spaceShipHeight, spaceShipDepth, spaceShipQuality, h, positionInitialAlien=650, ingame=false, gapWithMesh=1.3, spaceshipMaterial;
var spaceShipDirY = 0, spaceShip2DirY = 0, spaceShipSpeed = 5, missileSpeed = 9, pourcentageVitesseAlien = 0, shotMissile = 0, begin = true;
var missileAlien, score = 0;
var collidableMissileAlien = [];
var collidableMeshList = [];
var collidableAlienList = [];
var alienSpeed = 1;
var frequenceTir = 2000;
var konamiCode = false;
var spaceshipLife = 2, spaceshipIsTargetable = true;


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
	var HEIGHT = 1080;
	var WIDTH = 600;

	//déclaration du canvas de jeu
	var c = document.getElementById("gameCanvas");

	//Création du render
	renderer = new THREE.WebGLRenderer({ clearAlpha: 1 });

	//Création de la camera (entity.js)
	createCamera(HEIGHT, WIDTH);
	renderer.setSize(HEIGHT, WIDTH);

	c.appendChild(renderer.domElement);

	//Création du plan perspective (entity.js)
	createPlane(fieldWidth, fieldHeight);
    

    //Que la lumière soie !
    createLight();

    createBackgroundParticles();
		
}

function gamePlay(){	
	splashScreenBeforeGame();
	score = 0;
	spaceshipLife = 2;
	$('.life').html("Vies : "+ spaceshipLife);
	pourcentageVitesseAlien = 0;
	afficherScore(score);
	 collidableAlienList = [];
	 collidableMissileAlien = [];
	setTimeout(function(){$('#gameCanvas').css({"display": "block"})},2400);
	setTimeout(function(){createElement()},2400);
	setTimeout(function(){ingame=true},2401);
	$('.gameOver').css({"display": "none"});
	$('.goGame').css({"display": "none"});
}

function splashScreenBeforeGame(){
	$('.countdown').css({"display": "block"});
	$('.countdown').html("*3*");
	setTimeout(function(){$('.countdown').html("*2*")},700);
	setTimeout(function(){$('.countdown').html("*1*")},1400);
	setTimeout(function(){$('.countdown').html("GO!")},2100);
	setTimeout(function(){$('.countdown').css( "color", "red")},2100);
	setTimeout(function(){$('.countdown').css({"display": "none"})},2400);
	setTimeout(function(){$('#gameCanvas').css({"-webkit-transform": "translateZ(0)", "-webkit-filter": "blur(0)"})},2400);
}


function createElement(){
	$('.score').css({"display": "block"});
	$('.life').css({"display": "block"});
	//Création du vaisseau :P (entity.js)
	createSpaceship(fieldWidth);
	console.log(spaceship);

	//Créaton du premier missile (entity.js)
	createMissile();

	//Initialisation des bunker de départ (entity.js)

	createBunker(120,100);
    createBunker(-120,100);
    createBunker(40,100);
    createBunker(-40,100);	
    
    createNewWaveAlien();
}


function newWave(){
	splashScreenBeforeGame();
	$('.annonce').html("Bien jou�, pr�parez vous � la prochaine vague !"); 
	positionInitialAlien = 650;
	setTimeout(function(){createNewWaveAlien();},2401);
	setTimeout(function(){$('.annonce').html("")},2401);
}

/*
Rendu dynamique dans le canvas, appel des fonctions de Gameplay (collisions, mouvement, mécanique) 
*/
function draw()
{		
	renderer.render(scene, camera);
	requestAnimationFrame(draw);
	if(ingame){
		cameraPhysics();
		playerspaceShipMovement();
		playerMissile();
		detectCollisionBunker();
		detectIfSpaceshipMissileCollisionAlien();
		detectCollisionFromMissileAlien();
		alienMouvement();
		alienAttack();
		collidableAlienList.forEach(function(alien) {
		   if(alien.position.x == spaceship.position.x && ingame){
		       scene.remove(missile);
			   mortVaisseau();
		    }	
		});
		if(konamiCode){
			var time = Date.now() * 0.0005;	
			h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
			material.color.setHSL( h, 0.25, 0.5 );
			material.size = 20;
			spaceshipMaterial.color.setHSL( h, 0.25, 0.2 );
			
			collidableMeshList.forEach(function(bunker) {
			    bunker.material.color.setHSL( h, 0.25, 0.2 );
			});
			
			collidableAlienList.forEach(function(alien) {
				alien.material.color.setHSL( h, 0.25, 0.2 );
			});
		}
	}

}


/*
Détéction des collisions
*/
function detectCollisionBunker(){
	//utilisation de Raycaster
	var caster = new THREE.Raycaster();
	  caster.set(missile.position, new THREE.Vector3(1, 0, 1));
	  //On test s'il y a une collision
	  var collisionsBunker = caster.intersectObjects(collidableMeshList);
	  if (collisionsBunker.length > 0) {
	  		//SI collision il ya , on retire de l'opacité au bunker concerné, on supprime le missile qui a touché
		  collisionsBunker[0].object.material.opacity -= 0.1;
	  		scene.remove(missile);
	  		//on suprime le bunker quand celui si n'a plus de vie (pus d'opacité)
	  		if(collisionsBunker[0].object.material.opacity < 0){
	  			console.log(collidableMeshList.indexOf(collisionsBunker[0].object));
	  			collidableMeshList.splice(collidableMeshList.indexOf(collisionsBunker[0].object),1);
	  			scene.remove(collisionsBunker[0].object);
	  		}
	  		shotMissile = 0;
	  		//on recréé un missile sous le vaisseau
	  		createMissile();
	  }
}

function detectIfSpaceshipMissileCollisionAlien(){
	//utilisation de Raycaster
	var casterAlien = new THREE.Raycaster();
	casterAlien.set(missile.position, new THREE.Vector3(1, 0, 0));
	casterAlien.far = missileSpeed*2;
	  //On test s'il y a une collision
	  var collisionsAlien = casterAlien.intersectObjects(collidableAlienList);
	  if (collisionsAlien.length > 0) {
			var audio = new Audio('./song/murloc.ogg');
			audio.play();
			afficherScore(50);
			scene.remove(collisionsAlien[0].object);
	  		scene.remove(missile);
  			collidableAlienList.splice(collidableAlienList.indexOf(collisionsAlien[0].object),1);
	  		shotMissile = 0;
	  		//on recr�� un missile sous le vaisseau
	  		createMissile();
	  		if(collidableAlienList.length == 0){
	  			console.log("Enemis �limin�s");
	  			newWave();

	  		}
	  }
	
}



function detectCollisionFromMissileAlien(){
	for (var i = 0; i < collidableMissileAlien.length; i++) {
		  var caster = new THREE.Raycaster();
		  caster.set(collidableMissileAlien[i].position, new THREE.Vector3(1, 0, 1));
		  caster.far = missileSpeed*2;
		 
		  //On test s'il y a une collision
		  var collisionsBunker = caster.intersectObjects(collidableMeshList);
		  if (collisionsBunker.length > 0) {
			  console.log("olol");
			  scene.remove(collidableMissileAlien[i]);
		  		//SI collision il ya , on retire de l'opacité au bunker concerné, on supprime le missile qui a touché
			  collisionsBunker[0].object.material.opacity -= 0.1;
			  collidableMissileAlien.splice(i--, 1);
		  		
		  		//on suprime le bunker quand celui si n'a plus de vie (pus d'opacité)
		  		if(collisionsBunker[0].object.material.opacity < 0){
		  			collidableMeshList.splice(collidableMeshList.indexOf(collisionsBunker[0].object),1);
		  			scene.remove(collisionsBunker[0].object);
		  		}
		  }else{
			  detectShootSpeceshipFromAlien(collidableMissileAlien[i]);
		  }
		  
	}
	
}

function detectShootSpeceshipFromAlien(missileUniqueAlien){
	var casterSpaceship = new THREE.Raycaster();
	casterSpaceship.set(missileUniqueAlien.position, new THREE.Vector3(1, 0, 1));
	var collisionsSpaceship = casterSpaceship.intersectObject(spaceship);
	casterSpaceship.far = missileSpeed*2;
	
	if(collisionsSpaceship.length > 0 && spaceshipIsTargetable) {
		  console.log('hit');
		  scene.remove(missile);
		  scene.remove(missileUniqueAlien);
		  spaceshipLife--;
		  if(spaceshipLife == -1){
			  console.log("end");
			  mortVaisseau();
		  }else{
			  
			  hitSpaceship();
		  }

	 }	
}

function alienAttack(){
	var time = Date.now() * 0.0005;	
	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	if(h > 0.95 && h < 0.98){
		var alienShooter = Math.floor((Math.random() * collidableAlienList.length) + 0);
		createScud(collidableAlienList[alienShooter], collidableAlienList[alienShooter].name);
		//createMissileAlien();
	}
	if(h > 0.35 && h < 0.38){
		var alienShooter = Math.floor((Math.random() * collidableAlienList.length) + 0);
		createScud(collidableAlienList[alienShooter]);
		//createMissileAlien();
	}
	collidableMissileAlien.forEach(function(missile) {
		 missile.position.x -= missileSpeed*0.5;
		 if(missile.position.x < -400){
			 scene.remove(missile);
		 }
	});
	
}

function createNewWaveAlien(){
	pourcentageVitesseAlien+=0.3;
	var typeAlien;
	typeAlien = "alien2";
	while(positionInitialAlien!=450){	
		createAlien(30,positionInitialAlien, typeAlien);
		console.log(collidableAlienList);
		createAlien(-15,positionInitialAlien, typeAlien);
		createAlien(75,positionInitialAlien, typeAlien);
		createAlien(-60,positionInitialAlien,typeAlien);
		createAlien(-100,positionInitialAlien,typeAlien);
		createAlien(-145,positionInitialAlien,typeAlien);
		createAlien(120,positionInitialAlien,typeAlien);
		createAlien(165,positionInitialAlien,typeAlien);
		positionInitialAlien = positionInitialAlien-50;
		if(typeAlien == "alien2"){
			typeAlien = "alien3";
		}
		else{
			typeAlien = "alien2";
		}
		
	}
}

/*
Gestion du missile (mouvement, position)
*/
function playerMissile()
{
	// lorsqu'on tire, deplacement du missile
	if (Key.isDown(Key.U))		
	{
		shotMissile = missileSpeed*2;

    }
	if(missile.position.x > spaceship.position.x+gapWithMesh && missile.position.x < spaceship.position.x+20){
		var audio = new Audio('./song/blast.wav');
		audio.play();
	}
    //si le missile sort du champ de tir, on le supprime et on en créé un nouveau au vaisseau 
    if(missile.position.x > 350){
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
	if(missile.position.x == spaceship.position.x+1.3){
		missile.position.y += spaceshipDirY;
	}


	if (Key.isDown(Key.M))		
	{
		 mortVaisseau();
	}

}

function alienMouvement(){
	collidableAlienList.forEach(function(alien) {
	    alien.position.x -= alienSpeed*pourcentageVitesseAlien;
	});
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

function  mortVaisseau(){
	collidableAlienList.forEach(function(alien) {
	    scene.remove(alien);
	});
	 collidableMissileAlien.forEach(function(alienMissile) {
	    scene.remove(alienMissile);
	});
	var audio = new Audio('./song/boom.mp3');
	ingame=false;
	audio.play();
	positionInitialAlien=650;
	spaceship.position.y += 2;
	spaceshipMaterial.opacity -= 0.2;
	setTimeout(function(){spaceshipMaterial.opacity -= 0.1},300);
	setTimeout(function(){spaceshipMaterial.opacity -= 0.1},500);
	setTimeout(function(){spaceshipMaterial.opacity -= 0.1},700);
	setTimeout(function(){spaceship.position.y -= 2;},100);
	setTimeout(function(){spaceship.position.y += 2;},200);
	setTimeout(function(){spaceship.position.y -= 2;},300);
	setTimeout(function(){spaceship.position.y += 2;},400);
	setTimeout(function(){spaceship.position.y -= 2;},500);
	setTimeout(function(){spaceship.position.y += 2;},600);
	setTimeout(function(){spaceship.position.y -= 2;},700);
	setTimeout(function(){scene.remove(spaceship)},800);
	//setTimeout(function(){ingame=false},800);
	setTimeout(function(){$('#gameCanvas').css("-webkit-filter", "blur(5px)")},900);
	$('.scoreReplay').html("Score : "+ score);
	setTimeout(function(){$('.gameOver').css({"display": "block"})},900);
	begin = true;
   
}

function hitSpaceship(){
	spaceshipIsTargetable = false;
	scene.remove(missile);
	spaceshipMaterial.opacity -= 1;
	setTimeout(function(){spaceshipMaterial.opacity += 1},50);
	setTimeout(function(){spaceshipMaterial.opacity -= 1},100);
	setTimeout(function(){spaceshipMaterial.opacity += 1},150);
	setTimeout(function(){spaceshipMaterial.opacity -= 1},200);
	setTimeout(function(){spaceshipMaterial.opacity += 1},250);
	setTimeout(function(){spaceshipMaterial.opacity -= 1},300);
	setTimeout(function(){spaceshipMaterial.opacity += 1},350);
	setTimeout(function(){spaceshipMaterial.opacity -= 1},400);
	setTimeout(function(){spaceshipMaterial.opacity += 1},450);

	
	setTimeout(function(){createMissile()},451);
	setTimeout(function(){spaceshipIsTargetable = true},451);
	$('.life').html("Vies : "+ spaceshipLife);
}

function afficherScore(points){
	score+=points;
	$('.score').html("Score : " + score);
}

