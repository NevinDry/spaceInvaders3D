function returnCustomBoxMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial){
    var boxGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    boxMesh = new THREE.Mesh(boxGeometry, itemMaterial);
    boxMesh.position.x = posX;
    boxMesh.position.y = posY;
    boxMesh.position.z = posZ;

    return boxMesh;
}

function createScud(alien, objectName){
        var missileAlien;
        var scudGeometry = new THREE.Geometry();
        var scudMaterial;

        switch(objectName){
            case 'ufo':
            var scudMaterial = new THREE.MeshLambertMaterial({color: 'red', shading: THREE.FlatShading});
            // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)

            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(4,2,5,0,4,0,scudMaterial));
            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(2,6,5,0,0,0,scudGeometry));

            missileAlien = new THREE.Mesh(scudGeometry, scudMaterial);
            missileAlien.name = "ufoBullet";
        break;

        case 'alien1':
            var scudMaterial = new THREE.MeshLambertMaterial({color: 'blue', shading: THREE.FlatShading });

            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(4,2,5,-1,1,0, scudMaterial));
            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(4,2,5,1,-1,0, scudMaterial));

            scudMesh = new THREE.Mesh(scudGeometry, scudMaterial);

			missileAlien = new THREE.Mesh(scudGeometry, scudMaterial);
			missileAlien.rotation.z = -Math.PI/4;
            missileAlien.doubleSided = true;  

            missileAlien.name ="alien1Bullet";
			break;
        
        case 'alien2':
            var scudMaterial = new THREE.MeshLambertMaterial({color: 'green', shading: THREE.FlatShading });

            scudGeometry.vertices.push(new THREE.Vector3(-1.5, 1.5, 2.5)); 
            scudGeometry.vertices.push(new THREE.Vector3(1.5, 1.5, 2.5));
            scudGeometry.vertices.push(new THREE.Vector3(0, 0, 2.5));
            scudGeometry.vertices.push(new THREE.Vector3(-1.5, 1.5, -2.5));
            scudGeometry.vertices.push(new THREE.Vector3(1.5, 1.5, -2.5));
            scudGeometry.vertices.push(new THREE.Vector3(0, 0, -2.5));

            scudGeometry.faces.push(new THREE.Face3(0, 1, 2));
            scudGeometry.faces.push(new THREE.Face3(3, 4, 0));
            scudGeometry.faces.push(new THREE.Face3(1, 4, 5));
            scudGeometry.faces.push(new THREE.Face3(1, 5, 2)); 
            scudGeometry.faces.push(new THREE.Face3(2, 3, 0)); 
            scudGeometry.faces.push(new THREE.Face3(2, 5, 3));
            scudGeometry.faces.push(new THREE.Face3(3, 5, 4)); 

            scudGeometry.computeFaceNormals();
            scudGeometry.computeVertexNormals();

            // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)

            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(2,4,5,0,3,0, scudMaterial));

            missileAlien = new THREE.Mesh(scudGeometry, scudMaterial);
            scudMaterial.side = THREE.DoubleSide;  
            missileAlien.doubleSided = true;
            missileAlien.name ="alien2Bullet";
        break;

        case 'alien3':
            var scudMaterial = new THREE.MeshLambertMaterial({color: 'darkmagenta', shading: THREE.FlatShading });

            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(2,6,5,0,1,0, scudMaterial));
            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(2,2,5,2,3,0, scudMaterial));
            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(4,2,5,-3,-1,0, scudMaterial));
            THREE.GeometryUtils.merge(scudGeometry, returnCustomBoxMesh(2,2,5,-4,-3,0, scudMaterial));

            missileAlien = new THREE.Mesh(scudGeometry, scudMaterial);

            missileAlien.rotation.z = Math.PI/4;  
            missileAlien.doubleSided = true; 
            missileAlien.name ="alien3Bullet";
        break;     
    }        

        missileAlien.castShadow = true;
        missileAlien.receiveShadow = true;
        //on place le missile dans le vaisseau (+1.3 pour sadapter au mesh)
        missileAlien.position.x = alien.position.x+gapWithMesh;
        missileAlien.position.y = alien.position.y;
        missileAlien.position.z = alien.position.z;
        missileAlien.rotateOnAxis(new THREE.Vector3(0,0,-1), Math.PI/2);
        missileAlien.scale.set(1.3, 1.3, 1.3);
        missileAlien.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/4);
        
        collidableMissileAlien.push(missileAlien);
        scene.add(missileAlien);
}

 function createAlien(position, distance, objectName){
        var halfMesh;
        var alien;
        var nameAlien;
        var alienGeometry = new THREE.Geometry();
        var alienMaterial;
        
        
        switch(objectName){

          case 'alien1':
            alienMaterial = new THREE.MeshLambertMaterial({color: 'blue'});

            // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)

            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,6,5,-11,8,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,8,5,-9,9,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-9,2,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,14,5,-7,6,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-5,0,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(4,4,5,-4,5,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(6,4,5,-3,11,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(4,2,5,-2,14,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-1,7,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-1,2,0, alienMaterial));
            name = "alien1";
        break;

        case 'alien2':
            var alienMaterial = new THREE.MeshLambertMaterial({color: 'green'});

            // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)

            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,6,5,-10.5,4,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-8.5,7,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,10,5,-6.5,6,0,alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-6.5,14,0,alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-4.5,11,0,alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-4.5,5,0,alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(4,2,5,-4,0,0,alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(4,8,5,-1.75,7,0,alienMaterial));
            name ="alien2";
        break;

        case 'alien3':
            var alienMaterial = new THREE.MeshLambertMaterial({color: 0x7C0057});

            // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)

            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-7,7,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-7,2,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,8,5,-5,7,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-5,0,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-3,11,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-3,6,0, alienMaterial));
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,12,5,-1,9,0, alienMaterial));
            name ="alien3";
            lol+=1;
        break;

        case 'ufo':
            var alienMaterial = new THREE.MeshLambertMaterial({color: 'red'});

            // arguments de la fonction returnMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, itemMaterial)
    
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-15,4,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-13,5,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,8,5,-11,5,0, alienMaterial));        
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-9,9,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,6,5,-9,2,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-13,5,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,10,5,-7,6,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(6,6,5,-3,10,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,4,5,-5,5,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,2,5,-3,4,0, alienMaterial)); 
            THREE.GeometryUtils.merge(alienGeometry, returnCustomBoxMesh(2,6,5,-1,4,0, alienMaterial)); 
            name ="ufo";
        break;
}
    halfMesh = new THREE.Mesh(alienGeometry, alienMaterial);

    halfMesh.rotation.y = Math.PI;
    halfMesh.position.x = 0;
    THREE.GeometryUtils.merge(alienGeometry, halfMesh);

    alienGeometry.computeFaceNormals();

    alien = new THREE.Mesh(alienGeometry, alienMaterial);
    alien.position.x = spaceship.position.x+distance;
	alien.position.y = position;
	alien.position.z = 10;
	alien.positionInitiale = position;
	alien.distanceInitiale = distance+spaceship.position.x;
	alien.scale.set(1.5, 1.5, 1.5);
	alien.name = name;
	alien.rotateOnAxis(new THREE.Vector3(0,0,-1), Math.PI/2);
	alien.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/4);
	alien.receiveShadow = true;
	alien.castShadow = true;
	collidableAlienList.push(alien);
	scene.add(alien);
}