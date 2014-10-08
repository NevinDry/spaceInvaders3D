/*
Création de la camera Perspective en fonction de la taille de notre air de jeu
*/
function createCamera(width, height){
	var VIEW_ANGLE = 50,
	  ASPECT = width / height,
	  NEAR = 0.1,
	  FAR = 10000;
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();
	scene.add(camera);

	camera.position.z = 320;
}

/*
Création du plan qui définit l'air de jeu
*/
function createPlane(fieldwidth, fieldheight){
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x111111,
		  transparent: true,
		  opacity: 0.8

		});

	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		fieldWidth,	
		fieldHeight,
		100,				
		1,
		1,
		1),

	tableMaterial);
	table.position.z = -55;
	table.position.x = -15;
	scene.add(table);
	table.receiveShadow = true;	
}

/*
Création du vaisseau, placé au milieu de l'air de jeu
*/
function createSpaceship(){
    var spaceshipGeometry = new THREE.Geometry();
    spaceshipMaterial = new THREE.MeshLambertMaterial({color: 0x840000,transparent: true});

    var boxGeometry1 = new THREE.BoxGeometry(30, 6, 10);
    
    boxMesh1 = new THREE.Mesh(boxGeometry1, spaceshipMaterial);
    boxMesh1.position.x = 0;
    boxMesh1.position.y = 0;
    boxMesh1.position.z = 0;

    THREE.GeometryUtils.merge(spaceshipGeometry, boxMesh1);
 
    var boxGeometry2 = new THREE.BoxGeometry(26,2,10);
    boxMesh2 = new THREE.Mesh(boxGeometry2, spaceshipMaterial);
    boxMesh2.position.x = 0;
    boxMesh2.position.y = 4;
    boxMesh2.position.z = 0;

    THREE.GeometryUtils.merge(spaceshipGeometry, boxMesh2);

    var boxGeometry3 = new THREE.BoxGeometry(6,4,10);
    boxMesh3 = new THREE.Mesh(boxGeometry3, spaceshipMaterial);
    boxMesh3.position.x = 0;
    boxMesh3.position.y = 6;
    boxMesh3.position.z = 0;

    THREE.GeometryUtils.merge(spaceshipGeometry, boxMesh3);

    var boxGeometry4 = new THREE.BoxGeometry(2,2,10);
    boxMesh4 = new THREE.Mesh(boxGeometry4, spaceshipMaterial);
    boxMesh4.position.x = 0;
    boxMesh4.position.y = 9;
    boxMesh4.position.z = 0;

    THREE.GeometryUtils.merge(spaceshipGeometry, boxMesh4);
  
    spaceshipGeometry.computeFaceNormals();

    spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.receiveShadow = true;
    spaceship.castShadow = true;
    spaceship.castShadow = true;
	spaceship.position.x = -fieldWidth/2+30;
	spaceship.position.z = 15;
	spaceship.rotateOnAxis(new THREE.Vector3(0,0,-1), Math.PI/2);
    
    spaceship.updateMatrix();
    scene.add(spaceship);
}


function createAlien(position, distance){
    var halfMesh;
    var alien;
    var alien2Geometry = new THREE.Geometry();
    var alien2Material = new THREE.MeshLambertMaterial({color: 'green'});

    // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)

    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(2,6,5,-10.5,4,0, alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(2,4,5,-8.5,7,0, alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(2,10,5,-6.5,6,0,alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(2,2,5,-6.5,14,0,alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(2,4,5,-4.5,11,0,alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(2,4,5,-4.5,5,0,alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(4,2,5,-4,0,0,alien2Material));
    THREE.GeometryUtils.merge(alien2Geometry, returnCustomBoxMesh(4,8,5,-1.75,7,0,alien2Material));

    halfMesh = new THREE.Mesh(alien2Geometry, alien2Material);

    halfMesh.rotation.y = Math.PI;
    halfMesh.position.x = 0;

    THREE.GeometryUtils.merge(alien2Geometry, halfMesh);

    alien2Geometry.computeFaceNormals();

    alien = new THREE.Mesh(alien2Geometry, alien2Material)    
    alien.updateMatrix();
    alien.position.x = spaceship.position.x+distance;
	alien.position.y = spaceship.position.y+position;
	alien.position.z = 10;
	alien.scale.set(1.5, 1.5, 1.5);
	alien.rotateOnAxis(new THREE.Vector3(0,0,-1), Math.PI/2);
	alien.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/4);
	scene.add(alien);
	alien.receiveShadow = true;
	alien.castShadow = true;
	collidableAlienList.push(alien);
}

function returnCustomBoxMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial){
    var boxGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    boxMesh = new THREE.Mesh(boxGeometry, itemMaterial);
    boxMesh.position.x = posX;
    boxMesh.position.y = posY;
    boxMesh.position.z = posZ;

    return boxMesh;
}

/*
Créaton du missile
*/
function createMissile(){
	var geometry = new THREE.BoxGeometry(8,3,3);
    var material = new THREE.MeshBasicMaterial({color: 0xF0DC24} );
    missile = new THREE.Mesh(geometry,material);
    missile.castShadow = true;
    missile.receiveShadow = true;
    //on place le missile dans le vaisseau (+1.3 pour sadapter au mesh)
    missile.position.x = spaceship.position.x+gapWithMesh;
    missile.position.y = spaceship.position.y;
    missile.position.z = spaceship.position.z;
    scene.add(missile);
}

function createMissileAlien(alien){
	var geometry = new THREE.BoxGeometry(5,3,3);
    var material = new THREE.MeshBasicMaterial({color: 0x5D0054});
    missileAlien = new THREE.Mesh(geometry,material);
    missileAlien.castShadow = true;
    missileAlien.receiveShadow = true;
    //on place le missile dans le vaisseau (+1.3 pour sadapter au mesh)
    missileAlien.position.x = alien.position.x+gapWithMesh;
    missileAlien.position.y = alien.position.y;
    missileAlien.position.z = alien.position.z;
    collidableMissileAlien.push(missileAlien);
    scene.add(missileAlien);
}

/*
Création des bunker avec un attribut d'opacité (les bunkers sont immobiles)
*/
function createBunker(position, distance){
	var geometry = new THREE.BoxGeometry(6,30,30);
    var material = new THREE.MeshBasicMaterial({color: 0x342009, transparent: true});
    var bunker = new THREE.Mesh(geometry,material);
	
	scene.add(bunker);
	bunker.receiveShadow = true;
    bunker.castShadow = true;
    //placement des bunker par rapport a la position centrale du vaisseau	
	bunker.position.x = spaceship.position.x+distance;
	bunker.position.y = spaceship.position.y+position;
	bunker.position.z = 20;
	collidableMeshList.push(bunker);
}

/*
Création d'un spot lumineux et d'un pointeur lumineux
*/
function createLight(){
	pointLight =
	  new THREE.PointLight(0xF8D898);

	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 4;
	pointLight.distance = 10000;
	scene.add(pointLight);

    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 860);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

}

function createBackgroundParticles(){
	 geometry = new THREE.Geometry();

    //sprite = THREE.ImageUtils.loadTexture( "textures/sprites/disc.png" );

    for ( i = 0; i < 5000; i ++ ) {

        var vertex = new THREE.Vector3();
        var distance = 0;
        while (distance < 500*500){

        vertex.x = newmathrandom();
        vertex.y = newmathrandom();
        vertex.z = newmathrandom();
        distance = vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z
        };

        geometry.vertices.push( vertex );

    }

    material = new THREE.ParticleBasicMaterial( { size: 10, sizeAttenuation: true, depthWrite: false } );
    material.color.setHSL( 1.0, 0.2, 0.8 );
    particles = new THREE.ParticleSystem( geometry, material );
    particles.renderDepth = 0;
    scene.add( particles );
	
	
	renderer.shadowMapEnabled = true;		
}


function newmathrandom(){
    var a = 1000 * Math.sin(2 * Math.random()-1);
    if( a > 0 ){
        return a 
    } else {
        return a
    }       
}