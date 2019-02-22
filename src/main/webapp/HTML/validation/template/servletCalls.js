function validation_save() {
    console.log("validation_save()");
// PREPARE FORM DATA
    var validationid = $($("div[id^='wrapper']")[0]).attr("id").substring(8);
    trimColumns();
    var data = JSON.stringify(getDataFromPage());
    var patches = getPatches(originalDocument, data);
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./validations",
        data: {action: "VALIDATION_EDITVALIDATIONS", LCMS_session: _cookie, contents: patches, validationid: validationid, oper: 'edit'},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (_data) {
        originalDocument = data;
        bootstrap_alert.warning('Validatie opgeslaan', 'success', 2000);
        console.log("Changes saved.");
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function trimColumns() {
    $.each(gridController.grids, function (index, item) {
        var colModel = item.colModel;
        var colNames = item.colNames;
        var colModelArray = [];
        var colNameArray = [];
        var c = 0;
        colModel = Object.filter(colModel, model => model.name !== "rn" & model.name !== "cb");
        $.each(colModel, function (i, j) {
            colModelArray[c] = colModel[i];
            colNameArray.push(j.name);
            c++;
        });
        item.colNames = colNameArray;
        item.colModel = colModelArray;
    });
}

function getDataFromPage() {
    var htmlData = $('<output>').append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"))));
    var gridData = {};
//    $("table[id^=grid]").each(function (a, b) {
//        try {
//            //set_multiselect($(b).attr('id'), false);
//
//        } catch (err) {
//        }
//    });
    gridController.checkGrids();
    $.each(gridController.grids, function (index, item) {
        item.colModel
        console.log(item);
    });
    htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
        $(b).after("<div name='" + $(b).attr('id') + "'></div>");
        $(b).remove();
    });
    var data = {};
    data['html'] = htmlData.prop("innerHTML");
    data['grids'] = gridController.grids;
    data['html'] = removeElements("nosave", data['html']);

    return data;
}

