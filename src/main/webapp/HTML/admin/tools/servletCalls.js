/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//
//function admin_newObject(_metadata) {
//    var _cookie = $.cookie('LCMS_session');
//    $.ajax({
//        method: "POST",
//        url: "./admin",
//        data: {action: "NEWOBJECT", LCMS_session: _cookie, metadata: _metadata},
//        beforeSend: function (xhr) {
//            xhr.overrideMimeType("application/html");
//        }
//    }).done(function (data) {
//        location.reload();
//        // parent.append(data);          
//    }).fail(function (data) {
//        alert("Sorry. Server unavailable. ");
//    });
//}
//
//
//function objects_doLoad(_parent) {
//    console.log("Objects load");
//    var _cookie = $.cookie('LCMS_session');
//    $.ajax({
//        method: "POST",
//        url: "./admin",
//        data: {action: "ADMIN_LOADOBJECTS", LCMS_session: _cookie},
//        beforeSend: function (xhr) {
//            xhr.overrideMimeType("application/html");
//        }
//    }).done(function (data) {
//        var jsonData = JSON.parse(data);
//        console.log(jsonData.webPage);
//        if (typeof jsonData.webPage !== 'undefined') {
//            jsonData.parent = _parent;
//            loadParameters(jsonData);
//        } else {
//            populateTable(jsonData, "ADMIN_EDITOBJECTS", './admin', $("#object-table"), "#object-pager", $("#div-grid-object-wrapper"), "Databaseobjecten", {});
//        }
//    }).fail(function (data) {
//        alert("Sorry. Server unavailable. ");
//    });
//}

function users_doLoad(_parent) {
    console.log("Users load");

    function onDone(data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            var gridData = {
                data: jsonData,
                editAction: "ADMIN_EDITUSERS",
                editUrl: "./admin",
                tableObject: "user-table",
                pagerID: "user-pager",
                wrapperObject: $("#div-grid-user-wrapper"),
                jqGridOptions: {
                    grouping: false,
                    groupingView: {
                        groupField: ['username'],
                        groupColumnShow: [false],
                        groupText: ['<b>{0} - {1} Item(s)</b>'],
                        groupCollapse: false
                    },
                    onSelectRow: function (rowid) {
                        return popupEdit(rowid, $("#user-table"), _parent, "ADMIN_EDITUSERS");
                    },
                    caption: "Account"
                },
                jqGridParameters: {
                    navGridParameters: {add: false}
                }
            };
            let ticketGrid = new LCMSGrid(gridData);
            ticketGrid.createGrid();
            ticketGrid.addGridButton((new LCMSTemplateGridButton("fa-plus", "Nieuw ticket", "", function () {
                return popupEdit('new', $("#user-table"), $(this), "ADMIN_EDITUSERS", function () {
                    return null;
                });
            }));
        }
    }

    LCMSRequest("./admin", {action: "ADMIN_LOADUSERS"}, onDone);

}

function tables_doLoad(_parent) {
    console.log("Tables load");

    function onDone(data) {
      
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            var gridData = {
                data: jsonData,
                editAction: "ADMIN_EDITTABLES",
                editUrl: "./lab",
                tableObject: "tables-table",
                pagerID: "tables-pager",
                wrapperObject: $("#div-grid-tables-wrapper"),
                jqGridOptions: {
                    grouping: false,
//                    groupingView: {
//                        groupField: ['username'],
//                        groupColumnShow: [false],
//                        groupText: ['<b>{0} - {1} Item(s)</b>'],
//                        groupCollapse: false
//                    },
                    onSelectRow: function (rowid) {
                        return popupEdit(rowid, $("#tables-table"), _parent, "ADMIN_EDITTABLES");
                    },
                    caption: "Tabellen"
                },
                jqGridParameters: {
                    navGridParameters: {add: false}
                }
            };
            let ticketGrid = new LCMSGrid(gridData);
            ticketGrid.createGrid();
            ticketGrid.addGridButton((new LCMSTemplateGridButton("fa-plus", "Nieuwe tabel", "", function () {
                return popupEdit('new', $("#tables-table"), $(this), "ADMIN_EDITTABLES", function () {
                    return null;
                });
            }));
        }
    }

    LCMSRequest("./lab", {action: "ADMIN_LOADTABLES"}, onDone);

}

function rights_doLoad(_parent) {
    console.log("Rights load");

    function onDone(data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            var gridData = {
                data: jsonData,
                editAction: "ADMIN_EDITRIGHTS",
                editUrl: "./lab",
                tableObject: "rights-table",
                pagerID: "rights-pager",
                wrapperObject: $("#div-grid-rights-wrapper"),
                jqGridOptions: {
                    grouping: false,
                    groupingView: {
                        groupField: ['table'],
                        groupColumnShow: [false],
                        groupText: ['<b>{0} - {1} Item(s)</b>'],
                        groupCollapse: false
                    },
                    onSelectRow: function (rowid) {
                        return popupEdit(rowid, $("#rights-table"), _parent, "ADMIN_EDITRIGHTS");
                    },
                    caption: "Rechten"
                },
                jqGridParameters: {
                    navGridParameters: {add: false}
                }
            };
            let ticketGrid = new LCMSGrid(gridData);
            ticketGrid.createGrid();
            ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw recht", "", function () {
                return popupEdit('new', $("#rights-table"), $(this), "ADMIN_EDITRIGHTS", function () {
                    return null;
                });
            }));
        }
    }

    LCMSRequest("./lab", {action: "ADMIN_LOADRIGHTS"}, onDone);

}

