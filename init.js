//This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
//一番上のscriptタグの上に挿入
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const SCRIPTS_TO_LOAD = ["./html_parser.js", "./caption_class.js", "./player.js", "./caption.js",  "./instance.js", "./search.js", "./front.js"];
function onYouTubeIframeAPIReady(){
    var tag;
    SCRIPTS_TO_LOAD.forEach((filename)=>{
        tag = document.createElement('script');
        tag.src = filename;
        document.body.appendChild(tag);
    });
}

let error = {code: 0, message: "", src: "", detail: ""};
let video_id = "B2D3lGOrdVQ";
let player_state_changed = false;

let player;

let caption;