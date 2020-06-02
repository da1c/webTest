"use strict";

function ModelViewRender() {
  requestAnimationFrame(ModelViewRender);
  Flow.modelView.Render();
}

class flow {
  /**
   *Creates an instance of flow.
   * @memberof flow
   */
  constructor() {
    this.indexWnd = null;
    this.menuWnd = null;
    this.menuAreaHeight = 0.0;
    this.modelView = null;

    this.MenuStateID = {
      CATEGORY: 0,
      ITEM_PICKUP: 1,
      COLOR_TYPE: 2,
      COLOR_PICKUP: 3,
    };
    this.nowMenuStateID = this.MenuStateID.CATEGORY;
  }

  Init() {
    this.modelView = new ModelView();
    this.modelView.Init(window.innerWidth, this.GetScreenHarfSize());

    ModelViewRender();

    // 商材名設定
    let itemName = window.top.dataMng.GetNowItemName()
    this.UpdateItemName(itemName);
  }

  SetIndexWindow(wnd) {
    this.indexWnd = wnd;
  }

  // 遷移などをここに実装
  ClickItemCategory() {
    this.ChangeState( this.MenuStateID.ITEM_PICKUP );
  }

  ClickClose() {
    this.indexWnd.$(".itemSelectModal").fadeOut();
  }

  ClickCloseVideo() {
    this.indexWnd.$(".videoModal").fadeOut();
  }

  GetMenuAreaHeight() {
    return this.menuAreaHeight;
  }

  // ARボタンクリック時の処理
  ClickARButton() {
    let arAddress = this.indexWnd.dataMng.GetSelectItemARUrl();
    this.indexWnd.open(arAddress);
  }

  // 商材切り替えボタンクリック
  ClickItemSelectButton() {
    //this.indexWnd.
    // 商材切り替えウィンドウを表示
    // これでアクセスできるっぽい
    //this.indexWnd.$()
    this.indexWnd.$(".itemSelectModal").fadeIn();
  }

  // ボタンクリック
  ClickMenuButton() {
    // メニュー取得
    let menu = this.indexWnd.$(".menuModal");
    let headerHeight = this.indexWnd.$(".Header").innerHeight();

    menu.css("top", headerHeight + "px");
    //
    let content = this.indexWnd.$(".modal_menu");
    content.css({ top: "0px", left: "0px", transformX: "translate(-50%)" });

    menu.fadeIn();
  }

  ClickCloseMenu() {
    this.indexWnd.$(".menuModal").fadeOut();
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
    this.indexWnd.dataMng.nowItemID = id;
    // モデルウィンドウのモデル更新
    this.modelView.SetModel(
      this.indexWnd.dataMng.GetNowModelPath(),
      this.indexWnd.dataMng.GetNowModelWallPos(),
      this.indexWnd.dataMng.GetNowModelFloorPos()
    );

    // 平行光源の強さ設定
    let intensity = this.indexWnd.dataMng.GetDirLightIntensity();
    this.modelView.SetDirLightIntensity(intensity);

    // ステートをカテゴリーに戻す
    this.ChangeState(this.MenuStateID.CATEGORY);
    // 商材名更新
    let itemName = window.dataMng.GetNowItemName()
    this.UpdateItemName(itemName);

    // フェードアウトさせる
    this.indexWnd.$(".itemSelectModal").fadeOut();
  }


  /**
   *商材名表記更新
   * @param {*} itemName
   * @memberof flow
   */
  UpdateItemName(itemName){
    window.$(".HeaderItemName").html(itemName);
  }

  /**
   *小組一覧表示ボタンクリック時の処理
   *
   * @memberof flow
   */
  ClickItemDetailListButton() {
    // 現在選択中商材の小組情報一覧を取得
    let detailInfo = this.indexWnd.dataMng.GetNowItemDetailInfo();

    // 画像を差し替える 小組名も設定
    this.indexWnd.$(".DetailBanner").each(function () {
      //
      let idx = $(this).index();

      // アイコンの要素に画像パスを設定
      let icon = $(this).children(".icon");
      let iconImg = icon.children(".iconimg");
      iconImg.attr("src", detailInfo[idx].SRC);

      // 小組名設定
      let nameArea = $(this).children(".ItemNameArea");
      let name = nameArea.children(".ItemName");
      name.html(detailInfo[idx].NAME);
    });

    this.indexWnd.$(".itemDetailModal").fadeIn();
  }

  ClickDetailButton(idx) {
    console.log(idx);
    // 選択したIDXを保存
    this.indexWnd.dataMng.selectDetailID = idx;

    // 商材詳細画面へ遷移
    this.GetMenuWindow().location.href = "./../itemDetail/itemDetail.html";
  }

  ClickDetailListButton(idx) {
    // フェードアウトさせる
    this.indexWnd.$(".itemDetailModal").fadeOut();

    // 選択したIDXを保存
    this.indexWnd.dataMng.selectDetailID = idx;

    // 商材詳細画面へ遷移
    this.GetMenuWindow().location.href = "./itemDetail/itemDetail.html";
  }

  ClickCloseItemDetailListButton() {
    // フェードアウトさせる
    this.indexWnd.$(".itemDetailModal").fadeOut();
  }

  Resize() {
    let screenHegiht = $(window).innerHeight();
    let screenHarfHegiht = this.GetScreenHarfSize();

    // Index.htmlの各要素のサイズ設定
    this.indexWnd.$("#Canvas3D").css("height", screenHarfHegiht + "px");
    this.indexWnd.$("#menu").css("height", screenHarfHegiht + "px");
    this.indexWnd.$("#Header").css("height", screenHegiht * 0.06 + "px");
    // メニュー部分のサイズを保存
    this.menuAreaHeight = screenHarfHegiht;
  }

  GetScreenHarfSize() {
    let screenHegiht = $(window).innerHeight();
    return screenHegiht * 0.47;
  }

  // カテゴリーのカラーを選択
  ClickColorCategory() {
    // カラーカテゴリー選択
    let menuWnd = this.GetMenuWindow();

    menuWnd.location.href = "./../colorTypeSelect/colorSelectType.html";
  }

  /**
   *機能選択初期化
   * @memberof flow
   */
  InitItemPickUp() {
    // メニュー部分のwindowオブジェクトの取得
    let wnd = window;

    // 機能情報を取得
    let itemInfo = this.indexWnd.dataMng.GetNowItemDetailInfo();
    let element_str = "";

    for (let index = 0; index < itemInfo.length; index++) {
      let imgType = "";

      // 画像のサイズ確認
      if (this.indexWnd.dataMng.CheckDispSize(itemInfo[index].DISP_SIZE)) {
        // 通常サイズ
        imgType = "SlickElementImg";
      } else {
        // 横長サイズ
        imgType = "SlickElementWideImg";
      }

      // タイプの確認
      if (this.indexWnd.dataMng.CheckIMGSrcType(itemInfo[index].TYPE)) {
        // 通常
        element_str += this.CreateIMGElement(itemInfo[index].SRC, imgType);
      } else {
        // 動画リンクの場合
        element_str += this.CreateVideoElement(
          itemInfo[index].SRC,
          imgType,
          itemInfo[index].NAME
        );
      }
    }

    // 追加先の要素を取得
    let dstElement = wnd.$(".MenuParent");
    dstElement.append(element_str);

    dstElement.slick({
      centerMode: true,
      centerPadding: "15%",
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 300,
      adaptiveHeight: true,
      arrows: false,
      variableWidth: true,
    });
  }

  CreateIMGElement(src, imgType) {
    return (
      '<li><div class="SlickElement"><img class="' +
      imgType +
      ' " src="' +
      src +
      '"></div></li>'
    );
  }

  CreateVideoElement(src, imgType, videoID) {
    return (
      '<li><div class="SlickElement"><img class="' +
      imgType +
      '" src="' +
      src +
      '" onclick="window.top.Flow.ClickVideo(' +
      videoID +
      ')"><img class="MovieIcon" src="./img/movie_icon.png"></div></li>'
    );
  }

  /**
   *colorPickUpの初期化処理
   *と見込み完了時に実行する
   *
   * @memberof flow
   */
  InitColorPickUp() {
    // カラー一覧の初期化
    let wnd = this.GetMenuWindow();

    // 選択中の商材のカラー情報を取得
    let colorInfo = this.indexWnd.dataMng.GetSelectColorTypeInfo();

    // パンくずに選択したカラー箇所名を設定
    let bread = wnd.$(".breadcrumb_current");
    bread.html(colorInfo.COLOR_CATEGORY);

    // 追加先の要素を取得
    let dstElement = wnd.$(".slick-box");
    let element_str = "";

    // カラー情報分、スクロール要素配下に要素を追加
    for (let index = 0; index < colorInfo.COLOR_ID_ARRAY.length; ++index) {
      const element = this.indexWnd.dataMng.GetColorInfo(
        colorInfo.COLOR_ID_ARRAY[index]
      );
      element_str +=
        '<li class="SlickElement ContentsParent"><div class="ColorName">' +
        element.NAME +
        '</div><img class="SlickElementImg ContentsChild" src="' +
        element.SRC +
        '" /></li>';
    }

    dstElement.append(element_str);
  }

  /**
   *カラー選択画面初期化
   * @memberof flow
   */
  InitColorTypeSelect() {
    // Menu部分のウィンドウ取得
    let wnd = this.GetMenuWindow();

    // 選択中の商材のカラー情報を取得
    let colorInfo = this.indexWnd.dataMng.GetSelectColorInfo();

    let dstElement = wnd.$(".CategoryList");

    let element_str = "";

    // カラー情報分、スクロール要素配下に要素を追加
    for (let index = 0; index < colorInfo.length; ++index) {
      const element = colorInfo[index];
      element_str +=
        '<div class="CategoryBanner" onclick="window.top.Flow.ClickColorType(' +
        index +
        ')"><div class="CategoryGuide"><div class="CategoryBannerName">' +
        element.COLOR_CATEGORY +
        '</div></div><div class="CategoryBannerMark">></div></div>';
    }

    dstElement.append(element_str);
  }

  /**
   *カラータイプクリック
   *(場所)
   * @param {*} ID
   * @memberof flow
   */
  ClickColorType(ID) {
    this.indexWnd.dataMng.SetSelectColorType(ID);

    // カラーカテゴリー選択
    let menuWnd = this.GetMenuWindow();

    menuWnd.location.href = "./../colorPickUp/colorPickUp.html";
  }

  // 機能の動画を選択
  ClickVideo(ID) {
    let info = this.indexWnd.dataMng.GetVideoInfo(ID);
    this.indexWnd.open(info.SRC);

    // メニューのモーダル表示をフェードＩＮ
    this.VideoViewFadeIn();
  }

  SetVideoView(src) {
    this.indexWnd.$(".VideoView").attr("src", src);
  }
  VideoViewFadeIn() {
    this.indexWnd.$(".VideoArea").fadeIn();
  }

  VideoViewFideOut() {
    this.indexWnd.$(".VideoArea").fadeOut();
  }

  SetVideoNameText(text) {
    this.indexWnd.$(".VideoName").text(text);
  }

  /**
   *ビデオクローズ
   *
   * @memberof flow
   */
  ClickCloseVideo() {
    this.VideoViewFideOut();
    this.SetVideoView("");
  }

  /**
   *Webカタログバナーをクリックした際の処理
   *
   * @memberof flow
   */
  ClickWebCatalogCategory() {
    let url = this.indexWnd.dataMng.GetWebCataroguURL();
    this.indexWnd.open(url);
  }

  /**
   *ホームページボタンクリック
   *
   * @memberof flow
   */
  ClickHomePage() {
    let url = this.indexWnd.dataMng.GetHomePageURL();
    this.indexWnd.open(url);
  }

  /**
   *説明書クリック
   *
   * @memberof flow
   */
  ClickInstructionCategory() {
    let url = this.indexWnd.dataMng.GetInstructionURL();
    this.indexWnd.open(url);
  }

  // ここで各画面の遷移
  ChangeState(nextStateID) {
    // 現在のステートの後始末
    switch (this.nowMenuStateID) {
      case this.MenuStateID.CATEGORY:
        this.EndCategoryState();
        break;
      case this.MenuStateID.COLOR_PICKUP:
        this.EndColorPickUpState();
        break;

      case this.MenuStateID.COLOR_TYPE:
        this.EndColorCategoryState();
        break;
      case this.MenuStateID.ITEM_PICKUP:
        this.EndItemPickUpState();
        break;
    }

    // 次のステートの用意
    switch (nextStateID) {
      case this.MenuStateID.CATEGORY:
        this.ChangeCategoryState();
        break;
      case this.MenuStateID.COLOR_PICKUP:
        this.ChangeColorPickUpState();
        break;

      case this.MenuStateID.COLOR_TYPE:
        this.ChangeColorCategoryState();
        break;
      case this.MenuStateID.ITEM_PICKUP:
        this.ChangeItemPickUpState();
        break;
    }

    // 現在のステートIDを更新
    this.nowMenuStateID = nextStateID;
  }

  // メニューに切り替え
  ChangeCategoryState() {
    // メニュー表示設定
    $(".CategoryList").show();
  }

  EndCategoryState() {
    $(".CategoryList").hide();
  }

  // カテゴリー選択メニュー
  // 機能一覧メニュー
  ChangeItemPickUpState() {
    // 機能一覧を作成
    this.InitItemPickUp();

    // slickの親を表示状態に変更
    let slickParent = window.$(".MenuParent");
    slickParent.show();
  }

  // アイテム選択ステート
  EndItemPickUpState() {
    let slickParent = window.$(".MenuParent");

    // sulick解除
    slickParent.slick("unslick");
    // 配下の要素削除
    slickParent.empty();
    // 表示状態にする
    slickParent.hide();
  }

  // カラーカテゴリー選択
  ChangeColorCategoryState() {}

  EndColorCategoryState() {}

  // カラー選択
  ChangeColorPickUpState() {}

  EndColorPickUpState() {}
}
