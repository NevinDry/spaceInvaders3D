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
		  color: 0xFEFEFE,
		  transparent: true,
		  opacity: 0.1

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
    spaceshipMaterial = new THREE.MeshLambertMaterial({color: 'red', transparent:true});

    // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)
  
    THREE.GeometryUtils.merge(spaceshipGeometry, returnCustomBoxMesh(30,6,7.5,0,0,0,spaceshipMaterial));       
    THREE.GeometryUtils.merge(spaceshipGeometry, returnCustomBoxMesh(26,2,7.5,0,4,0,spaceshipMaterial));
    THREE.GeometryUtils.merge(spaceshipGeometry, returnCustomBoxMesh(6,4,7.5,0,7,0,spaceshipMaterial));
    THREE.GeometryUtils.merge(spaceshipGeometry, returnCustomBoxMesh(2,2,7.5,0,10,0,spaceshipMaterial));
  
    spaceshipGeometry.mergeVertices();
    spaceshipGeometry.computeVertexNormals();
    //spaceshipGeometry.computeFaceNormals();

    spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.receiveShadow = true;
    spaceship.castShadow = true;
	spaceship.position.x = -fieldWidth/2+30;
	spaceship.position.z = 15;
	spaceship.rotateOnAxis(new THREE.Vector3(0,0,-1), Math.PI/2);
    spaceship.updateMatrix();
    scene.add(spaceship);
}

function createShield(){
	shieldIsUp = true;
	/* 
	var smoothCubeGeom = spaceship.geometry.clone();
	var modifier = new THREE.SubdivisionModifier( 2 );
	modifier.modify( smoothCubeGeom );
	*/
	var customMaterial = new THREE.ShaderMaterial( 
    		{
    		    uniforms: 
    			{ 
    				"c":   { type: "f", value: 0.8 },
    				"p":   { type: "f", value: 1.4 },
    				glowColor: { type: "c", value: new THREE.Color(0xffff00) },
    				viewVector: { type: "v3", value: camera.position }
    			},
    			vertexShader:   document.getElementById('vertexShader').textContent,
    			fragmentShader: document.getElementById('fragmentShader').textContent,
    			side: THREE.FrontSide,
    			blending: THREE.AdditiveBlending,
    			transparent: true
    });
	shield = new THREE.Mesh(spaceship.geometry.clone(), customMaterial.clone());
	shield.receiveShadow = true;
	shield.castShadow = true;
	shield.rotateOnAxis(new THREE.Vector3(0,0,-1), Math.PI/2);
	shield.position = spaceship.position;
	shield.scale.multiplyScalar(1.2);
	scene.add(shield);
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
	pointLight.intensity = 3;
	pointLight.distance = 10000;
	scene.add(pointLight);

    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 860);
    spotLight.intensity = 0.5;
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