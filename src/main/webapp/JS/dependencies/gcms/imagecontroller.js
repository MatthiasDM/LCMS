/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class LCMSImageController {
    constructor(publicPage) {
        this.publicPage = publicPage;
    }

    uploadFile() {}

    async loadImages(editor, editorObject) {
        var me = this;
        var _editorObject;
        if (editor !== "") {
            var images = $("#" + editor).find('[fileid]');
            if (images.length < 1) {
                images = $("#cke_" + editor).find("iframe").contents().find('[fileid]');
            }
            _editorObject = $("#" + editor);
        } else {
            var images = editorObject.find('[fileid]');
            
            _editorObject = editorObject;
        }
        images.each(async function (index) {
            let newImage = await me.downloadToTemp($(this));
            if($(newImage).attr("src") != $(_editorObject.find('[fileid]')[index]).attr("src")){
                 _editorObject.find('[fileid]')[index] = newImage;
            }
           
        });
        return images;
    }

    async downloadToTemp(file) {

        async function onDone(data) {
            try {
                if (data.length > 0){ //&& file.attr("src").length <= 0) {
                    var jsonData = JSON.parse(data);
                    var filePath = jsonData.filePath;
                    console.log("Changing filepath from " + file.attr("src") + " to " + filePath);
                    file.attr("src", filePath);
                    file.attr("href", filePath);
                }else{
                    console.log("Something wrong with image file (incorrect attributes?): " + jsonData);                    
                }
                return file;
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doDownloadToTemp";
        requestOptions.filename = file.attr("name");
        console.log("file to be downloaded: " + file.attr("name"));
        requestOptions.public = this.publicPage;
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;


    }

    async insertFileInEditor(_fileName, _fileId, _ckeditor) {
        var re = /(?:\.([^.]+))?$/;
        var type = re.exec(_fileName)[0];
        var formData = new FormData();
        var ckeditor = CKEDITOR.instances[_ckeditor.attr('id')];
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doDownloadToTemp";
        requestOptions.filename = _fileName;
        requestOptions.public = this.publicPage;
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);

        async function onDone(data) {
            try {
                var jsonData = JSON.parse(data);
                var filePath = jsonData.filePath;
                if (type === ".png" || type === ".jpg" || type === ".JPG" || type === ".gif" || type === ".PNG") {
                    console.log("Insert image into editor...");
                    ckeditor.insertHtml("<div style='overflow-x:auto' id='" + _fileId + "'><img name='" + _fileName + "' fileid='" + _fileId + "' src='" + filePath + "'/></div>");
                    $(ckeditor.editable().$).find('img[src^=data]').remove();
                } else {
                    ckeditor.insertHtml("<a name='" + _fileName + "'  href='" + filePath + "' fileid='" + _fileId + "'>" + _fileName + "</a>");
                }
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        return returnvalue;

//        formData.append('action', 'FILE_DOWNLOADTEMP');
//        formData.append('LCMS_session', $.cookie('LCMS_session'));
//        formData.append('public', this.publicPage);
//        formData.append('filename', _fileName);
//        var request = new XMLHttpRequest();
//        request.onreadystatechange = function () {
//            if (request.readyState === 4) {
//                var jsonData = JSON.parse(request.responseText);
//                var filePath = jsonData.filePath;
//                if (type === ".png" || type === ".jpg" || type === ".JPG" || type === ".gif" || type === ".PNG") {
//                    ckeditor.insertHtml("<div style='overflow-x:auto'><img name='" + _fileName + "' fileid='" + _fileId + "' src='" + filePath + "'/></div>");
//                } else {
//                    ckeditor.insertHtml("<a name='" + _fileName + "'  href='" + filePath + "' fileid='" + _fileId + "'>" + _fileName + "</a>");
//                }
//            }
//        };
//        request.open('POST', "./upload", /* async = */ false);
//        request.send(formData);
    }

//    encodeImage(imageUri, callback) {
//        var c = document.createElement('canvas');
//        var ctx = c.getContext("2d");
//        var img = new Image();
//        img.crossOrigin = "";
//        img.onload = function () {
//            c.width = this.width;
//            c.height = this.height;
//            ctx.drawImage(img, 0, 0);
//            var dataURL = c.toDataURL("image/jpeg");
//            callback(dataURL);
//        };
//        img.src = imageUri;
//    }

//    encodeImage(imageUri) {
//        fetch(imageUri)
//                .then(res => res.blob())
//                .then(blob => {
//                    const file = new File([blob], 'dot.png', blob);
//                    console.log(file);
//                    
//                });
//    }

    toDataURL(url, callback) {
        
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function () {
            var fileReader = new FileReader();
            fileReader.onloadend = function () {
                callback(fileReader.result);
            };
            fileReader.readAsDataURL(httpRequest.response);
        };
        httpRequest.open('GET', url);
        httpRequest.responseType = 'blob';
        httpRequest.send();
    }

    urltoFile(url, filename, mimeType) {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
        return (fetch(url)
                .then(function (res) {
                    return res.arrayBuffer();
                })
                .then(function (buf) {
                    return new File([buf], filename, {type: mimeType});
                })
                );
    }

}
