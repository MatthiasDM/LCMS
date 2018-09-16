/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    inventory_doLoad($("#inventory-container"));
    onBarcodeEnter();
});
function onBarcodeEnter() {

    $("#inventoryBarcode").on('keyup', function (e) {
        if (e.keyCode == 13) {
            inventory_doBarcodeLookup($("#inventoryBarcode").val());
        }
    });
}

function addItem(data) {
    parameters =
            {
                rowID: "new_row",
                initdata: data,
                position: "first",
                useDefValues: false,
                useFormatter: false,
                addRowParams: {extraparam: {}}
            }
    jQuery("#inventory-table").jqGrid('addRow', parameters);
}

function newIventoryItem(){
        
}

function newLabItem(barcode) {
    var labItemTable = $("<table id='tempLabItemTable'></table>");
    $("body").append(labItemTable);
    labItemTable = loadLabItemModal($("#tempLabItemTable"), barcode);
}

function addInventoryItem(labItem) {
// var _tableObject = $("#ICT-ticket-table");


    var parent = $("#inventory-table");    
    var grid = $("#inventory-table");
    
    console.log("new inventory item");
    //grid.jqGrid('editGridRow', "new", {});

    grid.jqGrid('editGridRow', "new", {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: -parent.offset().left/1,
        top: -parent.offset().top/2,
        addCaption: "<p>Product aan de vooraad toevoegen</p>",       
        afterShowForm: function (formid) {
            $("#name").val(labItem.labitemid);
            $("#storage").val(labItem.storage);
            $("#date_in").val(moment().format('d-M-Y H:m'));          
            $("#barcode").val(labItem.identifier + moment().format('dMYHm') + Math.floor(Math.random() * 10000)+1);  
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
        editData: {action: "LAB_EDITINVENTORY", LCMS_session: $.cookie('LCMS_session'), labitem_id: labItem.labitemid}
    }

    );
}




function addLabItem(_tableObject, barcode) {
// var _tableObject = $("#ICT-ticket-table");
    var parent = _tableObject;
    var grid = _tableObject;
    console.log("new ticket");
    //grid.jqGrid('editGridRow', "new", {});

    grid.jqGrid('editGridRow', "new", {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: parent.offset().left * -1 + $("body").width() * 0.05,
        top: parent.offset().top * -1 + 200,
        addCaption: "<p>Onbekend product. Gelieve dit product eerst te registeren.</p>",

        afterShowForm: function (formid) {
            $("#identifier").val(barcode);
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
        editData: {action: "LAB_EDITLABITEM", LCMS_session: $.cookie('LCMS_session')}
    }

    );
}

function loadLabItemModal(_parent, barcode) {
    console.log("labitem load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_LOADLABITEM", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        var extraOptions = {};
        _parent = populateTable(jsonData, "LAB_EDITLABITEM", './lab', _parent, "#labitem-pager", $("#div-grid-wrapper"), "De verschillende producten in het labo.", extraOptions);
        $("#gbox_tempLabItemTable").css("visibility", "hidden");
        //$("#gbox_tempLabItemTable").css("top", "0px");
        addLabItem(_parent, barcode);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}


