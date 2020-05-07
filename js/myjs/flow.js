"use strict";

class flow {
  /**
   *Creates an instance of flow.
   * @memberof flow
   */
  constructor() {
    this.indexWnd = null;
    this.menuWnd = null;
    this.modelWnd = null;
  }

  SetIndexWindow(wnd) {
    this.indexWnd = wnd;
  }

  SetMenuWindow(wnd) {
    this.menuWnd = wnd;
  }

  SetModelViewWindow(wnd) {
    this.modelWnd = wnd;
  }

  // 遷移などをここに実装
  ClickCategory() {
    this.GetMenuWindow().location.href = "./../itemPickUp/itemPickUp.html";
  }

  ClickClose(){
    this.indexWnd.$(".js_modal").fadeOut();
  }

  GetMenuWindow() {
    return this.indexWnd.frames.menu;
  }

  GetModelViewWindow() {
    return this.indexWnd.frames.modelView;
  }

  // 商材切り替えボタンクリック
  ClickItemSelectButton() {
    //this.indexWnd.
    // 商材切り替えウィンドウを表示
    // これでアクセスできるっぽい
    //this.indexWnd.$()
    this.indexWnd.$(".js_modal").fadeIn();
  }

  
  /**
   *商材ボタンクリック1
   *
   * @param {*} id
   * @memberof flow
   */
  ClickItemButton(id) {


    // モデルビュー更新
    // モデルビューのウィンドウ取得
    let modelViewWnd = this.GetModelViewWindow();
    this.indexWnd.dataMng.nowItemID = id;
    // モデルウィンドウのモデル更新
    modelViewWnd.modelview.SetModel( this.indexWnd.dataMng.GetNowModelPath() );

　　// メニュー部分の商材名更新
    this.GetMenuWindow().$(".ItemName").html( this.indexWnd.dataMng.GetNowItemName() );

    // フェードアウトさせる
    this.indexWnd.$(".js_modal").fadeOut();
  }

  // 遷移

  // 前のページに戻る
}
