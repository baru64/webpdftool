var uploadedFiles = Array();
var convertedFile = "test";

async function add() {
    let fileInput = document.getElementById("file-input");
    let fileList = document.getElementById("file-list");
    let files = fileInput.files;
    for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        let li = document.createElement("li");
        li.append(file.name);
        fileList.appendChild(li);
        // fileBin = await (new Response(file))
        
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

function reset() {
    uploadedFiles = Array();
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