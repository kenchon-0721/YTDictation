//字幕の量に合わせて変化する行の高さにtextareaの高さを合わせる関数
function adjustTextareaHeight() {
    const table = document.getElementById('dictationTable');
    const rows = table.getElementsByTagName('tr');

for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');
    const textarea = cells[1].querySelector('textarea');
    const rowHeight = row.scrollHeight;

    textarea.style.height = rowHeight + 'px';
}
}

// 初期化
window.addEventListener('load', adjustTextareaHeight);
window.addEventListener('resize', adjustTextareaHeight);