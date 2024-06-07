//字幕の量に合わせて変化する行の高さにtextareaの高さを合わせる関数
function adjustTextareaHeight() {
    const table = document.getElementById('dictationTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        const textarea = cells[1].querySelector('textarea');

        textarea.style.height = 'auto';
        const rowHeight = row.scrollHeight;
        
        textarea.style.height = rowHeight + 'px';
    }
}

//字幕の表示・非表示機能
function displaySubtitles(st){
    const tf = st.dataset.TF;

    if(tf == "true"){
        st.style.color = '#F5EDED';     //背景に同化
        st.style.userSelect = "none";   //選択の拒否
        st.dataset.TF = "false";        //フラグの修正
    }
    else{
        st.style.color = 'black';       //文字表示
        st.style.userSelect = "auto";   //選択の許可
        st.dataset.TF = "true";
    }

}

// 初期化
window.addEventListener('load', adjustTextareaHeight);
//ウィンドウサイズの変更時
window.addEventListener('resize', adjustTextareaHeight);

//前の表の削除
function deletingTable(){
    const deleteTable = Array.from(document.getElementsByClassName('captionLine'));
    if(deleteTable != null){
        deleteTable.forEach(deleteLine => deleteLine.remove());
    }
}

//表の作成
function makingTable(){
    const tableContents = document.getElementById('dictationTable');
    let insertElement;

    for (let i = 0; i < caption.list.length; i++){
        insertElement = '<tr class="captionLine">\n<td class="col0">\n<button class="rewind">'
        insertElement += caption.list[i].time + '</button>\n</td>\n<td class="col1">\n<textarea class="textDictation"></textarea>\n</td>\n';
        insertElement += '<td class="col2" data-TF="false" ondblclick="displaySubtitles(this)">' + caption.list[i].caption + '\n</td>\n</tr>\n';

        tableContents.insertAdjacentHTML('beforeend', insertElement);
    }
}


//字幕の準備が整った際に呼び出される関数
//caption.list により、字幕情報が取得できます。
function onCaptionReady(){
    let caption_list = caption.list;
    deletingTable();
    makingTable();
    caption_list.forEach(elm => {
        console.log(`${elm.time}    ${elm.caption}`);
    });
}

//読み込み時にエラーが発生した時の処理
function onSearchError(){
    str = `Error from ${error.src}:\n${error.message}\n`
    if(error.detail !== "") str += error.detail;
    alert(str);
    
}