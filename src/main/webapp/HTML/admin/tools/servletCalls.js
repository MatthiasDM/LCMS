/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function admin_newObject(_metadata) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "NEWOBJECT", LCMS_session: _cookie, metadata: _metadata},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        location.reload();
        // parent.append(data);          
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}


function objects_doLoad(_parent) {
    console.log("Objects load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "ADMIN_LOADOBJECTS", LCMS_session: _cookie},
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
            populateTable(jsonData, "ADMIN_EDITOBJECTS", './admin', $("#object-table"), "#object-pager", $("#div-grid-object-wrapper"), "Databaseobjecten", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function users_doLoad(_parent) {
    console.log("Users load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "ADMIN_LOADUSERS", LCMS_session: _cookie},
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
            ticketGrid.addGridButton("fa-plus", "Nieuw ticket", "", function () {
                return popupEdit('new', $("#ICT-ticket-table"), $(this), "ICT_EDITTICKETS", function () {
                    return null;
                });
            });


          //  populateTable(jsonData, "ADMIN_EDITUSERS", './admin', $("#user-table"), "#user-pager", $("#div-grid-user-wrapper"), "Gebruikers in het labo", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

