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

	/*
	//si le missile est sous le vaisseau, il se deplace avec lui
	if(missile.position.x == spaceship.position.x+1.3){
		missile.position.y += spaceshipDirY;
	}
	*/

	if (Key.isDown(Key.M))		
	{
		 mortVaisseau();
	}

}

function alienMouvement(){
	for (var i = 0; i < collidableAlienList.length; i++) {
		if(collidableAlienList[i].position.y < -185 && collidableAlienList[i].name ==  "ufo"){
			scene.remove(collidableAlienList[i]);
			collidableAlienList.splice(collidableAlienList.indexOf(collidableAlienList[i]),1);
			ufo = true;
			break;
		}
		if(collidableAlienList[i].name !=  "ufo"){
			if(collidableAlienList[i].position.x < spaceship.position.x){
				console.log("Percution");
				scene.remove(shield);
				shieldIsUp = false;
				mortVaisseau();
				break;
			}
			collidableAlienList[i].position.x -= alienSpeed*pourcentageVitesseAlien;
		}else{
			collidableAlienList[i].position.y -= (ufoSpeed)*pourcentageVitesseAlien;
		}
	}
}