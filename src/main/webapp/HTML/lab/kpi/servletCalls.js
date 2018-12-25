/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function kpi_hemolysis_doLoad(_parent) {
    console.log("kpi_hemolysis_doLoad()")
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_KPI_HEMOLYSIS", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {

        var jsonData = JSON.parse(data);
        var data = JSON.parse(jsonData.data);
        data.forEach(function lines(line, index) {


            line = line.replace(/[']/g, "\"");
            line = line.replace(/[<]/g, "");
            line = line.replace(/[>]/g, "");
            line = JSON.parse(line);
            data[index] = line;

        })
        loadPivotTable(data);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}