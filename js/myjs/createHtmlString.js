

/**
 *詳細画面表示する動画用のHTML文字列作成
 *
 * @param {*} url 埋め込むURL
 * @param {*} title タイトル
 * @returns
 */
function CreateVideoLink( url, title ){
    return '<div class="detailInfoMovieHeader"><a class="detailInfoMovieTitle">test</a></div><div class="detailInfoMovie"><iframe class="detailIfarme" src="' + url +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
}
