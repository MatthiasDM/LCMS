function validation_save() {
    console.log("validation_save()");
// PREPARE FORM DATA

    var htmlData = $('<output>').append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"))));


    //var htmlData = $($("div[id^='wrapper']")[0]).prop("outerHTML");

    var validationid = $($("div[id^='wrapper']")[0]).attr("id").substring(8);

    var gridData = {};
    $("table[id^=grid]").each(function (a, b) {
        try {
            gridData[$(b).attr('id')] = $(b).jqGrid('getGridParam');
            var legacyTable = buildHtmlTable($(b).jqGrid('getGridParam').data);
            var a = 1;
//            $(b).jqGrid('gridDestroy');
//            $(b).jqGrid('gridUnload');
//            $(b).remove();
        } catch (err) {
        }
    });
    //htmlData.find($("div[id^='wrapper']")).find($("div[id^=gbox_grid]"))

    htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
        $(b).after("<div name='" + $(b).attr('id') + "'></div>");
        $(b).remove();
    });

    var data = {};
    data['html'] = htmlData.prop("innerHTML");
    data['grids'] = gridData;
    data['html'] = removeElements("nosave", data['html']);

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./validations",
        data: {action: "VALIDATION_EDITVALIDATIONS", LCMS_session: _cookie, contents: JSON.stringify(data), validationid: validationid, oper: 'edit'},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        bootstrap_alert.warning('Validatie opgeslaan', 'success', 2000);
        console.log("Changes saved.")
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}