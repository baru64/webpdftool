var uploadedFiles = Array();
var convertedFile = "";

async function add() {
    let fileInput = document.getElementById("file-input");
    let fileList = document.getElementById("file-list");
    let files = fileInput.files;
    for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        let li = document.createElement("li");
        li.append(file.name);
        fileList.appendChild(li);
        text = await (new Response(file)).text()
        uploadedFiles.push(text);
    }
}

function convert() {
    let selector = document.getElementById("operation-selector");
    let option = selector.options[selector.selectedIndex].value;

    if(option === "makepdf") {
        imgsToPdf();
    } else if (option === "mergepdf") {
        mergePdfs();
    }
}

function download() {

}