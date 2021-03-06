"use strict";

function ModelViewRender() {
  requestAnimationFrame(ModelViewRender);
  Flow.modelView.Render();
}

/**
 *
 *
 * @class flow
 */
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
      NONE: -1,
      CATEGORY: 0,
      ITEM_PICKUP: 1,
      COLOR_TYPE: 2,
      COLOR_PICKUP: 3,
    };
    this.nowMenuStateID = this.MenuStateID.NONE;
    this.prevMenuStateID = this.MenuStateID.NONE;
    this.menuParent = null;
    this.scrollParent = null; 
    this.itemBannerParent = null;

    this.breadCrumbObjArray = null;
    this.breadCrumbNameObjArray = null;

    // モデル描画領域のサイズ
    this.modelViewWidth = window.innerWidth;
    this.modelViewHeight = window.innerHeight * 0.4;
    this.modelViewWipeWidth = this.modelViewWidth * 0.3;
    this.modelViewWipeHeight = this.modelViewHeight * 0.3;
    this.modelViewDiffHeight = this.modelViewHeight - this.modelViewWipeHeight;
    this.modelViewDiffWidth = this.modelViewWidth - this.modelViewWipeWidth;
    // 商材切り替え用関数
    this.changeItemFunc = this.DispSelectItem;
    // スタイル切り替えフラグ　壁、床の更新に使用
    this.changeStyleFlag = false;

  }

  /**
   *初期化処理
   *
   * @memberof flow
   */
  Init() {
    // メニューの親要素を取得
    this.menuParent = window.$(".MenuParent");

    // 機能一覧の親
    this.itemPickUpScrollParent = window.$(".scrollArea");

    // 商材切り替えバナーの親
    this.itemBannerParent = window.$(".ItemSelectBannerParent");

    // パンくずのOBJを取得
    this.breadCrumbObjArray = new Array(
      window.$(".BreadCrumbChild1"),
      window.$(".BreadCrumbChild2"),
      window.$(".BreadCrumbChild3")
    );

    this.breadCrumbNameObjArray = new Array(
      window.$(".BreadCrumbText1"),
      window.$(".BreadCrumbText2"),
      window.$(".BreadCrumbText3")
    );

    // 初期値を設定
    this.indexWnd.dataMng.SelectStyleID(1);
    this.indexWnd.dataMng.SetSelectItemID(0);

    // 3D空間初期化
    this.modelView = new ModelView();
    this.modelView.Init(
      this.modelViewWidth,
      this.modelViewHeight,
      this.indexWnd.dataMng.GetCameraPos(),
      this.indexWnd.dataMng.GetCameraRot()
    );

    ModelViewRender();

    // 商材名設定
    let itemName = window.top.dataMng.GetNowItemName();
    this.UpdateItemName(itemName);

    // カテゴリー選択に設定
    this.ChangeState(this.MenuStateID.CATEGORY);

    // スタイル選択一覧作成
    this.CreateStyleSelectUI();

    // 商品気r替えバナー初期化(作成も行っている)
    this.InitItemSelectBanner();
  }

  SetIndexWindow(wnd) {
    this.indexWnd = wnd;
  }

  // 遷移などをここに実装
  ClickItemCategory() {
    this.ChangeState(this.MenuStateID.ITEM_PICKUP);
  }

  // カテゴリーのカラーを選択
  ClickColorCategory() {
    // ステートをカラーカテゴリーに変更
    this.ChangeState(this.MenuStateID.COLOR_TYPE);
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
    //
    this.changeItemFunc();
    this.indexWnd.$(".itemSelectModal").fadeIn();
  }

  /**
   *カラータイプクリック
   *(場所)
   * @param {*} ID
   * @memberof flow
   */
  ClickColorType(ID) {
    this.indexWnd.dataMng.SetSelectColorType(ID);

    // カラーピックアップステートに移行
    this.ChangeState(this.MenuStateID.COLOR_PICKUP);
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
    // ここで設定
    this.indexWnd.dataMng.SetSelectItemID(id);

    // モデルウィンドウのモデル更新
    this.modelView.SetModelInfo(this.indexWnd.dataMng.GetNowModelPath());

    // 床、壁の切り替え
    this.modelView.SetWall(window.dataMng.GetNowModelWallInfo());
    this.modelView.ChangeFloorTexture(window.dataMng.GetNowModelFloorInfo());

    // 平行光源の強さ設定
    let intensity = this.indexWnd.dataMng.GetDirLightIntensity();
    this.modelView.SetDirLightIntensity(intensity);

    // 選択した商材のカメラの初期座標、角度を設定する
    let pos = this.indexWnd.dataMng.GetCameraPos();
    let rot = this.indexWnd.dataMng.GetCameraRot();
    this.modelView.SetCameraPos(pos);
    this.modelView.SetCameraTargetPos(rot);

    // ステートをカテゴリーに戻す
    this.ChangeState(this.MenuStateID.CATEGORY);
    // 商材名更新
    let itemName = window.dataMng.GetNowItemName();
    this.UpdateItemName(itemName);

    // フェードアウトさせる
    this.indexWnd.$(".itemSelectModal").fadeOut();
  }

  /**
   *商材名表記更新
   * @param {*} itemName
   * @memberof flow
   */
  UpdateItemName(itemName) {
    window.$(".HeaderItemName").html(itemName);
  }

  ClickStyleSelect() {
    // スタイル選択のUI表示
    this.DispSelectStyle();

    this.changeItemFunc = this.DispSelectStyle;
  }

  SelectStyle(id) {
    // スタイルID切り替え
    window.dataMng.SelectStyleID(id);

    // スタイルが切り替わったか確認
    this.changeStyleFlag = window.dataMng.CheckChangeStyle();

    if( this.changeStyleFlag )
    {
      // スタイルが切り替わったので、商品切り替えバナーを更新する
      this.itemBannerParent.empty();
      this.InitItemSelectBanner();
    }

    this.DispSelectItem();

    this.changeItemFunc = this.DispSelectItem;
  }

  DispSelectStyle() {
    window.$(".itemSelectList").hide();
    window.$(".StyleSelectList").show();
  }

  DispSelectItem() {
    window.$(".StyleSelectList").hide();
    window.$(".itemSelectList").show();
  }

  Resize() {
    let screenHegiht = window.innerHeight;

    // Index.htmlの各要素のサイズ設定
    this.indexWnd.$("#Canvas3D").css("height", this.modelViewHeight + "px");
    this.indexWnd.$("#MenuArea").css("height", screenHegiht * 0.39 + "px");
    this.indexWnd.$(".ItemHeader").css("height", screenHegiht * 0.14 + "px");
    this.indexWnd.$("#Header").css("height", screenHegiht * 0.06 + "px");

    // メニュー部分のサイズを保存
    this.menuAreaHeight = screenHegiht * 0.3;
  }

  GetScreenHarfSize() {
    let screenHegiht = window.innerHeight;
    return screenHegiht * 0.4;
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

    let cssText = this.GetScrollElementHeightText();
    for (let index = 0; index < itemInfo.length; index++) {
      let imgType = "";

      imgType = "SlickElementImg";
      // タイプの確認
      if (this.indexWnd.dataMng.CheckIMGSrcType(itemInfo[index].TYPE)) {
        // 通常
        element_str += this.CreateIMGElement(
          itemInfo[index].SRC,
          imgType,
          cssText,
          index
        );
      } else {
        // 動画リンクの場合
        element_str += this.CreateVideoElement(
          itemInfo[index].SRC,
          imgType,
          cssText,
          itemInfo[index].NAME
        );
      }
    }

    element_str = this.CreateScrollElement(element_str);
    // 作成した要素を追加
    this.menuParent.append(element_str);
  }

  CreateIMGElement(src, imgType, cssText, idx) {
    return (
      '<li class="SlickElement"' +
      cssText +
      '><img class="' +
      imgType +
      ' " src="' +
      src +
      '"onclick="Flow.DispItemDetail(' +
      idx +
      ')"></li>'
    );
  }

  CreateVideoElement(src, imgType, cssText, videoID) {
    return (
      '<li class="SlickElement"' +
      cssText +
      '><img class="' +
      imgType +
      '" src="' +
      src +
      '" onclick="window.top.Flow.ClickVideo(' +
      videoID +
      ')"><img class="MovieIcon" src="./img/movie_icon.png"></li>'
    );
  }

  // スクロール要素作成
  CreateScrollElement(element_str) {
    return (
      '<div class="HolizonScrollParent"><div class="ScrollNav"><ul >' +
      element_str +
      "</ul></div></div>"
    );
  }

  GetScrollElementHeightText() {
    let elementHegiht = this.indexWnd.$(".MenuArea").height();
    return 'style="height: ' + elementHegiht + 'px"';
  }

  /**
   *colorPickUpの初期化処理
   *と見込み完了時に実行する
   *
   * @memberof flow
   */
  InitColorPickUp() {
    // 選択中の商材のカラー情報を取得
    let colorInfo = this.indexWnd.dataMng.GetSelectColorTypeInfo();

    // 追加先の要素を取得
    let element_str = "";
    // 高さ設定用のテキスト取得
    let cssText = this.GetScrollElementHeightText();
    // カラー情報分、スクロール要素配下に要素を追加
    for (let index = 0; index < colorInfo.COLOR_INFO_ARRAY.length; ++index) {
      const element = colorInfo.COLOR_INFO_ARRAY[index];
      element_str +=
        '<li class="SlickElement"' +
        cssText +
        '><div class="ColorName NoSelectText">' +
        element.NAME +
        '</div><img class="SlickElementColorImg" src="' +
        element.SRC +
        '" /></li>';
    }

    element_str = this.CreateScrollElement(element_str);
    // 作成した要素を追加
    this.menuParent.append(element_str);
  }

  /**
   *カラー選択画面初期化
   * @memberof flow
   */
  InitColorTypeSelect() {
    // Menu部分のウィンドウ取得
    let wnd = window;

    // 選択中の商材のカラー情報を取得
    let colorInfo = this.indexWnd.dataMng.GetSelectColorInfo();

    let element_str = "";

    // カラー情報分、スクロール要素配下に要素を追加
    for (let index = 0; index < colorInfo.length; ++index) {
      const element = colorInfo[index];
      element_str +=
        '<div class="CategoryBanner" onclick="window.Flow.ClickColorType(' +
        index +
        ')"><div class="CategoryGuide"><div class="CategoryBannerName">' +
        element.COLOR_CATEGORY +
        '</div></div><div class="CategoryBannerMark">></div></div>';
    }

    this.menuParent.append(element_str);
  }

  // 機能の動画を選択
  ClickVideo(idx) {
    let itemInfo = this.indexWnd.dataMng.GetNowItemDetailInfo();
    this.indexWnd.open(itemInfo[idx].LINK_PATH);

    // メニューのモーダル表示をフェードＩＮ
    //this.VideoViewFadeIn();
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
        // this.EndItemPickUpState();
        this.test_EndItemPickUp();

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
        // this.ChangeItemPickUpState();
        this.test_InitItemPickUp();
        break;
    }

    // 現在のステートIDを更新
    this.prevMenuStateID = this.nowMenuStateID;
    this.nowMenuStateID = nextStateID;
  }

  ResetMenuElement() {
    // 配下の要素削除
    this.menuParent.empty();
    // 表示状態にする
    this.menuParent.hide();
  }

  ResetScrollElement() {
    this.menuParent.empty();
  }

  // メニューに切り替え
  ChangeCategoryState() {
    // メニュー表示設定
    $(".CategoryList").show();

    // パンくず更新
    this.ChangeBreadCrumbState(1);
  }

  EndCategoryState() {
    $(".CategoryList").hide();
  }

  // カテゴリー選択メニュー
  // 機能一覧メニュー
  ChangeItemPickUpState() {
    // slickの親を表示状態に変更
    this.menuParent.show();
    // 機能一覧を作成
    this.InitItemPickUp();

    // パンくず更新
    this.ChangeBreadCrumbState(2);
    this.breadCrumbNameObjArray[1].text("機能");

    // 先頭のパンくずにTOPに戻るonclick時の処理登録
    this.breadCrumbObjArray[0].attr(
      "onclick",
      "window.Flow.ChangeState( window.Flow.MenuStateID.CATEGORY)"
    );
    this.breadCrumbObjArray[1].attr("onclick", "");
  }

  // アイテム選択ステート
  EndItemPickUpState() {
    // ScrollParent配下を削除
    this.ResetScrollElement();
  }

  // カラーカテゴリー選択
  ChangeColorCategoryState() {
    // カラーイプの作成
    this.InitColorTypeSelect();
    // メニュー表示設定
    this.menuParent.show();

    // パンくず更新
    this.ChangeBreadCrumbState(2);
    this.breadCrumbNameObjArray[1].text("カラー");
    // 先頭のパンくずにTOPに戻るonclick時の処理登録
    this.breadCrumbObjArray[0].attr(
      "onclick",
      "window.Flow.ChangeState( window.Flow.MenuStateID.CATEGORY)"
    );
    this.breadCrumbObjArray[1].attr("onclick", "");
  }

  EndColorCategoryState() {
    // MenuParent配下を削除
    this.ResetMenuElement();
  }

  // カラー選択
  ChangeColorPickUpState() {
    this.InitColorPickUp();
    // メニュー表示設定
    this.menuParent.show();
    // パンくず更新
    this.ChangeBreadCrumbState(3);

    // 選択したIDを元に設定
    let colorInfo = this.indexWnd.dataMng.GetSelectColorTypeInfo();
    this.breadCrumbNameObjArray[2].text(colorInfo.COLOR_CATEGORY);

    this.breadCrumbObjArray[1].attr(
      "onclick",
      "window.Flow.ChangeState( window.Flow.MenuStateID.COLOR_TYPE)"
    );
  }

  EndColorPickUpState() {
    // ScrollParent配下を削除
    this.ResetScrollElement();
  }

  // ボタンに登録なのかな
  // パンくずどうするか
  // 末尾に追加？
  // パンくずの要素は保持しておいた方が良いのか？
  ClickBreadCrumb1() {
    this.ChangeState(this.MenuStateID.CATEGORY);
  }

  /**
   *指定した数のパンくずを有効にする
   *表示、Classの設定も行う
   * @param {*} enableNum
   * @memberof flow
   */
  ChangeBreadCrumbState(enableNum) {
    let enableJudgeIdx = enableNum - 1;

    for (let index = 0; index < this.breadCrumbObjArray.length; index++) {
      let element = this.breadCrumbObjArray[index];

      // 有効か確認
      if (index <= enableJudgeIdx) {
        // 有効の場合
        // 末尾か確認
        if (index == enableJudgeIdx) {
          // 末尾の場合
          this.UpdateBreadCrumbClass(
            element,
            "BreadCrumbCurrent",
            "BreadCrumbPrev"
          );
        } else {
          this.UpdateBreadCrumbClass(
            element,
            "BreadCrumbPrev",
            "BreadCrumbCurrent"
          );
        }
        element.show();
      } else {
        // 無効の場合
        // 非表示。不要なクラスを削除
        element.hide();
        if (element.hasClass("BreadCrumbPrev")) {
          element.removeClass("BreadCrumbPrev");
        }
        // BreadCrumbCurrentクラスがない場合、追加する
        if (!element.hasClass("BreadCrumbCurrent")) {
          element.removeClass("BreadCrumbCurrent");
        }
      }
    }
  }

  UpdateBreadCrumbClass(target, addClassName, removeClassName) {
    if (target.hasClass(removeClassName)) {
      target.removeClass(removeClassName);
    }
    // BreadCrumbCurrentクラスがない場合、追加する
    if (!target.hasClass(addClassName)) {
      target.addClass(addClassName);
    }
  }

  /**
   *スタイル選択UI作成
   *初回初期化時に行う
   * @memberof flow
   */
  CreateStyleSelectUI() {
    // これ初回で行うだけで十分
    let styleInfoArray = window.dataMng.GetStyleInfoArray();

    let dstElement = window.$(".StyleSelectList");
    let addElement = "";

    for (let styleIdx = 0; styleIdx < styleInfoArray.length; styleIdx++) {
      let element = styleInfoArray[styleIdx];
      addElement +=
        '<div class="itemselectbanner" onclick="Flow.SelectStyle(' +
        element.ID +
        ')"><div class="StyleNameArea ContentsParent"><div class="ItemName ContentsLeftChild NoSelectText StyleName">' +
        element.NAME +
        "</div></div></div>";
    }

    // 要素追加
    dstElement.append(addElement);
  }

  /**
   *機能詳細画面表示
   *
   * @param {*} idx
   * @memberof flow
   */
  DispItemDetail(idx) {
    // 詳細表示の内容を設定を取得
    let itemInfo = this.indexWnd.dataMng.GetNowItemDetailInfo();

    // 情報から詳細表示要素作成
    let detailEle = this.CreateItemDetailElement(itemInfo[idx].DetailInfo);

    this.indexWnd.$(".detailInfoArea").append(detailEle);

    // 選択した機能IDをDataManagerに登録
    this.indexWnd.dataMng.SetSelectDetailID(idx);

    this.SlideInDetailArea();
  }

  /**
   *詳細情報から要素作成
   *
   * @param {*} itemInfo
   * @returns
   * @memberof flow
   */
  CreateItemDetailElement(detailInfo) {
    let detailNum = detailInfo.length;
    let ele = "";
    for (let detailIdx = 0; detailIdx < detailNum; ++detailIdx) {
      // 種類確認
      if (detailInfo[detailIdx].DetailType == "VIDEO") {
        // 動画
        ele += CreateVideoLink(
          detailInfo[detailIdx].DetailPath,
          detailInfo[detailIdx].Title
        );
      }else if( detailInfo[detailIdx].DetailType == "IMAGE" ) {
        // 画像表示
        ele +=
          '<img class="detailInfoImage" src="' +
          detailInfo[detailIdx].DetailPath +
          '">';
      }else{
        // リンクボタンの表示
        ele +='<div class="DetailLinkButton" onclick="Flow.ClickDetailLinkButton(' +detailIdx +')"><a class="DetailLinkButtonText"> '+
        detailInfo[detailIdx].Title +
        '</a></div>';
      }
    }

    return ele;
  }

  /**
   *モデル表示領域をワイプサイズに変更開始
   *
   * @memberof flow
   */
  StartChangeModelViewWipe() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    $(".ModelViewArea").animate(
      {
        top: height * 0.8 + "px",
        left: width * 0.65 + "px",
      },
      500,
      "swing"
    );
    // サイズ修正
    $(".arButton").css("zIndex", "0");
    $(".arButton").animate(
      { zIndex: 1 },
      {
        duration: 500,
        step: function (now) {
          Flow.ChangeWipeSize(now);
        },
        complete: function () {
          $(".arButton").css("zIndex", "0");
        },
      }
    );

    $(".ModelViewArea").css("zIndex", "2");
    $(".arButton").hide();
  }

  SlideInDetailArea() {
    $(".detailArea").show();
    $(".detailArea").animate({ top: "6%" }, 500, "swing");
  }

  StartChangeModelViewNormal() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    $(".ModelViewArea").animate(
      {
        top: height * 0.06 + "px",
        left: "0px",
      },
      500,
      "swing"
    );
    // サイズ修正
    $(".arButton").css("zIndex", "0");
    $(".arButton").animate(
      { zIndex: 1 },
      {
        duration: 500,
        step: function (now) {
          Flow.ChangeNormalSize(now);
        },
        complete: function () {
          $(".arButton").css("zIndex", "0");
          $(".ModelViewArea").css("zIndex", "0");
        },
      }
    );

    $(".arButton").show();
  }

  SlideOutDetailArea() {
    $(".detailArea").animate(
      { top: "100%" },
      {
        duration: 500,
        complete: function () {
          $(".detailArea").hide();
          $(".detailInfoArea").empty();
        },
      }
    );
  }

  /**
   *ワイプサイズへ変更処理
   *
   * @param {*} now
   * @memberof flow
   */
  ChangeWipeSize(now) {
    let nowWidth = this.modelViewWidth - this.modelViewDiffWidth * now;
    let nowHeight = this.modelViewHeight - this.modelViewDiffHeight * now;
    this.ChangeModelViewSize(nowWidth, nowHeight);
  }
  /**
   *ノーマルへ変更処理
   *
   * @param {*} now
   * @memberof flow
   */
  ChangeNormalSize(now) {
    let nowWidth = this.modelViewWipeWidth + this.modelViewDiffWidth * now;
    let nowHeight = this.modelViewWipeHeight + this.modelViewDiffHeight * now;
    this.ChangeModelViewSize(nowWidth, nowHeight);
  }

  /**
   *モデル表示領域のサイズ設定
   *
   * @param {*} width
   * @param {*} heigth
   * @memberof flow
   */
  ChangeModelViewSize(width, heigth) {
    let area3D = this.indexWnd.$(".Canvas3D");
    area3D.css({ width: width + "px", height: heigth + "px" });
  }

  test_InitItemPickUp() {
    // 機能一覧取得
    let itemInfo = this.indexWnd.dataMng.GetNowItemDetailInfo();

    // 要素追加
    let nowStr = "";

    for (let index = 0; index < itemInfo.length; index++) {
      let imgType = "";

      // 画像のサイズ確認
      // 通常サイズ
      imgType = "SlickElementImg";

      // タイプの確認
      if (this.indexWnd.dataMng.CheckIMGSrcType(itemInfo[index].TYPE)) {
        // 通常
        nowStr += this.CreateItemListIMGElement(itemInfo[index].SRC, index);
      } else {
        // 動画リンクの場合
        nowStr += this.CreateItemListVideoElement(itemInfo[index].SRC, index);
      }
    }

    // 注目
    this.itemPickUpScrollParent.append(nowStr);

    // test部分のスライドIN
    this.test_SlideInItemPickUpArea();
  }

  test_EndItemPickUp() {
    // スライドアウト
    this.test_SlideOutItemPickUpArea();
  }

  test_SlideInItemPickUpArea() {
    $(".ItemPickUpArea").show();
    $(".ItemPickUpArea").animate({ top: "6%" }, 500, "swing");
  }

  test_SlideOutItemPickUpArea() {
    $(".ItemPickUpArea").animate(
      { top: "100%" },
      {
        duration: 500,
        complete: function () {
          // 注目、その他の配下要素削除
          $(".scrollArea").empty();
          $(".ItemPickUpArea").hide();
        },
      }
    );
  }
  CreateItemListIMGElement(src, idx) {
    return (
      '<div class="itemListElement"><img class="itemListIMG" src="' +
      src +
      '"onclick="Flow.DispItemDetail(' +
      idx +
      ')"></div>'
    );
  }

  CreateItemListVideoElement(src, detailIdx) {
    return (
      '<div class="itemListElement"><img class="itemListIMG" src="' +
      src +
      '" onclick="window.top.Flow.ClickVideo(' +
      detailIdx +
      ')"><img class="MovieIcon" src="./img/movie_icon.png"></div>'
    );
  }

  /**
   * 商材切り替えバナーの作成
   *
   * @memberof flow
   */
  InitItemSelectBanner() {
    // 不要なもの削除

    // 現在選択中のスタイル情報取得
    // 必要なものは、各商材の名称と個数
    let itemNameArray = this.indexWnd.dataMng.GetSelectStyleItemNameList();

    // 
    let addElementStr = "";
    // アイテム名数取得
    let itemNameNum = itemNameArray.length;

    // アイテム名を元に、アイテムバナー要素作成
    for (let itemIdx = 0; itemIdx < itemNameNum; itemIdx++) {
      addElementStr += CreateItemBanner( itemIdx, itemNameArray[itemIdx] );
    }

    // 要素追加
    this.itemBannerParent.append(addElementStr);

    // アイテムバナー作成
    function CreateItemBanner(id, itemName) {
      return (
        '<div class="itemselectbanner" onclick="Flow.ClickItemButton(' +
        id +
        ')"><div class="ItemNameArea ContentsParent"><div class="ItemName ContentsLeftChild NoSelectText">' +
        itemName +
        "</div></div></div>"
      );
    }
  }



  /**
   *機能詳細のリンクボタンを押下時の処理
   *
   * @memberof flow
   */
  ClickDetailLinkButton(index){

    // 選択した小組の詳細情報のインデックスを使う
    // リンクのアドレスを取得
    let itemInfo = dataMng.GetSelectItemDetailInfo();
    let linkAdress = itemInfo.DetailInfo[index].DetailPath;

    // 別タブでオープン
    this.indexWnd.open(linkAdress);
  }

}
