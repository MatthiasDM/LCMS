/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ICTtickets_doLoad(_parent) {
    console.log("ICT-tickets load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./ict",
        data: {action: "ICT_LOADTICKETS", LCMS_session: _cookie},
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
<<<<<<< HEAD
            var extraOptions = {
                grouping: true,
                groupingView: {
                    groupField: ['status', 'category'],
                    groupColumnShow: [false,  false],
                    groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
                    groupCollapse: true,
                }};
            extraOptions.onSelectRow = editTicket;
            var navGridParameters = {
                add: false                
            }
            populateTable(jsonData, "ICT_EDITTICKETS", './ict', $("#ICT-ticket-table"), "#ICT-ticket-pager", $("#div-grid-wrapper"), "ICT-tickets in het labo", extraOptions, navGridParameters);
//            $("#ICT-ticket-table_iladd").on("click", function () {
//                editTicket('new');
//            });
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}
function ticketPopup() {
    setTimeout(function () {
        var _tableObject = $("#ICT-ticket-table");
        var grid = _tableObject;
        var rowKey = grid.getGridParam("selrow");
        if (rowKey) {
            grid.editGridRow(rowKey,
                    {
                        closeAfterEdit: true,
                        extraparam: {action: "ICT_EDITTICKETS", LCMS_session: $.cookie('LCMS_session')}
                    });
        } else {
            console.log("No rows are selected");
        }
    }, 500);

}

function ICTtickets_getTicket(_parent, _id) {

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./ict",
        data: {action: "ICT_GETTICKET", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        //_parent.append(data);
        _parent.empty();
        console.log("Start loading ticket");
        var jsonData = JSON.parse(data, _parent);
        jsonData.parent = _parent;
        if (typeof (jsonData.parameters) !== "undefined") {
            jsonData.parameters["note-metadata"] = note_createMetaDataHeader(jsonData.parameters["ictticket-metadata"]);
        }
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "ictticket-id", jsonData.replaces["ictticket-id"]);
            jsonData.webPage = replaceAll(jsonData.webPage, "ictticket-content", jsonData.replaces["ictticket-content"]);
            _parent.click();
        }
        loadParameters(jsonData);
        //$("#modal-notes").modal();
        console.log("Fetched one ticket.");
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function editTicket(action) {
    var _tableObject = $("#ICT-ticket-table");
    var parent = $("#btn-edit-ticket");
    var grid = _tableObject;
    console.log("new ticket");

    grid.jqGrid('editGridRow', action, {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: parent.offset().left * -1 + $("body").width() * 0.05,
        top: parent.offset().top * -1 + 40,
        afterShowForm: function (formid) {
            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' '
                });
            });
            $("#created_on").val(moment().format('D-M-YY'));
        },
        beforeSubmit: function (postdata, formid) {
            $("textarea[title=ckedit]").each(function (index) {
                var editorname = $(this).attr('id');
                var editorinstance = CKEDITOR.instances[editorname];
                var text = editorinstance.getData();
                // CKEDITOR.instances[editorname].element.remove()
                postdata[editorname] = text;
            });
            console.log("Checking post data");
        },
        afterComplete: function (response, postdata, formid) {
            $("#cData").trigger("click");
            return [success, message, new_id];
        },
        editData: {action: "ICT_EDITTICKETS", LCMS_session: $.cookie('LCMS_session')}
    }

    );
=======
            var extraOptions = {};
            extraOptions.onSelectRow = editTicket;
            populateTable(jsonData, "ICT_EDITTICKETS", './ict', $("#ICT-ticket-table"), "#ICT-ticket-pager", $("#div-grid-wrapper"), "ICT-tickets in het labo", extraOptions);
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}
function ticketPopup() {
    setTimeout(function () {
        var _tableObject = $("#ICT-ticket-table");
        var grid = _tableObject;
        var rowKey = grid.getGridParam("selrow");
        if (rowKey) {
            grid.editGridRow(rowKey,
                    {
                        closeAfterEdit: true,
                        extraparam: {action: "ICT_EDITTICKETS", LCMS_session: $.cookie('LCMS_session')}
                    });
        } else {
            console.log("No rows are selected");
        }
    }, 500);

}

function ICTtickets_getTicket(_parent, _id) {

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./ict",
        data: {action: "ICT_GETTICKET", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        //_parent.append(data);
        _parent.empty();
        console.log("Start loading ticket");
        var jsonData = JSON.parse(data, _parent);
        jsonData.parent = _parent;
        if (typeof (jsonData.parameters) !== "undefined") {
            jsonData.parameters["note-metadata"] = note_createMetaDataHeader(jsonData.parameters["ictticket-metadata"]);
        }
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "ictticket-id", jsonData.replaces["ictticket-id"]);
            jsonData.webPage = replaceAll(jsonData.webPage, "ictticket-content", jsonData.replaces["ictticket-content"]);
            _parent.click();
        }
        loadParameters(jsonData);
        //$("#modal-notes").modal();
        console.log("Fetched one ticket.");
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function editTicket(action) {
    var _tableObject = $("#ICT-ticket-table");
    var parent = $("#btn-edit-ticket");
    var grid = _tableObject;
    console.log("new ticket");
    
    grid.jqGrid('editGridRow', action, {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: parent.offset().left * -1 + $("body").width() * 0.05,
        top: parent.offset().top * -1 + 40,
        afterShowForm: function (formid) {
            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' '
                });
            });
        },
        beforeSubmit: function (postdata, formid) {
            $("textarea[title=ckedit]").each(function (index) {
                var editorname = $(this).attr('id');
                var editorinstance = CKEDITOR.instances[editorname];
                var text = editorinstance.getData();
                // CKEDITOR.instances[editorname].element.remove()
                postdata[editorname] = text;
            });
            console.log("Checking post data");
        },
        afterComplete: function (response, postdata, formid) {
            $("#cData").trigger("click");
            return [success, message, new_id];
        },
        editData: {action: "ICT_EDITTICKETS", LCMS_session: $.cookie('LCMS_session')}
    } 
            
    );
    

    //  
    //  var rowKey = grid.getGridParam("selrow");
    //  if (rowKey) {
    // grid.editGridRow("new",
    //         {
    //             closeAfterEdit: true,
    //              extraparam: {action: "ICT_EDITTICKETS", LCMS_session: $.cookie('LCMS_session')}

    //          });
    // } else {
    //     console.log("No rows are selected");
    //   }





>>>>>>> origin/master

}
