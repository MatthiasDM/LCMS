/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function tasks_doLoad(_parent) {
    console.log("tasks load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./tasks",
        data: {action: "TASKS_LOADTASKS", LCMS_session: _cookie},
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
            populateTable(jsonData, "TASKS_EDITTASKS", './lab', $("#tasks-table"), "#tasks-pager", $("#div-grid-wrapper"), "De verschillende producten in het labo.", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}