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
		if(alien.position.y < -175 && alien.name ==  "ufo"){
			collidableAlienList.splice(collidableAlienList.indexOf(alien),1);
			scene.remove(alien);
			ufo = true;
		}
		if(alien.name !=  "ufo"){
			if(alien.position.x < spaceship.position.x){
				console.log("Percution");
				ingame = false;
				mortVaisseau();
			}
		    alien.position.x -= alienSpeed*pourcentageVitesseAlien;
		}else{
			alien.position.y -= (ufoSpeed)*pourcentageVitesseAlien;
		}
	});
}