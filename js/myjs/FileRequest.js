

function FileRequest( path, onLoadFunc, onErrorFunc, requestType ){
  
    let request = new XMLHttpRequest();

    // 指定したファイルを非同期で取得
    request.open('GET', path, true);

    // ファイル形式設定
    request.responseType = requestType;

    // 受信完了時のイベント
    request.onload = ()=>{ onLoadFunc(request); };

    // 受信失敗時のイベント
    request.onerror = ()=>{ onErrorFunc(); };

    // リクエスト送信
    request.send();
}


/**
 *テキストファイルを取得
 *
 * @param {*} path ファイルパス
 * @param {*} loadFunc 読み込み時の関数
 * @param {*} errorFunc エラー時の関数
 */
function TextFileRequest( path, onLoadFunc, onErrorFunc ){
  FileRequest(path, (request)=>{ onLoadFunc(request.response)},onErrorFunc, 'text');
}

// XML
function XmlFileRequest(path, onLoadFunc, onErrorFunc ){
    FileRequest(path, (request)=>{ onLoadFunc(request.response)},onErrorFunc, 'document');
}

// json
function JsonFileRequest(path, onLoadFunc, onErrorFunc ){
    FileRequest(path, (request)=>{ onLoadFunc(request.response)},onErrorFunc, 'json');
}
