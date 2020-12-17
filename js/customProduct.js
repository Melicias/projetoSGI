var camera, cena, renderer;
var geometry, material, mesh, stats;
var renderer, relogio, misturador ;
var acaoY, acaoZ, acaoR;

init();
animar();

function init(){
    cena = new THREE.Scene();

    camara = new THREE.PerspectiveCamera(70, 800 / 600, 0.01, 10);
    camara.position.x = 6;
    camara.position.y = 4;
    camara.position.z = 7;

    var can = document.getElementById('meuCanvas');
    renderer = new THREE.WebGLRenderer({canvas: can});

    renderer.setSize( can.parentElement.clientHeight, can.parentElement.clientWidth );
    renderer.render( cena, camara );

    var controlos = new THREE.OrbitControls( camara, renderer.domElement );

    var carregador = new THREE.GLTFLoader(); 
    carregador.load('cena.gltf', function ( gltf ) {
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

    var luzPonto1 = new THREE.PointLight( "white" );
    luzPonto1.position.set( 5, 3, 5 );
    cena.add(luzPonto1);

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