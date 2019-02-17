function validation_save() {
    console.log("validation_save()");
// PREPARE FORM DATA
    var validationid = $($("div[id^='wrapper']")[0]).attr("id").substring(8);
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

function getDataFromPage() {
    var htmlData = $('<output>').append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"))));
    var gridData = {};
    $("table[id^=grid]").each(function (a, b) {
        try {
//            var keys = Object.keys(Object.filter($(b).jqGrid('getGridParam').colModel, item => item.name === "cb"));
//            if($(b).jqGrid('getGridParam').colModel[keys[0]].hidden){
//                
//            }
//            if (!$(b).jqGrid('getGridParam').colModel[keys[0]].hidden) {                
//                toggle_multiselect($(b).attr('id'));
//                $('#' + $(b).attr('id')).jqGrid("setGridParam", {multiselect: false});
//            } else {
//                set_multiselect($(b).attr('id'), false);
//            }
            set_multiselect($(b).attr('id'), false);
            gridData[$(b).attr('id')] = $(b).jqGrid('getGridParam');
        } catch (err) {
        }
    });
    htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
        $(b).after("<div name='" + $(b).attr('id') + "'></div>");
        $(b).remove();
    });
    var data = {};
    data['html'] = htmlData.prop("innerHTML");
    data['grids'] = gridData;
    data['html'] = removeElements("nosave", data['html']);

    return data;
}

