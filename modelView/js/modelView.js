"use strict";

window.addEventListener("DOMContentLoaded", Init);


function Init() {

  var canvas3D = document.querySelector("#Canvas3D");
  // レンダラー作成
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas3D,
    antialias: true
  });

  // デバイスピクセル比の設定
  renderer.setPixelRatio(window.devicePixelRatio);
  // レンダラーのサイズ指定
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // シーン作成
  const scene = new THREE.Scene();
  
  // カメラ作成
  const camera =  new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,100, 100);

  var orbit = new THREE.OrbitControls(camera, canvas3D );
  orbit.target.set(0,0,0);

  orbit.enableDamping = true;
  orbit.dampingFactor = 0.05;
  orbit.screenSpacePanning = false;

  orbit.minDistance = 100;
  orbit.maxDistance = 500;
  // パンの無効化
  orbit.enablePan = true;

  // 平行光源
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 1; // 光の強さを倍に
  light.position.set(1, 1, 1);

  scene.add(light);

  // モデルの読み込み
  // ローダー作成
  var loader = new THREE.FBXLoader();

  loader.load( './model/kitchen.fbx', obj=>{  
    // 

    scene.add(obj);
    Animation();
  } );



  // レンダリング
  function Animation(){
      requestAnimationFrame(Animation);
      renderer.render(scene, camera);
  }

  // 画面サイズ更新イベントにリサイズ処理を登録
  window.addEventListener("reize", Resize);

  // 画面リサイズ時の処理
  function Resize(){
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 
    // デバイスピクセル比の設定
    renderer.setPixelRatio(window.devicePixelRatio);
    // レンダラーのサイズ指定
    renderer.setSize(width, height);

    // カメラ修正
    camera.aspect= width/height;
    camera.updateProjectionMatrix();
  }

}
