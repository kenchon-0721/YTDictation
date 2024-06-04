/*
YT.PlayerState.
UNSTARTED: -1;
ENDED: 0;
PLAYING: 1;
PAUSED: 2;
BUFFERING: 3;
CUED: 5;
*/

player = new YT.Player('YouTubePlayer', {
    height: '360',
    width: '640',
    videoId: video_id,
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
    }
});

function onPlayerReady(event){
    
}

function onPlayerStateChange(event){
    player_state_changed = true;
}   

function onPlayerError(event){
    error.code = event.data;
    error.src = "player";
    switch(error.code){
        case 2:
            error.message = "動画のIDが無効です。";
            break;
        case 5:
            error.message = "HTML5に関連するエラーが発生しました。";
            break;
        case 100:
            error.message = "指定した動画は削除された，もしくは非公開に設定されています。";
            break;
        case 101:
        case 150:
            error.message = "指定した動画は埋め込み動画プレイヤーでの再生を許可していません。";
            break;
        default:
            error.message = `不明なエラーが発生しました。エラーコード: ${error_code}`;
            break;
    }
}
