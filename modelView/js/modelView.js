"use strict";

window.addEventListener("DOMContentLoaded", Init);

const modePathArray = new Array(
  "model/kitchen.fbx",
  "model/bathroom.fbx",
  "model/makebase.fbx",
  "model/toilet.fbx"
);

var modelview = null;

function Init() {
  modelview = new modelView();
  modelview.Init();
}

class modelView {
  constructor() {
    // 現在表示中のメッシュ
    this.nowMesh = null;
    // メッシュのIDX
    this.nowMeshID = -1;

    // scene
    this.scene = null;
    // カメラ
    this.camera = null;
    // ライト
    this.renderer = null;

    // モデルローダー
    this.loader = null;
  }

  Init() {
    var canvas3D = document.querySelector("#Canvas3D");
    // レンダラー作成
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas3D,
      antialias: true,
    });

    // デバイスピクセル比の設定
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // レンダラーのサイズ指定
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // シーン作成
    this.scene = new THREE.Scene();

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 100, 100);

    var orbit = new THREE.OrbitControls(this.camera, canvas3D);
    orbit.target.set(0, 0, 0);

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

    this.scene.add(light);

    // アンビエントライト
    var ambientLight = new THREE.AmbientLight(0x444444,1.0);
    this.scene.add(ambientLight);
    // モデルの読み込み
    // ローダー作成
    this.loader = new THREE.FBXLoader();

    // モデルのロード
    this.loader.load(modePathArray[0], (obj) => {
      // 読み込んだモデルをcache
      obj.rotation.set(0, 0, 0);
      this.nowMesh = obj;
      // シーンに追加
      this.scene.add(this.nowMesh);
      Animation();
    });
  }
  /**
   *モデル切り替え
   *
   * @param {*} id
   */

  SetModel(id) {
    // 現在のモデルを削除
    this.scene.remove(this.nowMesh);
    //this.nowMesh.material.dispose();
    //this.nowMesh.geometry.dispose();

    // モデル
    this.loader.load(modePathArray[id], (obj) => {
      // 読み込んだモデルをcache
      obj.rotation.set(0, 0, 0);
      this.nowMesh = obj;
      this.nowMeshID = id;
      this.scene.add(this.nowMesh);
    });
  }
}

// 画面サイズ更新イベントにリサイズ処理を登録
window.addEventListener("resize", Resize);

// 画面リサイズ時の処理
function Resize() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  //
  // デバイスピクセル比の設定
  modelview.renderer.setPixelRatio(window.devicePixelRatio);
  // レンダラーのサイズ指定
  modelview.renderer.setSize(width, height);

  // カメラ修正
  modelview.camera.aspect = width / height;
  modelview.camera.updateProjectionMatrix();
}

// レンダリング
function Animation() {
  requestAnimationFrame(Animation);
  modelview.renderer.render(modelview.scene, modelview.camera);
}
