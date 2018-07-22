function degToRad( degrees ) {
    var pi = Math.PI;
    return degrees * (pi/180);
}

var rameses;
var renderer;
var scene;
var camera;

if( window.DeviceMotionEvent ) {
    window.addEventListener("devicemotion", motion, false);
} else {
    console.log("DeviceMotionEvent is not supported");
}

function motion(event){
    /*
    console.log("Accelerometer: "
        + event.accelerationIncludingGravity.x + ", "
        + event.accelerationIncludingGravity.y + ", "
        + event.accelerationIncludingGravity.z
    );
    */
    $("#x").text(event.acceleration.x);
    $("#y").text(event.acceleration.y);
    $("#z").text(event.acceleration.z);
    rameses.rotation.x = event.acceleration.x;
    rameses.rotation.y = event.acceleration.y;
    rameses.rotation.z = event.acceleration.z;
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xd5fcff );
    scene.fog = new THREE.Fog( 0xd5fcff, 5, 10);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 1, 3);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( './res/eggplant.obj.mtl', function( materials ) {
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( './res/eggplant.obj', function ( object ) {
                object.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                } );
                rameses = object;
                rameses.position.y = 1;
                scene.add( rameses );
            },
        );
    } );

    var planeGeometry = new THREE.PlaneGeometry( 1000, 1000 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffe4c4} );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.rotation.x = degToRad(-90);
    scene.add( plane );

    var hemisphereLight = new THREE.HemisphereLight( 0xd5fcff, 0xffe4c4, 0.7);
    scene.add( hemisphereLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
    directionalLight.position.set(-1, 1, 2);
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

function animate() {
	requestAnimationFrame( animate );
    //rameses.rotation.x += 0.01;
    //rameses.rotation.y += 0.01;
	renderer.render( scene, camera );
    motion();
}

init();
animate();