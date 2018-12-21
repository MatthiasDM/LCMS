/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    kpi_hemolysis_doLoad($("#kpi-container"));
})

function loadPivotTable(data) {
    console.log("loadPivotTable()");
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend($.pivotUtilities.renderers,
            $.pivotUtilities.plotly_renderers);
    $("#output").pivotUI(data, {
        renderers: renderers
    });

}