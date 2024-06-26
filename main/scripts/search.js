function loadPage(firstLoad=false) {
    //検索欄に入力された値を取得
    if (!firstLoad){
        let input_url = document.getElementById("url");
        video_id = getIdFromURL(input_url);
    }
    if (video_id === null) {
            error.src = "search"
            error.code = 1;
            error.message = "入力されたURLのフォーマットが正しくありません。";
            handleAndClearError();
    }
    else{
        loadVideo().then(()=>{loadCaption().catch(handleAndClearError);}).catch(handleAndClearError);
    }
}


//検索欄に入力されたURLのYouTube動画をロード
//正常に読み込めた場合は0, エラーが発生した場合はエラーコードを設定する
async function loadVideo() {
    player_state_changed = false;
    player.cueVideoById(video_id);
    let loop_end = false;
    while(true){
        await new Promise((resolve, reject) => {
            setTimeout(()=>{
                try {
                    if (player_state_changed && player.getPlayerState() === YT.PlayerState.CUED) {
                        loop_end = true;
                    }
                    else if(error.code !== 0) {
                        throw new Error();
                    }
                    resolve();
                }
                catch(e) {
                    reject();
                }
            }, 1000);
        });
        if (loop_end) break;
    }
}

async function loadCaption() {
    caption.fetchList(video_id);
    let loop_end = false;
    player_state_changed = false;
    while(true){
        await new Promise((resolve, reject) => {
            setTimeout(()=>{
                try {
                    if (caption.getState() === CaptionState.READY) {
                        loop_end = true;
                    }
                    else if(error.code !== 0) {
                        throw new Error();
                    }
                    resolve();
                }
                catch(e) {
                    reject();
                }
            }, 1000);
        });
        if (loop_end) break;
    }
    localStorage.setItem(LS_TAG, video_id);
}

//フォーマットが違法である場合は null を返す
function getIdFromURL(input_element) {
    url_str = input_element.value;
    ret = url_str.match(/[\?&]v=([^\/&]+)/);
    if (ret !== null)
        ret = ret[1];

    input_element.value = "";
    return ret;
}

function handleAndClearError(){
    if (error.code == 0)
        return;
    
    onSearchError();
    error.code = 0;
    error.message = "";
    error.src = "";
    error.detail = "";
}