var camera, cena, renderer;
var geometry, material, mesh, stats;
var renderer, relogio, misturador ;
var acao1 = [];
var acao2 = [];
var luzIntensidade = 1;
var cena;
var divan;
var estruturaCama;


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

    renderer.shadowMap.enabled = true;
    cena.castShadow = true;
    cena.receiveShadow = true; 

    var controlos = new THREE.OrbitControls( camara, renderer.domElement );

    var carregador = new THREE.GLTFLoader(); 
    carregador.load('modelo/vintag.gltf', function ( gltf ) {
        cena.add( gltf.scene );
        cena.traverse( 
            function (elemento) {
                if(acao1.length != 6) {
                    clipe = THREE.AnimationClip.findByName( gltf.animations, 'bed-mattressAction.001' );
                    acao1.push(misturador.clipAction(clipe));
                    clipe = THREE.AnimationClip.findByName( gltf.animations, 'bed-platformAction.001' );
                    acao1.push(misturador.clipAction(clipe));
                    clipe = THREE.AnimationClip.findByName( gltf.animations, 'bed-structureAction.001' );
                    acao1.push(misturador.clipAction(clipe));
                    clipe = THREE.AnimationClip.findByName( gltf.animations, 'divanAction.001' );
                    acao1.push(misturador.clipAction(clipe));
                    clipe = THREE.AnimationClip.findByName( gltf.animations, 'divan-mattressAction.001' );
                    acao1.push(misturador.clipAction(clipe));
                    clipe = THREE.AnimationClip.findByName( gltf.animations, 'pillowAction' );
                    acao1.push(misturador.clipAction(clipe));
                }
                if(elemento.isMesh){
                    elemento.castShadow = true;
                    elemento.receiveShadow = true;
                    if(elemento.name == "bed-structure"){
                        estruturaCama = elemento;
                    }
                    if(elemento.name == "divan"){
                        divan = elemento;
                    }
                }
        });
    });

    var luz0 = new THREE.PointLight("white");
    luz0.position.set( 10, 10, 10 );
    luz0.name = "luz0";
    luz0.intensity = 1;
    luz0.castShadow = true;
    cena.add(luz0);
    var luz1 = new THREE.PointLight("white");
    luz1.position.set( 10, 20, 0 );
    luz1.intensity = 0;
    luz1.castShadow = true;
    luz1.name = "luz1";
    cena.add(luz1);
    var luz2 = new THREE.PointLight("white");
    luz2.position.set( 20, 10, 5 );
    luz2.intensity = 0;
    luz2.castShadow = true;
    luz2.name = "luz2";
    cena.add(luz2);
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    light.intensity = 0;
    light.name = "ambientLight";
    cena.add(light);

    //var grelha = new THREE.GridHelper(); 
    //cena.add( grelha );

    relogio = new THREE.Clock();
    misturador = new THREE.AnimationMixer(cena);
    console.log(cena);

    var slider = document.getElementById("myRange");
    slider.oninput = function() {
        luzIntensidade = this.value/10;
        if(cena.getObjectByName("luz0").intensity != 0){
            cena.getObjectByName("luz0").intensity = luzIntensidade;
        }else{
            if(cena.getObjectByName("luz1").intensity != 0){
                cena.getObjectByName("luz1").intensity = luzIntensidade;
            }else{
                cena.getObjectByName("luz2").intensity = luzIntensidade;
            }
        }
    }

    var cor = localStorage["color"];
    var textura = localStorage["textura"];

    if(cor != 0){
        var dropDownCor = document.getElementById("DropDownCor");
        dropDownCor.value = cor;
    }
    if(textura != 0){
        var dropDownTextura = document.getElementById("DropDownTextura");
        dropDownTextura.value = textura;
    }

}

function animar() { 
    requestAnimationFrame( animar );
    renderer.render( cena, camara ); 
    misturador.update( relogio.getDelta() );
}

function newTexture(textura) {
    if(textura == "nenhuma"){
        estruturaCama.material.map = null;
        estruturaCama.material.needsUpdate = true;
        divan.material.map = null;
        divan.material.needsUpdate = true;
    }else{
        var newTexturePath = "modelo/"+textura+".jpg";

        var tex = THREE.ImageUtils.loadTexture(newTexturePath);
        estruturaCama.material.map = tex;
        estruturaCama.material.needsUpdate = true;
        divan.material.map = tex;
        divan.material.needsUpdate = true;
    }
}


function onChangeTexture(){
    var textura = document.getElementById("DropDownTextura").value;
    newTexture(textura);
}

function changeLight(lightNumber){
    switch(lightNumber){
        case 0:
            cena.getObjectByName("luz0").intensity = luzIntensidade;
            cena.getObjectByName("luz1").intensity = 0;
            cena.getObjectByName("luz2").intensity = 0;
        break;
        case 1:
            cena.getObjectByName("luz1").intensity = luzIntensidade;
            cena.getObjectByName("luz0").intensity = 0;
            cena.getObjectByName("luz2").intensity = 0;
        break;
        case 2:
            cena.getObjectByName("luz2").intensity = luzIntensidade;
            cena.getObjectByName("luz0").intensity = 0;
            cena.getObjectByName("luz1").intensity = 0;
        break;
    }
}

function cbLuzAmbienteOnClick() {
    var checkBox = document.getElementById("cbLuzAmbiente");
    if(checkBox.checked){
        cena.getObjectByName("ambientLight").intensity = 1;
    }else{
        cena.getObjectByName("ambientLight").intensity = 0;
    }
}

function onChangeColor(){
    var hex = document.getElementById("DropDownCor").value;
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    var cor = new THREE.Color("rgb("+r+","+g+","+b+")");
    divan.material.color = cor;
    estruturaCama.material.color = cor;
}

function cbSombrasOnClick() {
    var checkBox = document.getElementById("cbSombras");
    if (checkBox.checked){
        cena.getObjectByName("luz0").castShadow = true;
        cena.getObjectByName("luz1").castShadow = true;
        cena.getObjectByName("luz2").castShadow = true;
    } else {
        cena.getObjectByName("luz0").castShadow = false;
        cena.getObjectByName("luz1").castShadow = false;
        cena.getObjectByName("luz2").castShadow = false;
    }
}

function animationSelected(){
    if(document.getElementById("animation1").style.display == "block"){
        document.getElementById("animation1").style.display = "none";
        document.getElementById("animation2").style.display = "none";
        if(document.getElementById("animation11").style.display == "block"){
            document.getElementById("animation11").style.display = "none";
            document.getElementById("animation12").style.display = "none";
            document.getElementById("animation13").style.display = "none";
            stopAction(acao1);
        }
        if(document.getElementById("animation21").style.display == "block"){
            document.getElementById("animation21").style.display = "none";
            document.getElementById("animation22").style.display = "none";
            document.getElementById("animation23").style.display = "none";
            stopAction(acao2);
        }
    }else{
        document.getElementById("animation1").style.display = "block";
        document.getElementById("animation2").style.display = "block";
    }
}


function animateAction1(){
    if(document.getElementById("animation11").style.display == "block"){
        document.getElementById("animation11").style.display = "none";
        document.getElementById("animation12").style.display = "none";
        document.getElementById("animation13").style.display = "none";
        stopAction(acao1);
    }else{
        document.getElementById("animation11").style.display = "block";
        document.getElementById("animation12").style.display = "block";
        document.getElementById("animation13").style.display = "block";
        startAction(acao1);
    }
}

function startAction1(){
    startAction(acao1);
}

function stopAction1(){
    stopAction(acao1);
}

function pauseAction1(){
    pauseAction(acao1);
}

function animateAction2(){
    if(document.getElementById("animation21").style.display == "block"){
        document.getElementById("animation21").style.display = "none";
        document.getElementById("animation22").style.display = "none";
        document.getElementById("animation23").style.display = "none";
        stopAction(acao2);
    }else{
        document.getElementById("animation21").style.display = "block";
        document.getElementById("animation22").style.display = "block";
        document.getElementById("animation23").style.display = "block";
        startAction(acao2);
    }
}

function startAction2(){
    startAction(acao2);
}

function stopAction2(){
    stopAction(acao2);
}

function pauseAction2(){
    pauseAction(acao2);
}

function startAction(acao){
    acao.forEach(element => {
        element.play();
        if(element.paused){
            element.paused = false;
        }
    });
}

function stopAction(acao){
    acao.forEach(element => {
        element.stop();
    });
}

function pauseAction(acao){
    acao.forEach(element => {
        if(element.paused){
            element.paused = false;
        }else{
            element.paused = true;
        }
    });
}