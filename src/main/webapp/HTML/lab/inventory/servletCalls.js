/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function inventory_doLoad(_parent) {
    console.log("inventory load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_LOADINVENTORY", LCMS_session: _cookie},
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
            var extraOptions = {
                grouping: true,
                groupingView: {
                    groupField: ['labitem_id'],
                    groupColumnShow: [false],
                    groupText: ['<b>{0}</b> - {1} Product(en)'],
                    groupCollapse: true,
                }};
            populateTable(jsonData, "LAB_EDITINVENTORY", './lab', $("#inventory-table"), "#inventory-pager", $("#div-grid-wrapper"), "Voorraad in het labo.", extraOptions);
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function inventory_doBarcodeLookup(barcode) {
    console.log("inventory barcode lookup");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_CHECKINVENTORY", LCMS_session: _cookie, barcode: barcode},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        if (typeof data != 'undefined') {
            var jsonData = JSON.parse(data);
            if (jsonData.action == "newlabitem") {
                newLabItem(barcode);
            } else if (jsonData.action == "newinventoryitem") {
                addInventoryItem(JSON.parse(jsonData.result));
            } else if (jsonData.action == "checkout") {
                checkout(jsonData.result);
            }
            bootstrap_alert.warning('Product toegevoegd', 'success', 2000);

        } else {
            bootstrap_alert.warning('Request returned null: barcode lookup', 'info', 2000);
        }


//        console.log(jsonData.webPage);
//        if (typeof jsonData.webPage !== 'undefined') {
//            jsonData.parent = _parent;
//            loadParameters(jsonData);
//        } else {
//            populateTable(jsonData, "LAB_EDITINVENTORY", './lab', $("#inventory-table"), "#inventory-pager", $("#div-grid-wrapper"), "Voorraad in het labo.", {});
//        }
    }).fail(function (data) {
        console.log(data);
        bootstrap_alert.warning('Server request failed: barcode lookup', 'warning', 2000);
    });
}