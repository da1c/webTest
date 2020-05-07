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
    this.indexWnd.$(".itemSelectModal").fadeOut();
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
    this.indexWnd.$(".itemSelectModal").fadeIn();
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
    this.indexWnd.$(".itemSelectModal").fadeOut();
  }


  /**
   *小組一覧表示ボタンクリック時の処理
   *
   * @memberof flow
   */
  ClickItemDetailListButton(){

    // 現在選択中商材の小組情報一覧を取得
    let detailInfo = this.indexWnd.dataMng.GetNowItemDetailInfo();

    // 画像を差し替える 小組名も設定
    this.indexWnd.$(".DetailBanner").each(function(){
      // 
      let idx = $(this).index();

      // アイコンの要素に画像パスを設定
      let icon = $(this).children(".icon");
      let iconImg = icon.children(".iconimg");
      iconImg.attr( "src", detailInfo[idx].IMG );

      // 小組名設定
      let nameArea = $(this).children(".ItemNameArea");
      nameArea.html( detailInfo[idx].NAME );

    });

    this.indexWnd.$(".itemDetailModal").fadeIn();
  }


  ClickDetailButton(idx){
    console.log(idx);
    // 選択したIDXを保存
    this.indexWnd.dataMng.selectDetailID = idx;

    // 商材詳細画面へ遷移
    this.GetMenuWindow().location.href = "./../itemDetail/itemDetail.html";
  }

  ClickDetailListButton(idx){

    // フェードアウトさせる
    this.indexWnd.$(".itemDetailModal").fadeOut();

    // 選択したIDXを保存
    this.indexWnd.dataMng.selectDetailID = idx;

    // 商材詳細画面へ遷移
    this.GetMenuWindow().location.href = "./itemDetail/itemDetail.html";
  }

  ClickCloseItemDetailListButton(){
    // フェードアウトさせる
    this.indexWnd.$(".itemDetailModal").fadeOut();
  }

}
