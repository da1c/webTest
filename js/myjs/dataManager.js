class dataManager {
  /**
   *Creates an instance of dataManager.
   * @memberof dataManager
   */
  constructor() {
    this.StyleInfoArray = null;
    this.itemInfoArray = null;
    this.nowStyleID = 1;
    this.prevStyleID = 0;
    this.colorInfoArray = null;
    this.nowItemID = 0;
    this.selectDetailID = -1;
    this.selectColorTypeID = -1;
    this.SrcType = { IMG : 1, VIDEO : 2 };
    this.videoInfoArray = null;
    this.webCatarogURL = "";
    this.homePageURL = "";
    this.DISPSIZE = { NORMAL : 1, WIDE : 2 };

    // 現在のseriesのID
    this.nowItemIDArray = null;

  }

  SelectStyleID(selectID){
    // 選択中のスタイルID更新
    this.prevStyleID = this.nowStyleID;
    this.nowStyleID = selectID;
    // 選択中の更新行っておくか

    if( this.findStyle( (checkEle)=>{ return checkEle.ID == selectID; }, (targetEle)=>{ this.nowItemIDArray = targetEle.ITEM_ID; } )){
      return;
    }

    console.error("指定したIDのスタイル無し");
  }

  /**
   *スタイルが切り替わったか確認
   *
   * @returns
   * @memberof dataManager
   */
  CheckChangeStyle(){
    return this.nowStyleID != this.prevStyleID;
  }

  findStyle(findFunc, resultFunc){
    for (let itemIdx = 0; itemIdx < this.StyleInfoArray.length; itemIdx++) {
      let element = this.StyleInfoArray[itemIdx];
      
      // 指定したスタイルIDと一致するか確認
      if(findFunc(element)){
        resultFunc(element);
        return true;
      }
    }

    return false;
  }

  GetNowStyleWallTexturePath(){
    let path = "";
    if( this.findStyle( (checkEle)=>{ return checkEle.ID == this.nowStyleID; }, (targetEle)=>{ path = targetEle.WALL_TEXTURE_PATH; } )){
      return path;
    }

    console.error("指定したIDのスタイル無し");
    return "";
  }

  GetNowStyleFloorTexturePath(){
    let path = "";
    if( this.findStyle( (checkEle)=>{ return checkEle.ID == this.nowStyleID; }, (targetEle)=>{ path = targetEle.FLOOR_TEXTURE_PATH; } )){
      return path;
    }

    console.error("指定したIDのスタイル無し");
    return "";
  }


  /**
   *初期化処理
   *
   * @memberof dataManager
   */
  Init() {

    this.StyleInfoArray = new Array(

      {
        ID : 1, // ID
        NAME : "スタイル1", // スタイル名
        ITEM_ID : new Array( 1, 2, 3, 4),
        WALL_TEXTURE_PATH : "img/kitchen/1.png",
        FLOOR_TEXTURE_PATH : "img/kitchen/2.png",
      },
      {
        ID : 2, // ID
        NAME : "スタイル2", // スタイル名
        ITEM_ID : new Array( 4, 3, 2, 1),
        WALL_TEXTURE_PATH : "img/kitchen/3.png",
        FLOOR_TEXTURE_PATH : "img/kitchen/4.png",
      },
      {
        ID : 3, // ID
        NAME : "スタイル3", // スタイル名
        ITEM_ID : new Array( 1, 2, 3, 4),
        WALL_TEXTURE_PATH : "img/kitchen/5.png",
        FLOOR_TEXTURE_PATH : "img/kitchen/6.png",
      },
      {
        ID : 4, // ID
        NAME : "スタイル4", // スタイル名
        ITEM_ID : new Array( 2, 2, 2, 2),
        WALL_TEXTURE_PATH : "img/kitchen/7.png",
        FLOOR_TEXTURE_PATH : "img/kitchen/8.png",
      }
    );


    // モデルパスリストの用意(modelView.htmlからの相対パス)
    this.itemInfoArray = new Array(
      {
        ID: 1,
        ModeInfo: new Array( { PATH : "model/kitchen.fbx", POS : new THREE.Vector3( 0, 0, 0)}),
        ItemName: "キッチン",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/1.png", NAME: "1", DISP_SIZE : this.DISPSIZE.WIDE, DETAIL_VALUE:'タイトル<img class="detailInfoImage" src="img/kitchen/1.png">'},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/2.png", NAME: "2", DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:'<img class="detailInfoImage" src="img/kitchen/2.png">'},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/3.png", NAME: "3", DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:'<img class="detailInfoImage" src="img/kitchen/2.png">' + CreateVideoLink("https://www.youtube.com/embed/U5ltyDw43lg", "test")},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/4.png", NAME: "4" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/5.png", NAME: "5" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/6.png", NAME: "6" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/7.png", NAME: "7" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/8.png", NAME: "8" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/9.png", NAME: "9" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/10.png", NAME: "10", DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE:this.SrcType.VIDEO, SRC: "img/toire/10.png", NAME:"1", DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""}
        ),
        ARURL: "",
        COLOR: new Array(
          {
            COLOR_CATEGORY: "カラー1箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          },
          {
            COLOR_CATEGORY: "カラー2箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          },
          {
            COLOR_CATEGORY: "カラー3箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          }
        ),
        WALL_INFO : new Array({ PATH : "img/kitchen/1.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(0, 0, 0) }),
        FLOOR_INFO : new Array({ PATH : "img/kitchen/1.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(-Math.PI / 2, 0, 0)  }),
        WALL_POS:new THREE.Vector3(0,0,0),
        FLOOR_POS:new THREE.Vector3(0,0,0),
        WEB_CATAROG_URL:"",
        INSTRUCTION_URL:"",
        DIR_LIGHT_INTENSITY : 3,
        CAMERA_POS : new THREE.Vector3( 0, 100, 100 ),
        CAMERA_ROT : new THREE.Vector3( 10, 0, 0 )
      },
      {
        ID: 2,
        ModeInfo: new Array( { PATH : "model/bathroom.fbx", POS : new THREE.Vector3( 0, 0, 0)}),
        ItemName: "バスルーム",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG,SRC: "img/bath/1.png", NAME: "1" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/2.png", NAME: "2" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/3.png", NAME: "3" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/4.png", NAME: "4" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/5.png", NAME: "5" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/6.png", NAME: "6" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/7.png", NAME: "7" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/8.png", NAME: "8" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/9.png", NAME: "9" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/bath/10.png", NAME: "10" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""}
        ),
        ARURL: "",
        COLOR: new Array(
          {
            COLOR_CATEGORY: "カラー1箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          },
          {
            COLOR_CATEGORY: "カラー2箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          },
          {
            COLOR_CATEGORY: "カラー3箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          }
        ),
        WALL_INFO : new Array({ PATH : "img/kitchen/4.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(0,0,0)  }),
        FLOOR_INFO : new Array({ PATH : "img/kitchen/4.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(-Math.PI / 2,0,0)  }),
        WEB_CATAROG_URL:"",
        INSTRUCTION_URL:"",
        DIR_LIGHT_INTENSITY : 0.5,
        CAMERA_POS : new THREE.Vector3( 0, 100, 100 ),
        CAMERA_ROT : new THREE.Vector3( 0, 0, 0 )
      },
      {
        ID: 3,
        ModeInfo: new Array( { PATH : "model/makebase.fbx", POS : new THREE.Vector3( 0, 0, 0)}),
        ItemName: "化粧台",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/1.png", NAME: "1" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/2.png", NAME: "2" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/3.png", NAME: "3" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/4.png", NAME: "4" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/5.png", NAME: "5" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/6.png", NAME: "6" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/7.png", NAME: "7" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/8.png", NAME: "8" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/9.png", NAME: "9" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/10.png", NAME: "10" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""}
        ),
        ARURL: "",
        COLOR: new Array(
          {
            COLOR_CATEGORY: "カラー1箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          },
          {
            COLOR_CATEGORY: "カラー2箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          },
          {
            COLOR_CATEGORY: "カラー3箇所",
            COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
          }
        ),
        WALL_INFO : new Array(
          { PATH : "img/kitchen/2.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(0,0,0) }, 
          { PATH : "img/kitchen/3.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(0,Math.PI / 2,0) }),
        FLOOR_INFO : new Array({ PATH : "img/kitchen/3.png", POS : new THREE.Vector3( 0,0,0),ROT:new THREE.Vector3(-Math.PI / 2,0,0)  }),
        WEB_CATAROG_URL:"",
        INSTRUCTION_URL:"",
        DIR_LIGHT_INTENSITY : 0.5,
        CAMERA_POS : new THREE.Vector3( 0, 100, 100 ),
        CAMERA_ROT : new THREE.Vector3( 0, 0, 0 )
      },
      {
        ID: 4,
        ModeInfo: new Array( { PATH : "model/toilet.fbx", POS : new THREE.Vector3( 0, 0, 0)}, { PATH : "model/toilet.fbx", POS : new THREE.Vector3( 100, 0, 0)}),
        ItemName: "トイレ",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG,SRC: "img/toire/1.png", NAME: "1" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/2.png", NAME: "2" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/3.png", NAME: "3" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/4.png", NAME: "4" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/5.png", NAME: "5" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/6.png", NAME: "6" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/7.png", NAME: "7" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/8.png", NAME: "8" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/9.png", NAME: "9" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""},
          { TYPE: this.SrcType.IMG,SRC: "img/toire/10.png", NAME: "10" , DISP_SIZE : this.DISPSIZE.NORMAL, DETAIL_VALUE:""}
        ),
        ARURL: "",
        COLOR: new Array({
          COLOR_CATEGORY: "カラー1箇所",
          COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
        }),
        WALL_INFO : new Array({ PATH : "img/kitchen/4.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(0,0,0)  }),
        FLOOR_INFO : new Array({ PATH : "img/kitchen/5.png", POS : new THREE.Vector3( 0,0,0), ROT:new THREE.Vector3(-Math.PI / 2,0,0)  }),
        WEB_CATAROG_URL:"",
        INSTRUCTION_URL:"",
        DIR_LIGHT_INTENSITY : 0.5,
        CAMERA_POS : new THREE.Vector3( 0, 100, 100 ),
        CAMERA_ROT : new THREE.Vector3( 0, 0, 0 )
      }
    );

    this.colorInfoArray = new Array(
      { ID: 1, SRC: "img/toire/1.png", NAME: "1" },
      { ID: 2, SRC: "img/toire/2.png", NAME: "2" },
      { ID: 3, SRC: "img/toire/3.png", NAME: "3" },
      { ID: 4, SRC: "img/toire/4.png", NAME: "4" },
      { ID: 5, SRC: "img/toire/5.png", NAME: "5" },
      { ID: 6, SRC: "img/toire/6.png", NAME: "6" },
      { ID: 7, SRC: "img/toire/7.png", NAME: "7" },
      { ID: 8, SRC: "img/toire/8.png", NAME: "8" },
      { ID: 9, SRC: "img/toire/9.png", NAME: "9" },
      { ID: 10, SRC: "img/toire/10.png", NAME: "10" }
    );

    this.videoInfoArray= new Array(
      { ID:1, SRC:"https://www.youtube-nocookie.com/embed/U5ltyDw43lg", NAME:"てすと"} );
  }

  /**
   *現在選択中のモデルパスを取得
   *
   * @memberof dataManager
   */
  GetNowModelPath() {
    return this.nowItemInfo.ModeInfo;

  }

  GetNowModelWallInfo(){
    return this.nowItemInfo.WALL_INFO;
  }
  GetNowModelFloorInfo(){
    return this.nowItemInfo.FLOOR_INFO;
  }

  /**
   *現在選択中の商材名を取得
   *
   * @returns
   * @memberof dataManager
   */
  GetNowItemName() {
    return this.nowItemInfo.ItemName;
  }

  /**
   *現在選択中の商材の小組情報を取得
   *
   * @returns
   * @memberof dataManager
   */
  GetNowItemDetailInfo() {
    return this.nowItemInfo.DetailIDArray;
  }

  GetSelectItemDetailInfo() {
    return this.nowItemInfo.DetailIDArray[
      this.selectDetailID
    ];
  }

  GetSelectItemARUrl() {
    return this.nowItemInfo.ARURL;
  }
  /**
   *現在選択中商材のカラー箇所が複数か確認
   *
   * @memberof dataManager
   */

  CheckSelectItemMultiColor() {
　　return this.nowItemInfo.COLOR.length > 1;
  }


  GetSelectColorInfo() {
    return this.nowItemInfo.COLOR;
  }

  SetSelectColorType(ID){
    this.selectColorTypeID = ID;
  }

  GetSelectColorTypeInfo(){
    return this.nowItemInfo.COLOR[ this.selectColorTypeID];
  }

  GetColorInfo(colorID){
    for (let index = 0; index < this.colorInfoArray.length; index++) {
      if (colorID == this.colorInfoArray[index].ID) {
        return this.colorInfoArray[index];
      }
    }

    return null;
  }


  CheckIMGSrcType( check ){
    return this.SrcType.IMG == check;
  }

  GetVideoInfo(videoID){
    for (let index = 0; index < this.videoInfoArray.length; index++) {
      if (videoID == this.videoInfoArray[index].ID) {
        return this.videoInfoArray[index];
      }
    }

    return null;
  }

  GetWebCataroguURL(){
    return this.nowItemInfo.WEB_CATAROG_URL;
  }

  GetHomePageURL(){
    return this.homePageURL;
  }


  CheckDispSize( check ){
    return this.DISPSIZE.NORMAL == check;
  }

  GetInstructionURL(){
    return this.nowItemInfo.INSTRUCTION_URL;
  }


  /**
   *選択中の商材の平行光源の強さを取得
   *
   * @returns
   * @memberof dataManager
   */
  GetDirLightIntensity(){
    return this.nowItemInfo.DIR_LIGHT_INTENSITY;
  }

  /**
   *スタイル情報取得
   *
   * @returns
   * @memberof dataManager
   */
  GetStyleInfoArray(){
    return this.StyleInfoArray;
  }

  // 選択した商材情報を取得
  SetSelectItemID(idx){
    // 現状は配列
    let itemID = this.nowItemIDArray[idx];

    for (let itemIdx = 0; itemIdx < this.itemInfoArray.length; itemIdx++) {
      const element = this.itemInfoArray[itemIdx];
      if( element.ID == itemID ){
        this.nowItemID = itemID;
        this.nowItemInfo = this.itemInfoArray[itemIdx];
        return;
      }
    }

    console.error("選択した情報なし");
  }

  
  /**
   *商材のカメラの初期座標取得
   *
   * @returns
   * @memberof dataManager
   */
  GetCameraPos(){
    return this.nowItemInfo.CAMERA_POS;
  }

    /**
   *商材のカメラの初期角度取得
   *
   * @returns
   * @memberof dataManager
   */
  GetCameraRot(){
    return this.nowItemInfo.CAMERA_ROT;
  }

}
