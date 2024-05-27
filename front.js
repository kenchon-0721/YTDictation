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