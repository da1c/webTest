class dataManager {
  /**
   *Creates an instance of dataManager.
   * @memberof dataManager
   */
  constructor() {
    this.itemInfoArray = null;
    this.nowItemID = -1;
  }

  /**
   *初期化処理
   *
   * @memberof dataManager
   */
  Init() {
    // モデルパスリストの用意(modelView.htmlからの相対パス)
    this.itemInfoArray = new Array(
      {
        ID: 1,
        ModelPath: "model/kitchen.fbx",
        ItemName:"キッチン",
        DetailIDArray: new Array(
          { IMG:"img/kitchen/1.png", NAME:"1"},
          { IMG:"img/kitchen/2.png", NAME:"2"},
          { IMG:"img/kitchen/3.png", NAME:"3"},
          { IMG:"img/kitchen/4.png", NAME:"4"},
          { IMG:"img/kitchen/5.png", NAME:"5"},
          { IMG:"img/kitchen/6.png", NAME:"6"},
          { IMG:"img/kitchen/7.png", NAME:"7"},
          { IMG:"img/kitchen/8.png", NAME:"8"},
          { IMG:"img/kitchen/9.png", NAME:"9"},
          { IMG:"img/kitchen/10.png", NAME:"10"}
        ),
      },
      {
        ID: 2,
        ModelPath: "model/bathroom.fbx",
        ItemName:"バスルーム",
        DetailIDArray: new Array(
          { IMG:"img/bath/1.png", NAME:"1"},
          { IMG:"img/bath/2.png", NAME:"2"},
          { IMG:"img/bath/3.png", NAME:"3"},
          { IMG:"img/bath/4.png", NAME:"4"},
          { IMG:"img/bath/5.png", NAME:"5"},
          { IMG:"img/bath/6.png", NAME:"6"},
          { IMG:"img/bath/7.png", NAME:"7"},
          { IMG:"img/bath/8.png", NAME:"8"},
          { IMG:"img/bath/9.png", NAME:"9"},
          { IMG:"img/bath/10.png", NAME:"10"}
        ),
      },
      {
        ID: 3,
        ModelPath: "model/makebase.fbx",
        ItemName:"化粧台",
        DetailIDArray: new Array(
          { IMG:"img/senmen/1.png", NAME:"1"},
          { IMG:"img/senmen/2.png", NAME:"2"},
          { IMG:"img/senmen/3.png", NAME:"3"},
          { IMG:"img/senmen/4.png", NAME:"4"},
          { IMG:"img/senmen/5.png", NAME:"5"},
          { IMG:"img/senmen/6.png", NAME:"6"},
          { IMG:"img/senmen/7.png", NAME:"7"},
          { IMG:"img/senmen/8.png", NAME:"8"},
          { IMG:"img/senmen/9.png", NAME:"9"},
          { IMG:"img/senmen/10.png", NAME:"10"}
        ),
      },
      {
        ID: 4,
        ModelPath: "model/toilet.fbx",
        ItemName:"トイレ",
        DetailIDArray: new Array(
          { IMG:"img/toire/1.png", NAME:"1"},
          { IMG:"img/toire/2.png", NAME:"2"},
          { IMG:"img/toire/3.png", NAME:"3"},
          { IMG:"img/toire/4.png", NAME:"4"},
          { IMG:"img/toire/5.png", NAME:"5"},
          { IMG:"img/toire/6.png", NAME:"6"},
          { IMG:"img/toire/7.png", NAME:"7"},
          { IMG:"img/toire/8.png", NAME:"8"},
          { IMG:"img/toire/9.png", NAME:"9"},
          { IMG:"img/toire/10.png", NAME:"10"}
        ),
      }
    );
  }


  /**
   *現在選択中のモデルパスを取得
   *
   * @memberof dataManager
   */
  GetNowModelPath(){
    return this.itemInfoArray[this.nowItemID].ModelPath;
  }


  /**
   *現在選択中の商材名を取得
   *
   * @returns
   * @memberof dataManager
   */
  GetNowItemName(){
    return this.itemInfoArray[this.nowItemID].ItemName;
  }


  /**
   *現在選択中の商材の小組情報を取得
   *
   * @returns
   * @memberof dataManager
   */
  GetNowItemDetailInfo(){
    return this.itemInfoArray[this.nowItemID].DetailIDArray; 
  }

}
