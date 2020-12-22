var camera, cena, renderer;
var geometry, material, mesh, stats;
var renderer, relogio, misturador ;
var acaoY, acaoZ, acaoR;
var lightNumber = 0;
var luzIntensidade = 1;

init();
animar();

function init(){
    cena = new THREE.Scene();
    var can = document.getElementById('meuCanvas');
    camara = new THREE.PerspectiveCamera(45, can.parentElement.clientHeight/can.parentElement.clientWidth, 1, 1000);
    camara.position.x = 20;
    camara.position.y = 10;
    camara.position.z = 20;

    renderer = new THREE.WebGLRenderer({canvas: can});

    renderer.setSize( can.parentElement.clientHeight, can.parentElement.clientWidth );
    renderer.render( cena, camara );

    var controlos = new THREE.OrbitControls( camara, renderer.domElement );

    var carregador = new THREE.GLTFLoader(); 
    carregador.load('modelo/vintage-bed.gltf', function ( gltf ) {
        cena.add( gltf.scene );
        cena.traverse( 
            function (elemento) {
                clipe = THREE.AnimationClip.findByName( gltf.animations, 'LocY' );
                acaoY = misturador.clipAction( clipe );
                clipe = THREE.AnimationClip.findByName( gltf.animations, 'LocZ' );
                acaoZ = misturador.clipAction( clipe );
                clipe = THREE.AnimationClip.findByName( gltf.animations, 'RotZ' );
                acaoR = misturador.clipAction( clipe );
        });
    });

    var luz1 = new THREE.PointLight("luz0");
    luz1.position.set( 10, 10, 10 );
    cena.add(luz1);

    //var grelha = new THREE.GridHelper(); 
    //cena.add( grelha );

    relogio = new THREE.Clock();
    misturador = new THREE.AnimationMixer(cena);

}

function animar() { 
    requestAnimationFrame( animar );
    renderer.render( cena, camara ); 
    misturador.update( relogio.getDelta() );
}

function alterarValorDropDown() {
    d = document.getElementById("menu_loop").value;
    acaoZ.reset();
    acaoY.reset();
    acaoR.reset();
    switch(d){
        case "1":
            acaoZ.setLoop( THREE.LoopOnce);
            acaoY.setLoop( THREE.LoopOnce);
            acaoR.setLoop( THREE.LoopOnce);
            acaoZ.clampWhenFinished = true;
            acaoY.clampWhenFinished = true;
            acaoR.clampWhenFinished = true;
        break;
        case "2":
            acaoZ.setLoop( THREE.LoopRepeat);
            acaoY.setLoop( THREE.LoopRepeat);
            acaoR.setLoop( THREE.LoopRepeat);
        break;
        case "3":
            acaoZ.setLoop( THREE.LoopPingPong);
            acaoY.setLoop( THREE.LoopPingPong);
            acaoR.setLoop( THREE.LoopPingPong);
        break;
    }
}

function changeLight(){
    lightNumber++;
    switch(lightNumber){
        case 0:

        break;

        case 1:

        break;
    }

    
}