const PORT_NUMBR = 8080;

//This code loads the IFrame Player API code asynchronously.
const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
//一番上のscriptタグの上に挿入
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const SCRIPTS_TO_LOAD = ["./scripts/html_parser.js", 
                            "./scripts/caption_class.js", 
                            "./scripts/player.js", 
                            "./scripts/caption.js",  
                            "./scripts/instance.js", 
                            "./scripts/search.js", 
                            "./scripts/front.js"];
function onYouTubeIframeAPIReady(){
    var tag;
    SCRIPTS_TO_LOAD.forEach((filename)=>{
        tag = document.createElement('script');
        tag.src = filename;
        document.body.appendChild(tag);
    });
}

function fetchThroughProxy(request){
    encoded = encodeURIComponent(request);
    return fetch(`http://localhost:${PORT_NUMBR}/proxy?href=${encoded}`, {mode: "same-origin"});
}

let error = {code: 0, message: "", src: "", detail: ""};
let video_id = "B2D3lGOrdVQ";
let player_state_changed = false;

let player;

let caption;