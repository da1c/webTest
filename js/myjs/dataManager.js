class dataManager {
  /**
   *Creates an instance of dataManager.
   * @memberof dataManager
   */
  constructor() {
    this.itemInfoArray = null;
    this.colorInfoArray = null;
    this.nowItemID = -1;
    this.selectDetailID = -1;
    this.selectColorTypeID = -1;
    this.SrcType = { IMG : 1, VIDEO : 2 };
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
        ItemName: "キッチン",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/1.png", NAME: "1" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/2.png", NAME: "2" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/3.png", NAME: "3" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/4.png", NAME: "4" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/5.png", NAME: "5" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/6.png", NAME: "6" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/7.png", NAME: "7" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/8.png", NAME: "8" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/9.png", NAME: "9" },
          { TYPE: this.SrcType.IMG, SRC: "img/kitchen/10.png", NAME: "10" },
          { TYPE:this.SrcType.VIDEO, SRC: "https://www.youtube-nocookie.com/embed/U5ltyDw43lg", NAME:"1"}
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
      },
      {
        ID: 2,
        ModelPath: "model/bathroom.fbx",
        ItemName: "バスルーム",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG,SRC: "img/bath/1.png", NAME: "1" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/2.png", NAME: "2" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/3.png", NAME: "3" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/4.png", NAME: "4" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/5.png", NAME: "5" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/6.png", NAME: "6" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/7.png", NAME: "7" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/8.png", NAME: "8" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/9.png", NAME: "9" },
          { TYPE: this.SrcType.IMG,SRC: "img/bath/10.png", NAME: "10" }
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
      },
      {
        ID: 3,
        ModelPath: "model/makebase.fbx",
        ItemName: "化粧台",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/1.png", NAME: "1" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/2.png", NAME: "2" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/3.png", NAME: "3" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/4.png", NAME: "4" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/5.png", NAME: "5" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/6.png", NAME: "6" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/7.png", NAME: "7" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/8.png", NAME: "8" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/9.png", NAME: "9" },
          { TYPE: this.SrcType.IMG,SRC: "img/senmen/10.png", NAME: "10" }
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
      },
      {
        ID: 4,
        ModelPath: "model/toilet.fbx",
        ItemName: "トイレ",
        DetailIDArray: new Array(
          { TYPE: this.SrcType.IMG,SRC: "img/toire/1.png", NAME: "1" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/2.png", NAME: "2" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/3.png", NAME: "3" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/4.png", NAME: "4" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/5.png", NAME: "5" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/6.png", NAME: "6" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/7.png", NAME: "7" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/8.png", NAME: "8" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/9.png", NAME: "9" },
          { TYPE: this.SrcType.IMG,SRC: "img/toire/10.png", NAME: "10" }
        ),
        ARURL: "",
        COLOR: new Array({
          COLOR_CATEGORY: "カラー1箇所",
          COLOR_ID_ARRAY: new Array(1, 2, 3, 4, 5),
        }),
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
  }

  /**
   *現在選択中のモデルパスを取得
   *
   * @memberof dataManager
   */
  GetNowModelPath() {
    return this.itemInfoArray[this.nowItemID].ModelPath;
  }

  /**
   *現在選択中の商材名を取得
   *
   * @returns
   * @memberof dataManager
   */
  GetNowItemName() {
    return this.itemInfoArray[this.nowItemID].ItemName;
  }

  /**
   *現在選択中の商材の小組情報を取得
   *
   * @returns
   * @memberof dataManager
   */
  GetNowItemDetailInfo() {
    return this.itemInfoArray[this.nowItemID].DetailIDArray;
  }

  GetSelectItemDetailInfo() {
    return this.itemInfoArray[this.nowItemID].DetailIDArray[
      this.selectDetailID
    ];
  }

  GetSelectItemARUrl() {
    return this.itemInfoArray[this.nowItemID].ARURL;
  }
  /**
   *現在選択中商材のカラー箇所が複数か確認
   *
   * @memberof dataManager
   */

  CheckSelectItemMultiColor() {
　　return this.itemInfoArray[this.nowItemID].COLOR.length > 1;
  }


  GetSelectColorInfo() {
    return this.itemInfoArray[this.nowItemID].COLOR;
  }

  SetSelectColorType(ID){
    this.selectColorTypeID = ID;
  }

  GetSelectColorTypeInfo(){
    return this.itemInfoArray[this.nowItemID].COLOR[ this.selectColorTypeID];
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

}
