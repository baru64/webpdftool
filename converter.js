var uploadedFiles = Array();
var uploadedFilenames = Array(); // [filename, id]
var convertedFile = "test";

async function add() {
    let fileInput = document.getElementById("file-input");
    let fileList = document.getElementById("file-list");
    let files = fileInput.files;
    for(let i = 0; i < files.length; i++) {
        let file = files.item(i);
        let li = document.createElement("li");
        let uploadedFilesCount = uploadedFilenames.length;
        li.setAttribute("id", "file-" + uploadedFilesCount);
        
        let buttonUp = document.createElement("button");
        buttonUp.setAttribute("class", "file-" + uploadedFilesCount);
        buttonUp.setAttribute("onclick", 'reorder(this, "up")');
        buttonUp.append("↑");
        let buttonDown = document.createElement("button");
        buttonDown.setAttribute("class", "file-" + uploadedFilesCount);
        buttonDown.setAttribute("onclick", 'reorder(this, "down")');
        buttonDown.append("↓");

        li.append(file.name);
        li.appendChild(buttonUp);
        li.appendChild(buttonDown);
        fileList.appendChild(li);
        uploadedFilenames.push([file.name, "file-"+uploadedFilesCount]);

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

function reorder(element, direction) { // TODO
    let fileList = document.getElementById("file-list");
    let i = 0;
    while(uploadedFilenames[i][1] != element.getAttribute("class")) {
        i++;
        if(i == uploadedFilenames.length)
            return;
    }
    console.log("----- index: " + i);
    if(direction == "up" && i != 0) {
        swap(uploadedFilenames, i, i-1);
        swap(uploadedFiles, i, i-1);
    } else if (direction == "down" && i != uploadedFilenames.length)
    {
        swap(uploadedFilenames, i, i+1);
        swap(uploadedFiles, i, i+1);
    }
    fileList.innerHTML = "";
    for(let k = 0; k < uploadedFilenames.length; k++) {
        let li = document.createElement("li");
        li.setAttribute("id", uploadedFilenames[k][1]);
        
        let buttonUp = document.createElement("button");
        buttonUp.setAttribute("class", uploadedFilenames[k][1]);
        buttonUp.setAttribute("onclick", 'reorder(this, "up")');
        buttonUp.append("↑");
        let buttonDown = document.createElement("button");
        buttonDown.setAttribute("class", uploadedFilenames[k][1]);
        buttonDown.setAttribute("onclick", 'reorder(this, "down")');
        buttonDown.append("↓");

        li.append(uploadedFilenames[k][0]);
        li.appendChild(buttonUp);
        li.appendChild(buttonDown);
        fileList.appendChild(li);
    }
}

function swap(arr, indexA, indexB) {
    let tmp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = tmp;
}

function reset() {
    uploadedFiles = Array();
    uploadedFilenames = Array();
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