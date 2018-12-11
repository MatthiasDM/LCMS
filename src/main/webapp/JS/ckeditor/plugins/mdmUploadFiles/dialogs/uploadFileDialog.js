var currentEditor;
CKEDITOR.dialog.add('uploadFileDialog', function (editor) {
    return {
        title: 'Bestanden invoegen of uploaden',
        minWidth: 400,
        minHeight: 400,
        contents: [
            {
                id: 'Upload',
                hidden: true,
                label: editor.lang.image.upload,
                elements: [{
                        type: 'file',
                        id: 'upload',
                        label: editor.lang.image.btnUpload,
                        style: 'height:40px',
                        size: 38
                    },
                    {
                        type: 'html',
                        html: "<table id='filebrowser-table'></table><div id='filebrowser-pager'></div></div>"
                    }
                ]
            }
        ],
        onOk: function () {
            // "this" is now a CKEDITOR.dialog object.
            // Accessing dialog elements:
            console.log("submitting");
            var formData = new FormData();
            var dialog = this;
            var form = $($(dialog.parts.contents.find("iframe").getItem(0).$).contents()[0].forms);
            form.attr("enctype", "multipart/form-data");
            var _file = form.find("input")[0].files[0];
            formData.append('action', 'FILE_UPLOAD');
            formData.append('LCMS_session', $.cookie('LCMS_session'));
            formData.append('file', _file);
            doUpload(formData);
            //e.preventDefault();
        },
        onShow: function () {
            currentEditor = editor;
            files_doBrowse();
        }


    };
});
function doUpload(_data) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            files_doBrowse();
        }
    }
    // POST to httpbin which returns the POST data as JSON
    request.open('POST', "./upload", /* async = */ false);
    request.send(_data);
}

function doDownload(_file) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            files_doBrowse();
        }
    }
    // POST to httpbin which returns the POST data as JSON
    request.open('POST', "./upload", /* async = */ false);
    request.send(_data);
}

function files_doBrowse() {
    console.log("uploads load");
    var _cookie = $.cookie('LCMS_session');
     

    jQuery("#filebrowser-table").jqGrid("GridUnload");
    $.ajax({
        method: "POST",
        url: "./upload",
        data: {action: "FILE_BROWSE", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            // jsonData.parent = _parent;
            //loadParameters(jsonData);
        } else {
            var extraOptions = {};
            extraOptions.onSelectRow = insertFileInEditor;
            populateTable(jsonData, "", './upload', $("#filebrowser-table"), "#filebrowser-pager", $("#div-grid-wrapper"), "Bestanden op de server", extraOptions);
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function insertFileInEditor(rowId) {

    var _tableObject = $("#filebrowser-table");
    var grid = _tableObject;
    var dataFromTheRow = grid.jqGrid('getRowData', rowId);

    var re = /(?:\.([^.]+))?$/;
    var type = re.exec(dataFromTheRow.name)[0];

    var formData = new FormData();
    formData.append('action', 'FILE_DOWNLOADTEMP');
    formData.append('LCMS_session', $.cookie('LCMS_session'));
    formData.append('filename', dataFromTheRow.name);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            var jsonData = JSON.parse(request.responseText);
            var filePath = jsonData.filePath;
            if (type == ".png" || type == ".jpg" || type == ".JPG" || type == ".gif") {
                currentEditor.insertHtml("<img name='" + dataFromTheRow.name + "' fileid='"+dataFromTheRow.fileid+"' src='" + filePath + "'/>");
            } else {
                currentEditor.insertHtml("<a name='" + dataFromTheRow.name + "'  href='" + filePath + "' fileid='"+dataFromTheRow.fileid+"'>" + dataFromTheRow.name + "</a>");
            }
        }
    }
    request.open('POST', "./upload", /* async = */ false);
    request.send(formData);

    //CKEDITOR.instances["editor-f49c0771-6093-4646-bc4c-dc4bf7388703"].insertHtml("esgdsg")



    CKEDITOR.dialog.getCurrent().hide();

}

