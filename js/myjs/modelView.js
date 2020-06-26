class ModelView {
  constructor() {
    // 現在表示中のメッシュ
    this.nowMesh = null;
    this.meshArray = new Array();

    // scene
    this.scene = null;
    // カメラ
    this.camera = null;
    // ライト
    this.renderer = null;

    // モデルローダー
    this.loader = null;
    this.textureLoader = null;
    // 壁メッシュ
    this.wallObjArray = new Array();
    // 床メッシュ
    this.floorObj = null;
    // 平行光源
    this.dirLight = null;
  }

  Init(width, height, cameraPos, cameraTargetPos) {
    var canvas3D = document.querySelector("#Canvas3D");
    // レンダラー作成
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas3D,
      antialias: true,
    });

    // デバイスピクセル比の設定
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // レンダラーのサイズ指定
    this.renderer.setSize(width, height);
    // 背景色の設定
    this.renderer.setClearColor(0xf9f6f4, 1.0);

    // シーン作成
    this.scene = new THREE.Scene();

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    this.Resize(width,height);

    this.orbit = new THREE.OrbitControls(this.camera, canvas3D);
    this.orbit.target.set(cameraTargetPos.x, cameraTargetPos.y, cameraTargetPos.z);

    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.05;
    this.orbit.screenSpacePanning = false;

    this.orbit.minDistance = 10;
    this.orbit.maxDistance = 500;
    // パンの無効化
    this.orbit.enablePan = true;

    // 平行光源
    this.dirLight = new THREE.DirectionalLight(0xffffff);
    this.dirLight.intensity = window.dataMng.GetDirLightIntensity();
    this.dirLight.position.set(1, 1, 1);

    this.scene.add(this.dirLight);

    // アンビエントライト
    var ambientLight = new THREE.AmbientLight(0x444444, 1.0);
    this.scene.add(ambientLight); // 壁メッシュと床メッシュの作成

    let geometry = new THREE.PlaneGeometry(1000, 500, 1);
    // テクスチャローダー作成
    this.textureLoader = new THREE.TextureLoader();


    // ダミーのマテリアル作成
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
    // 床作成

    // 床情報取得
    let floor_info = window.dataMng.GetNowModelFloorInfo();

    // 床メッシュ作成
    this.floorObj = new THREE.Mesh(geometry, material);
    this.floorObj.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(this.floorObj);

    // 床テクスチャ設定
    this.ChangeFloorTexture(floor_info);

    // 壁用のメッシュ作成(2個)
    for (let wallIdx = 0; wallIdx < 2; wallIdx++) {

      // 
      let wallMesh = new THREE.Mesh(geometry, material);
      wallMesh.name = "" + wallIdx;
      this.wallObjArray.push( wallMesh);
      this.scene.add(wallMesh);
    }

    // 壁設定
    this.SetWall(window.dataMng.GetNowModelWallInfo());

    // モデルの読み込み
    // ローダー作成
    this.loader = new THREE.FBXLoader();
    // モデルのロード
    this.SetModelInfo( window.dataMng.GetNowModelPath() );

  }
  /**
   *モデル切り替え
   *
   * @param {*} id
   */

  SetModel(modelPath, wallPos, floorPos) {
    // 現在のモデルを削除
    this.scene.remove(this.nowMesh);

    // モデル
    this.loader.load(modelPath, (obj) => {
      // 読み込んだモデルをcache
      obj.rotation.set(0, 0, 0);
      this.nowMesh = obj;

      this.scene.add(this.nowMesh);

      // 床、壁の座標移動
      this.wallObj.position.set(wallPos.x, wallPos.y, wallPos.z);
      this.floorObj.position.set(floorPos.x, floorPos.y, floorPos.z);
    });
  }

  
  /**
   *壁の読み込み
   *
   * @param {*} WallPathArray
   * @param {*} posArray
   * @memberof ModelView
   */
  SetWall(WallInfo){
    // 全部開放して行うか？

    let newWallNum = WallInfo.length;

    for (let wallIdx = 0; wallIdx < this.wallObjArray.length; wallIdx++) {
      const element = this.wallObjArray[wallIdx];

      // 表示する必要数の確認
      if( wallIdx < newWallNum ){
        // 表示設定
        element.visible = true;
        // 座標設定
        element.position.set( WallInfo[wallIdx].POS.x, WallInfo[wallIdx].POS.y, WallInfo[wallIdx].POS.z );
        element.rotation.set( WallInfo[wallIdx].ROT.x, WallInfo[wallIdx].ROT.y, WallInfo[wallIdx].ROT.z );
        // テクスチャの読み込み
        this.textureLoader.load(WallInfo[wallIdx].PATH, 
          (texture) => 
          { 
            // 現在のテクスチャを開放
            if(element.material.map){
              element.material.map.dispose();
            }

            if(element.material)
            {
              element.material.dispose();
            }

            // 読み込んだテクスチャを設定
            let wall_mat = new THREE.MeshBasicMaterial({
              map:texture,
              side: THREE.FrontSide,
            });
            element.material = wall_mat;
            element.material.map.wrapS = THREE.RepeatWrapping;
            element.material.map.wrapT = THREE.RepeatWrapping;
            element.material.map.repeat.set(16, 16);

          });
        continue;
      }
      // 表示不要の為、メッシュを非表示にする
      element.visible = false;
    }

  }

  
  /**
   *モデルの読み込み
   *
   * @param {*} modelInfoArray
   * @memberof ModelView
   */
  SetModelInfo( modelInfoArray ){

    // リストのモデルをすべて破棄
    this.meshArray.forEach(element => {
      this.scene.remove(element);
    });

    // 配列を空にする
    this.meshArray.length = 0;
    // 次のモデルをロードし、配列に登録する
    for (let modelIdx = 0; modelIdx < modelInfoArray.length; ++modelIdx) {
      const element = modelInfoArray[modelIdx];
      // モデル読み込み
      this.loader.load( element.PATH, (obj)=>{
        // 読み込んだモデルの座標、角度設定
        obj.rotation.set(0, 0, 0);
        obj.position.set(element.POS.x,element.POS.y, element.POS.z);

        // シーンに追加
        this.scene.add(obj);
        // 配列にキャッシュ
        this.meshArray.push(obj);
      } );
    }
  }


  ChangeWallTexture(path){
    this.textureLoader.load(path, 
      (texture) => 
      { 
        // 現在のテクスチャを開放
        if(this.wallObj.material.map){
          this.wallObj.material.map.dispose();
        }
        // 読み込んだテクスチャを設定
        this.wallObj.material.map = texture;

        this.wallObj.material.map.wrapS = THREE.RepeatWrapping;
        this.wallObj.material.map.wrapT = THREE.RepeatWrapping;
        this.wallObj.material.map.repeat.set(16, 16);
      });
  }

  ChangeFloorTexture(floorInfo){
    this.textureLoader.load(floorInfo[0].PATH, 
      (texture) => 
      { 
        // 現在のテクスチャを開放
        if(this.floorObj.material.map){
          this.floorObj.material.map.dispose();
        }

        if( this.floorObj.material ){
          this.floorObj.material.dispose();
        }
        // 読み込んだテクスチャを設定
        let floor_mat = new THREE.MeshBasicMaterial({
          map:texture,
          side: THREE.FrontSide,
        });
        this.floorObj.material = floor_mat;
        this.floorObj.material.map.wrapS = THREE.RepeatWrapping;
        this.floorObj.material.map.wrapT = THREE.RepeatWrapping;
        this.floorObj.material.map.repeat.set(16, 16);
        this.floorObj.position.set(floorInfo[0].POS.x, floorInfo[0].POS.y, floorInfo[0].POS.z);
        this.floorObj.rotation.set(floorInfo[0].ROT.x, floorInfo[0].ROT.y, floorInfo[0].ROT.z);
      });
  }



  /**
   *カメラの座標設定
   *
   * @param {*} pos
   * @memberof ModelView
   */
  SetCameraPos(pos){
    this.camera.position.set( pos.x, pos.y, pos.z);
  }

  /**
   *カメラの注視点設定
   *
   * @param {*} rot
   * @memberof ModelView
   */
  SetCameraTargetPos(rot){

    this.orbit.target.set( rot.x, rot.y, rot.z);
  }

  /**
   *平行光源の強さ設定
   *
   * @memberof modelView
   */
  SetDirLightIntensity(intensity) {
    this.dirLight.intensity = intensity;
  }

  Resize(width, height) {
    // デバイスピクセル比の設定
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // レンダラーのサイズ指定
    this.renderer.setSize(width, height);

    // カメラ修正
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // 描画
  Render(){
    this.orbit.update();

    this.renderer.render(this.scene, this.camera);
  }

}

