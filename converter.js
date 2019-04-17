var uploadedFiles = Array();
var uploadedFilesCount = 0;
var convertedFile = "test";

async function add() {
    let fileInput = document.getElementById("file-input");
    let fileList = document.getElementById("file-list");
    let files = fileInput.files;
    for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        let li = document.createElement("li");
        li.setAttribute("id", "file-" + uploadedFilesCount);
        
        let buttonUp = document.createElement("button");
        buttonUp.setAttribute("id", "fileUp-" + uploadedFilesCount);
        buttonUp.setAttribute("onclick", 'swap(this, "up")');
        buttonUp.append("↑");
        let buttonDown = document.createElement("button");
        buttonDown.setAttribute("id", "fileDown-" + uploadedFilesCount);
        buttonDown.setAttribute("onclick", 'swap(this, "down")');
        buttonDown.append("↓");

        li.append(file.name);
        li.appendChild(buttonUp);
        li.appendChild(buttonDown);
        fileList.appendChild(li);
        uploadedFilesCount++;

        let fileBuffer;
        let reader = new FileReader();
        reader.onload = function(event) {
            fileBuffer = event.target.result;                 
            console.log(fileBuffer)
            console.log(window.btoa(fileBuffer))
            uploadedFiles.push(window.btoa(fileBuffer));
        };
        reader.readAsBinaryString(file);
    }
}

function swap(element, direction) { // TODO

}

function reset() {
    uploadedFiles = Array();
    uploadedFilesCount = 0;
    let fileList = document.getElementById("file-list");
    while (fileList.firstChild) {
        fileList.removeChild(fileList.firstChild);
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

setupDownloadLink = function(link, data) {
    link.href = 'data:application/pdf;base64,' + data;
};