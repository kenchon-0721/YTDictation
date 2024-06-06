class CaptionState{
    static NOT_READY = 0;
    static READY = 1;
    static ERROR = -1;
}

class Caption {
    list = null;

    #responseTextFromYT = "";
    #captionURL = "";
    #captionLinkXML = null;
    #state = CaptionState.NOT_READY; 

    //functions
    #onError;
    #onReady;

    constructor(event_handlers_array) {
        this.#onError = function(event){this.#state = CaptionState.ERROR; event_handlers_array["onError"](event);};
        this.#onReady = function(event){this.#state = CaptionState.READY; event_handlers_array["onReady"](event);};
    }

    fetchList(video_id){
        this.#state = CaptionState.NOT_READY;
        this.#responseTextFromYT = "";
        this.#captionURL = "";
        this.#captionLinkXML = null;
        this.list = null;
        this.#requestVideo(video_id)
            .then(this.#fetchCaptionFileURL.bind(this))
            .catch((error) => {this.#onError(new CaptionEvent(this, 1004, error));})
            //second request
            .then(this.#fetchXML.bind(this))
            .then(this.#fetchCaptionFromXML.bind(this))
            .catch((error) => {this.#onError(new CaptionEvent(this, 1007, error));});
    }   

    getState(){
        return this.#state;
    }

    async #requestVideo(video_id) {
        let res = await fetchThroughProxy(`https://www.youtube.com/watch?v=${video_id}`);
        //Header("Accept-Language", "en-US");
        //Header("Access-Control-Allow-Origin", "*");
        if (res.ok) {
            this.#responseTextFromYT = await res.text();
        }
        else {
            this.#onError(new CaptionEvent(this, 1001, res.status));
        }
    }

    async #fetchXML() {
        if (this.#state === CaptionState.ERROR) 
            return;

        
        let res = await fetchThroughProxy(this.#captionURL);
        let dom_parser = new DOMParser();
        if (res.ok) {
            let txt = await res.text();
            try{
                this.#captionLinkXML = dom_parser.parseFromString(txt, 'text/xml');
            }
            catch(e){
                this.#onError(new CaptionEvent(this, 1007, res.status, "Cannot parse caption link to HTML"));
            }
        }
        else {
            this.#onError(new CaptionEvent(this, 1005, res.status));
        }
    }

    #fetchCaptionFileURL() {
        if (this.#state === CaptionState.ERROR) return;

        let parser = new VideoHTMLParser(this.#responseTextFromYT);
        let pctr_json = parser.getJsonWithKey("playerCaptionsTracklistRenderer");
        if (pctr_json === null) {
            this.#onError(new CaptionEvent(this, 1002));
            return;
        }
        //字幕が格納されているURLを取得。
        try{
            this.#captionURL = this.#getEnglishCaptionFileURL(pctr_json);

            if(this.#captionURL === undefined) 
                this.#onError(new CaptionEvent(this, 1000));
        }
        catch(e){
            this.#onError(new CaptionEvent(this, 1003));
        }
    }

    #fetchCaptionFromXML() {
        if (this.#state === CaptionState.ERROR) return;

        let parser = new CaptionXMLParser(this.#captionLinkXML);
        this.list = parser.getCaptionList();
        if (this.list.length === 0) {
            this.list = null;
            this.#onError(new CaptionEvent(this, 1006));
        }
        else this.#onReady(new CaptionEvent(this, 0));
    }

    #getEnglishCaptionFileURL(pctr_json){
        //英語の字幕トラックを探す
        let english_ct = pctr_json.captionTracks.find(elm => elm.vssId === '.en');

        //見つからない場合は、自動生成の字幕を取得
        if (english_ct === undefined) 
            english_ct = pctr_json.captionTracks.find(elm => elm.vssId === 'a.en');
        
        //自動生成の字幕も見つからない場合、戻り値は undefined
        if (english_ct === undefined)
            return undefined;

        return english_ct.baseUrl;
    }

}