/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function onDone(data) {
    var jsonData = JSON.parse(data);
    console.log(jsonData.webPage);
    if (typeof jsonData.webPage !== 'undefined') {
        jsonData.parent = _parent;
        loadParameters(jsonData);
    } else {
        var gridData = {
            data: jsonData,
            editAction: "ICT_EDITTICKETS",
            editUrl: "./ict",
            tableObject: ("ICT-ticket-table"),
            pagerID: "ICT-ticket-pager",
            wrapperObject: $("#div-grid-wrapper"),
            jqGridOptions: {
                grouping: true,
                groupingView: {
                    groupField: ['status', 'category'],
                    groupColumnShow: [false, false],
                    groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
                    groupCollapse: true
                },
                onSelectRow: function (rowid) {
                    //return popupEdit(rowid, $("#ICT-ticket-table"), _parent, "ICT_EDITTICKETS");
                    return ticketGrid.popupEdit(rowid, function () {
                        return null;
                    });
                },
                caption: "ICT-tickets in het labo"
            },
            jqGridParameters: {
                navGridParameters: {add: false}
            }
        };
        let ticketGrid = new LCMSGrid(gridData);
        ticketGrid.createGrid();
        ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw ticket", "", function () {
//            return popupEdit('new', $("#ICT-ticket-table"), $(this), "ICT_EDITTICKETS", function () {
//                return null;
//            });
            return ticketGrid.popupEdit('new', function () {
                return null;
            });
        }));

        ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-download", "Download selection as csv", "", function () {
            ticketGrid.export_as_html();
        }));

        ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-list-ul", "Click here to change columns", "", function () {
            ticketGrid.toggle_multiselect();
        }));

    }
}


function ICTtickets_doLoad(_parent) {
    console.log("ICT-tickets load");
    //  LCMSTableRequest("ICT_LOADTICKETS", "ICT_EDITTICKETS", "./ict", "ICT-ticket-table", "ICT-ticket-pager", "div-grid-wrapper", lang["ICTTickets"]['title']);


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
            var gridData = {
                data: jsonData,
                editAction: "ICT_EDITTICKETS",
                editUrl: "./ict",
                tableObject: ("ICT-ticket-table"),
                pagerID: "ICT-ticket-pager",
                wrapperObject: $("#div-grid-wrapper"),
                jqGridOptions: {
                    grouping: true,
                    groupingView: {
                        groupField: ['status', 'category'],
                        groupColumnShow: [false, false],
                        groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
                        groupCollapse: true
                    },
                    onSelectRow: function (rowid) {
                        return popupEdit(rowid, $("#ICT-ticket-table"), _parent, "ICT_EDITTICKETS");
                    },
                    caption: "ICT-tickets in het labo"
                },
                jqGridParameters: {
                    navGridParameters: {add: false}
                }
            };
            let ticketGrid = new LCMSGrid(gridData);
            ticketGrid.createGrid();
            ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw ticket", "", function () {
                return popupEdit('new', $("#ICT-ticket-table"), $(this), "ICT_EDITTICKETS", function () {
                    return null;
                });
            }));

            ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-download", "Download selection as csv", "", function () {
                ticketGrid.export_as_html();
            }));

            ticketGrid.addGridButton(new LCMSTemplateGridButton("fa-list-ul", "Click here to change columns", "", function () {
                ticketGrid.toggle_multiselect();
            }));

        }
    }
    ).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

