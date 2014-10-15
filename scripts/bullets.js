/*
Gestion du missile (mouvement, position)
*/
function playerMissile()
{

	// lorsqu'on tire, deplacement du missile
	if (Key.isDown(Key.U) && !missileIsAlive)		
	{
		//Créaton du premier missile (entity.js)
		createMissile();
		missileIsAlive = true;
		shotMissile = missileSpeed*2;
    }
	if(missileIsAlive){
		if(missile.position.x > spaceship.position.x+gapWithMesh && missile.position.x < spaceship.position.x+20){
			var audio = new Audio('./song/blast.wav');
			audio.play();
		}
	    //si le missile sort du champ de tir, on le supprime et on en créé un nouveau au vaisseau 
	    if(missile.position.x > 350){
	    	shotMissile = 0;
	    	scene.remove(missile);
	    	missileIsAlive = false;
	    }
	    missile.position.x += shotMissile;
	}
}	

function alienAttack(){
	var time = Date.now() * 0.0005;	
	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	if(h > 0.95 && h < 0.98){
		var alienShooter = Math.floor((Math.random() * collidableAlienList.length) + 0);
		if(collidableAlienList[alienShooter].name != "ufo"){
			createScud(collidableAlienList[alienShooter], collidableAlienList[alienShooter].name);
		}
	}
	if(h > 0.35 && h < 0.38){		
		var alienShooter = Math.floor((Math.random() * collidableAlienList.length) + 0);
		if(collidableAlienList[alienShooter].name != "ufo"){
			createScud(collidableAlienList[alienShooter], collidableAlienList[alienShooter].name);
		}
	}
	
	collidableMissileAlien.forEach(function(missileAlien) {
		missileAlien.position.x -= missileSpeed*0.5;
		if(missileAlien.position.x < -390){
			scene.remove(missileAlien);		
		}
	});
}

function ufoAttack(){
	ufoBullet = true;
	setTimeout(function(){createScud(scene.getObjectByName('ufo'), scene.getObjectByName('ufo').name)}, 200);
	setTimeout(function(){createScud(scene.getObjectByName('ufo'), scene.getObjectByName('ufo').name)}, 1100);
	setTimeout(function(){ufoBullet = false}, 2000);
}