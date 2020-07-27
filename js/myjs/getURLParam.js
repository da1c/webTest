

/**
 *URLパラメータから、値を取得する
 *
 * @param {*} urlStr
 * @returns
 */
function GetURLParam(urlStr){

    var splitParam =urlStr.substring(1).split('&');
    var result = new Object();
    
    for (let paramIdx = 0; paramIdx < splitParam.length; paramIdx++) {
      let element= splitParam[paramIdx].split('=');
      result[decodeURIComponent(element[0])] = decodeURIComponent(element[1]);
    }

    return result;

}