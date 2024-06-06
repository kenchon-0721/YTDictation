class VideoHTMLParser {
    html_text;

    constructor(html_text) {
        this.html_text = html_text;
    }

    getJsonWithKey(key) {
        let reg_exp = new RegExp(`"${key}"\\s*:\\s*\\{\\s*`, "u");
        let split_text_list = this.html_text.split(reg_exp);
        for (let i=1; i<split_text_list.length; i++) {
            let last = VideoHTMLParser.#findIndexOfCloseBracket(split_text_list[i]);
            let json_text = `{${split_text_list[i].substring(0, last)}`;
            json_text = VideoHTMLParser.#unescape(json_text);
            try{
                return JSON.parse(json_text);
            }
            catch (e) {
                //jsonのフォーマットが不正であった場合
                //基本的には何もせずにループを続行
            }
        }
        return null;
    }

    //閉じかっこ末尾の位置を返します。
    //textは、カッコはじめを含まない文字列
    //見つからなかった場合は0を返します。
    static #findIndexOfCloseBracket(text) {
        let open_cnt = 1;
        let close_cnt = 0;
        let ret = -1;
        for (let i=0; i<text.length; i++) {
            if (text.charAt(i) == '{') open_cnt++;
            else if (text.charAt(i) == '}') close_cnt++;
            if (open_cnt == close_cnt) {
                ret = i;
                break;
            }
        }
        return ret + 1;
    }

    static #unescape(text) {
        let ret;
        let reg_exp = new RegExp("\\\\u[0-9a-fA-F]{4}", "ug");

        let split_text_list = text.split(reg_exp);
        let escaped_text_list = text.match(reg_exp);

        ret = split_text_list[0];
        let unescaped_char;
        for (let i=0; i<escaped_text_list.length; i++){
            unescaped_char = String.fromCharCode(parseInt(escaped_text_list[i].substring(2), 16));
            ret += unescaped_char;
            ret += split_text_list[i+1];
        }
        return ret;
    }
}

class CaptionXMLParser {
    TAG_LIST;
    constructor(dom) {
        this.TAG_LIST = dom.getElementsByTagName("text");
    }
    getCaptionList() {
        let ret = [];
        let elm;
        let i = 0;
        while(true) {
            elm = this.get(i);
            if (elm === undefined) break;
            ret.push(elm);
            i++;
        }
        return ret;
    }
    get(index) {
        try {
            let elm = this.TAG_LIST[index];
            if(elm === undefined) return undefined;
            let tim_str = elm.getAttribute("start");
            let dur = elm.getAttribute("dur");
            let tim_flt = parseFloat(tim_str);
            let tim_format = CaptionXMLParser.#sec2Format(tim_flt);
            let cap = this.TAG_LIST[index].innerHTML;
            cap = CaptionXMLParser.#unescape(cap);
            return {"time": tim_format, "time_float": tim_flt, "dur_float": dur, "caption": cap};
        }
        catch(e){
            return undefined;
        }
    }
    static #sec2Format(sec_float){
        let ret = "";
        let time_int = Math.round(sec_float);
        let hour, min, sec;

        sec = time_int%60;
        time_int = parseInt(time_int/60);
        min = time_int%60;
        time_int = parseInt(time_int/60);
        hour = time_int;

        let min_str, sec_str;
        if (hour != 0){
            ret += `${hour}:`;
            min_str = String(min).padStart(2, '0');
        }
        else {
            min_str = String(min);
        }

        sec_str = String(sec).padStart(2, '0');

        ret += `${min_str}:${sec_str}`;

        return ret;
    }
    static #unescape(str){
        let str_, ret;
        const patterns = {
            "&lt;"  : '<',
            "&gt;"  : '>',
            "&amp;" : '&',
            "&quot;": '"',
            "&#x27;": '\\',
            "&#x60;": '`'
        };
        str_ = str.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, match => {return patterns[match]});
        ret = str_.replace(/&#[0-9]+;/g, match => {
            let l = match.length;
            return String.fromCharCode(parseInt(match.substring(2, l-1)));
        });
        return ret;
    }
}