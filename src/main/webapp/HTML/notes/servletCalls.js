/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function notes_doLoad(_parent) {
    console.log("Notes load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./note",
        data: {action: "NOTE_LOADNOTES", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {

            var extraOptions = {};
            //extraOptions.gridComplete = loadContextMenu;//($("#note-table"), $("#div-grid-wrapper"));
            //extraOptions.ondblClickRow = editNote;//($("#note-table")); 
            extraOptions.onSelectRow = editNote;
            populateTable(jsonData, "NOTE_EDITNOTES", './note', $("#note-table"), "#note-pager", $("#div-grid-wrapper"), "Al uw persoonlijke notities", extraOptions);
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}




function editRow() {

    setTimeout(function () {
        var _tableObject = $("#note-table");
        var grid = _tableObject;
        var rowKey = grid.getGridParam("selrow");
        if (rowKey) {
            grid.editGridRow(rowKey,
                    {
                        closeAfterEdit: true,
                        extraparam: {action: "NOTE_EDITNOTES", LCMS_session: $.cookie('LCMS_session')}

                    });
        } else {
            console.log("No rows are selected");
        }
    }, 500);

}

var lastSelection;

function editNote(id) {
    var _tableObject = $("#note-table");

    var grid = _tableObject;
    // var id = grid.getGridParam("selrow");
    console.log(id);
    //$('#notes-list').BootSideMenu.close();

    if (id && id !== lastSelection) {
        var rowData = grid.jqGrid('getRowData', id);
        console.log(rowData);
        notes_getNote($("#div-note"), rowData.docid);
        lastSelection = id;
    }





}
;

function notes_getNote(_parent, _id) {

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./note",
        data: {action: "NOTE_GETNOTE", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        //_parent.append(data);
        _parent.empty();


        console.log("Start loading note");
        var jsonData = JSON.parse(data, _parent);
        jsonData.parent = _parent;
        if (typeof (jsonData.parameters) !== "undefined") {
            jsonData.parameters["note-metadata"] = note_createMetaDataHeader(jsonData.parameters["note-metadata"]);
        }
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "note-id", jsonData.replaces["note-id"]);
            jsonData.webPage = replaceAll(jsonData.webPage, "note-content", jsonData.replaces["note-content"]);
            _parent.click();
        }
        loadParameters(jsonData);
        //$("#modal-notes").modal();
        console.log("Fetched one note.");
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function note_createMetaDataHeader(_metadata) {
    var container = $("<div></div>");

    var div = $("<div class='container'></div>");
    var row = $("<div class='row'></div>");
    var metadata = JSON.parse(_metadata);
    row.append($("<div class='col'><button class='btn btn-secondary' type='button' onclick='note_save(\"editor-" + metadata.docid + "\")'>Opslaan</button></div>"));
    row.append($("<div class='col'><h5>" + metadata.title + "</h5></div>"));
    row.append($("<div class='col'>Author: " + metadata.author + "</div>"));
    div.append(row);
    container.append(div);
    return container.html();
}

function note_save(instance) {
// PREPARE FORM DATA
    var data = CKEDITOR.instances[instance].getData();
    data = removeElements("nosave", data);
    
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./note",
        data: {action: "NOTE_SAVENOTE", LCMS_session: _cookie, content: data, docid: instance},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        bootstrap_alert.warning('Notitie opgeslaan', 'success', 2000);
        console.log("Changes saved.")
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

