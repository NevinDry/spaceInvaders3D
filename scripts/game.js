
// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 800, fieldHeight = 450;

// spaceShip variables
var spaceShipWidth, spaceShipHeight, spaceShipDepth, spaceShipQuality, h, positionInitialAlien=650, ingame=false, gapWithMesh=1.3, spaceshipMaterial;
var spaceShipDirY = 0, spaceShip2DirY = 0, spaceShipSpeed = 5, missileSpeed = 9, pourcentageVitesseAlien = 0, shotMissile = 0, begin = true;
var AlienMoveLeft = true;
var missileAlien, score = 0, lol =0;;
var ufo = true, ufoBullet= false, missileIsAlive = false, shieldIsUp = false;
var collidableMissileAlien = [];
var collidableMeshList = [];
var collidableAlienList = [];
var alienSpeed = 1.5;
var ufoSpeed = 6;
var shield;
var frequenceTir = 2000;
var konamiCode = false;
var spaceshipLife = 2, spaceshipIsTargetable = true;


/*
Appel aux fonctions de création de l'environenement et de démarrage
*/
function setup()
{
	createScene();
	updateHighScore();
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
	updateHighScore();
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

	//Initialisation des bunker de départ (entity.js)

	createBunker(120,100);
    createBunker(-120,100);
    createBunker(40,100);
    createBunker(-40,100);	
	missileIsAlive = false;

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
		//testInterval();
		cameraPhysics();
		playerspaceShipMovement();
		playerMissile();
		if(missileIsAlive){
			detectCollisionBunker();
			detectIfSpaceshipMissileCollisionAlien();
		}
		detectCollisionFromMissileAlien();
		alienMouvement();
		alienAttack();
		if(ufo==true){
			ufoMecanics();
		}
		if(!ufo && !ufoBullet){
			ufoAttack();
		}

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
		
		//shield.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position, shield.position );
	}

}

function testInterval(){
	var time = Date.now() * 0.0005;	
	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	if(h > 0.95 && h < 0.96){
		
	}
}

function ufoMecanics(){
	var time = Date.now() * 0.00005;	
	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
		if(h > 0.95 && h < 0.951){
			createAlien(180,650, "ufo");
			ufo = false;
		}
}

function createNewWaveAlien(){
	pourcentageVitesseAlien+=0.1;
	var typeAlien;
	typeAlien = "alien3";
	while(positionInitialAlien !=400){
		if(typeAlien != "alien3"){
			for(var i = 0; i < 2; i++){
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
			}
			if(typeAlien == "alien2"){
				typeAlien = "alien1";
			}
		}
		else{
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
			typeAlien = "alien2";
		}
	}
}
/* 
Definition des mouvement de camera
*/
function cameraPhysics()
{	
	// On fait en sorte que la camera suive notre vaisseau
	camera.position.x = spaceship.position.x - 120;
	camera.position.y += (spaceship.position.y - camera.position.y) * 0.05;
	camera.position.z = spaceship.position.z + 130 + 0.04 * (-spaceship.position.x + spaceship.position.x);
	
	//On palce la camera correctement face au plan 
	camera.rotation.x = -0.01 * (spaceship.position.y) * Math.PI/180;
	camera.rotation.y = - Math.PI/3;
	camera.rotation.z = - Math.PI/2;
}

function  mortVaisseau(){
	collidableAlienList.forEach(function(alien) {
	    scene.remove(alien);
	});
	 collidableMissileAlien.forEach(function(alienMissile) {
	    scene.remove(alienMissile);
	});
	var audio = new Audio('./song/boom.wav');
	audio.play();
	ingame=false;
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
	//gestion du highscore
	setTimeout(function(){show_prompt(score)},900);
	begin = true;
   
}

function hitSpaceship(){
	  console.log('hit');
		var audio = new Audio('./song/hit.mp3');
		audio.play();
	spaceshipIsTargetable = false;
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
	setTimeout(function(){spaceshipIsTargetable = true},451);
	$('.life').html("Vies : "+ spaceshipLife);
}

function afficherScore(points){
	score+=points;
	$('.score').html("Score : " + score);
}

