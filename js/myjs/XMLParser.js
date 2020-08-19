function Parser(_xmlObj) {
  //
  let itemList = _xmlObj.getElementsByTagName("item");
  let itemNum = itemList.length;

  // タグ一覧
  let tagList = new Array(
    { VARIANT_NAME: "ItemName", elementName: "ItemName", PARSE_FUNC : GetXMLText }, // 商品名
    { VARIANT_NAME: "WEB_CATAROG_URL", elementName: "CatalogUrl", PARSE_FUNC : GetXMLText }, // Webcatalog
    { VARIANT_NAME: "INSTRUCTION_URL", elementName: "Instruction_URL", PARSE_FUNC : GetXMLText }, // 取説
    { VARIANT_NAME: "CAMERA_POS", elementName: "CameraPos", PARSE_FUNC : GetVec }, // カメラ座標
    { VARIANT_NAME: "CAMERA_ROT", elementName: "CameraRot", PARSE_FUNC : GetVec }, // カメラ注視点
    { VARIANT_NAME: "ARURL", elementName: "ARURL", PARSE_FUNC : GetXMLText }, // ARURL
    { VARIANT_NAME: "WALL_INFO", elementName: "Wall", PARSE_FUNC : GetBGObjInfo },  // 壁
    { VARIANT_NAME: "FLOOR_INFO", elementName: "Floor", PARSE_FUNC : GetBGObjInfo }, // 床
    { VARIANT_NAME: "DIR_LIGHT_INTENSITY", elementName: "DirLightIntensity", PARSE_FUNC : GetNum }, // 床
  );
  
  let tagNum = tagList.length;

  // パース先
  let data = new Array();
  // アイテム分
  for (let itemIdx = 0; itemIdx < itemNum; ++itemIdx) {
    let element = itemList[itemIdx];
    let itemInfo = new Object();
    // Tag一覧の情報を元に取得
    for (let tagIdx = 0; tagIdx < tagNum; ++tagIdx) {
      itemInfo[tagList[tagIdx].VARIANT_NAME] = tagList[tagIdx].PARSE_FUNC(element, tagList[tagIdx].elementName);
    }

    // モデルパス
    let modelPath = GetXMLText(element, "ModelPath");

    // モデル座標
    itemInfo.ModelInfo = new Array({
      PATH: modelPath,
      POS: GetVec(element, "ModelPos"),
    });

    // 機能情報
    // 小組情報読み込み ------------------------------
    let funcInfoElement = element.getElementsByTagName("Function");

    // 情報数確認
    if (funcInfoElement == null) {
      // 情報なし
      itemInfo.DetailIDArray = null;
    } else {
      // 情報有り

      // 機能情報数取得
      let funcInfoNum = funcInfoElement.length;
      // メモリ確保
      itemInfo.DetailIDArray = new Array(funcInfoNum);
      // 機能情報作成
      for (let funcIdx = 0; funcIdx < funcInfoNum; ++funcIdx) {
        let ele = funcInfoElement[funcIdx];
        // 機能情報取得
        itemInfo.DetailIDArray[funcIdx] = ParseFunctionInfo(ele);
      }
    }
    // ----------------------------------------------
    // カラー情報収集 --------------------------
    let colorCategory = element.getElementsByTagName("ColorCategory");

    let colorCategoryInfo = new Array(colorCategory.length);
    for (let colorIdx = 0; colorIdx < colorCategory.length; ++colorIdx) {
      // カラー情報パース
      colorCategoryInfo[colorIdx] = ParseColorInfo(colorCategory[colorIdx]);
    }
    // カラー情報を設定
    itemInfo.COLOR = colorCategoryInfo;
    // ----------------------------------------------


    // リストに追加
    data.push(itemInfo);

    return data;
  }
}

/**
 *XML要素からテキスト抽出
 *
 * @param {*} element
 * @param {*} tagName
 * @returns
 */
function GetXMLText(element, tagName) {
  let result = element.getElementsByTagName(tagName);

  if (result) {
    console.log(tagName + "=" + result[0].textContent);
    return result[0].textContent;
  }

  console.log(tagName + "=null");
  return null;
}

/**
 *XML要素からベクトル取得
 *
 * @param {*} element
 * @param {*} tagName
 * @returns
 */
function GetVec(element, tagName) {
  let value = GetXMLText(element, tagName);

  if (value) {
    // 文字列を分割、配列で良いか
    let spritStr = value.split(",");
    return {
      x: Number(spritStr[0]),
      y: Number(spritStr[1]),
      z: Number(spritStr[2]),
    };
  }

  return null;
}


/**
 *要素の内容を数値として取得
 *
 * @param {*} element
 * @param {*} tagName
 * @returns
 */
function GetNum(element, tagName){
  let value = GetXMLText(element, tagName);
  return Number(value);
}

/**
 *カラー情報取得
 *
 */
function ParseColorInfo(colorEle) {
  // カラー情報
  let colorObj = new Object();
  // category名
  colorObj.COLOR_CATEGORY = GetXMLText(colorEle, "ColorCategoryName");
  // カラー情報取得
  colorInfo = colorEle.getElementsByTagName("ColorInfo");

  // カラー情報分ループ
  colorObj.COLOR_INFO_ARRAY = new Array(colorInfo.length);
  for (let colorTypeIdx = 0; colorTypeIdx < colorInfo.length; colorTypeIdx++) {
    // カラーオブジェクトの作成
    // カラー名取得
    let colorName = GetXMLText(colorInfo[colorTypeIdx], "Name");
    // カラー画像のパス取得
    let colorImagePath = GetXMLText(colorInfo[colorTypeIdx], "ImagePath");
    //
    colorObj.COLOR_INFO_ARRAY[colorTypeIdx] = {
      SRC: colorImagePath,
      NAME: colorName,
    };
  }

  return colorObj;
}

/**
 *機能情報取得
 *
 * @param {*} functionEle
 * @returns
 */
function ParseFunctionInfo(functionEle) {
  let functionInfo = new Object();

  // 機能一覧に表示する画像パス
  functionInfo.SRC = GetXMLText(functionEle, "ImagePath");
  // 機能タイプ
  functionInfo.TYPE = GetXMLText(functionEle, "DispType");
  // リンク用のURL
  functionInfo.LINK_PATH = GetXMLText(functionEle, "LinkPath");

  // 詳細情報の取得
  let detailInfo = functionEle.getElementsByTagName("DetailInfo");

  // 詳細情報の有無を確認する
  if (detailInfo == null) {
    // 詳細情報なし
    // 空のデータ設定
    functionInfo.DetailInfo = null;
    return functionInfo;
  }

  // データあり
  // 詳細データ数取得
  let detailInfoNum = detailInfo.length;

  functionInfo.DetailInfo = new Array();

  // 詳細情報分ループ
  for (let detailIdx = 0; detailIdx < detailInfoNum; detailIdx++) {
    // 詳細情報の取得
    let info = ParseDetailInfo(detailInfo[detailIdx]);

    functionInfo.DetailInfo.push(info);
  }

  return functionInfo;
}

// 詳細情報取得処理
function ParseDetailInfo(detailEle) {
  // 戻り値用のメモリ確保
  let obj = new Object();
  // 各データの読み込み
  // 詳細情報のタイプID 動画か、画像か
  obj.DetailType = GetXMLText(detailEle, "DetailID");
  // 詳細情報のタイトル
  obj.Title = GetXMLText(detailEle, "Title");
  // 詳細情報のパス (参照URL)
  obj.DetailPath = GetXMLText(detailEle, "DetailInfoPath");

  // 詳細情報のデータを変えす
  return obj;
}

/**
 *背景関連のモデル情報取得
 *
 * @param {*} ele
 * @param {*} tagName
 * @returns
 */
function GetBGObjInfo(ele, tagName) {
  // 対象Objの要素取得
  let bgObjEle = ele.getElementsByTagName(tagName);

  // 対象の取得確認
  if (bgObjEle == null) {
    return null;
  }

  // 対象数取得
  let objNum = bgObjEle.length;
  // メモリ確保
  let objInfoArray = new Array(objNum);
  for (let objIdx = 0; objIdx < objNum; objIdx++) {
    objInfoArray[objIdx] = ParseBGObjInfo(bgObjEle[objIdx]);
  }

  return objInfoArray;
}

/**
 *背景などのモデル情報
 *
 */
function ParseBGObjInfo(ele) {
  // オブジェクト作成
  let obj = new Object();

  // テクスチャパス
  obj.PATH = GetXMLText(ele, "ImagePath");
  // 座標
  obj.POS = GetVec(ele, "Pos");
  // 回転量
  obj.ROT = GetVec(ele, "Rot");

  return obj;
}
