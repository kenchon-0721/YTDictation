/*
CaptionState.
NOT_READY: 0
READY: 1
ERROR: -1
*/

caption = new Caption({
    "onReady": onCaptionReady_,
    "onError": onCaptionError
});

/*
function onCaptionReady(event) 
については、front.js を参照してください。
*/
function onCaptionReady_() {
    onCaptionReady();
}

function onCaptionError(event) {
    error.code = event.status;
    error.src = "caption";
    if(event.detail !== null)
        error.detail = event.detail;

    switch(error.code){
        case 1000:
            error.message = "英語の字幕が見つかりませんでした。";
            break;
        case 1001:
            error.message = `YouTubeアクセス時のHTTPエラー:`;
            break;
        case 1002:
            error.message = "YouTubeの仕様が変更されたため、字幕を取得できませんでした。";
            break;
        case 1003:
            error.message = "YouTubeのスクリプトファイルの仕様が変更されたため、字幕を取得できませんでした。";
            break;
        case 1004:
            error.message = "スクリプトのエラーにより、YouTubeにアクセスできませんでした。";
            break;
        case 1005:
            error.message = `字幕データアクセス時のHTTPエラー:`;
            break;
        case 1006:
            error.message = "字幕データの仕様が変更されたため、字幕を取得できませんでした。";
            break;
        case 1007:
            error.message = "スクリプトのエラーにより、字幕データにアクセスできませんでした。";
            break;
        default:
            error.message = `不明なエラーが発生しました。エラーコード: ${error.code}`;
            break;
    }
}

class CaptionEvent{
    target;
    status;
    detail;
    constructor(target, status, detail=null) {
        this.target = target;
        this.status = status;
        this.detail = detail;
    }
}