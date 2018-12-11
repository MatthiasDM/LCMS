/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function notes_newNote(_parent, _metadata) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./notes",
        data: {action: "CREATENOTE", LCMS_session: _cookie, metadata: _metadata},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        console.log("Note created.");
        location.reload();

    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function notes_autoSave(_changes) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./notes",
        data: {action: "AUTOSAVE", LCMS_session: _cookie, changes: __changes},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        console.log("Changes saved.")
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

//function notes_listNotes(_parent) {
//    var _cookie = $.cookie('LCMS_session');
//    $.ajax({
//        method: "POST",
//        url: "./notes",
//        data: {action: "LISTNOTES", LCMS_session: _cookie},
//        beforeSend: function (xhr) {
//            xhr.overrideMimeType("application/html");
//        }
//    }).done(function (data) {
//        _parent.append(data);
//        console.log("Notes loaded.")
//    }).fail(function (data) {
//        alert("Sorry. Server unavailable. " );
//    });
//
//}

function notes_getNote(_parent, _id) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./notes",
        data: {action: "GETNOTE", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        //_parent.append(data);
        _parent.empty();
        var jsonData = JSON.parse(data, _parent);
        jsonData.parent = _parent;
        if (typeof (jsonData.parameters) !== "undefined") {
            jsonData.parameters["note-metadata"] = note_createMetaDataHeader(jsonData.parameters["note-metadata"]);
        }        
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "note-id", jsonData.replaces["note-id"]); 
            jsonData.webPage = replaceAll(jsonData.webPage, "note-content", jsonData.replaces["note-content"]);  
        }
        loadParameters(jsonData);
        $("#modal-notes").modal();
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
    row.append($("<div class='col'><h5>" + metadata.title + "</h5></div>"));
    row.append($("<div class='col'>Author: " + metadata.author + "</div>"));
    div.append(row);
    container.append(div);
    return container.html();
}

