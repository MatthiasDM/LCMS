/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Object.filter = (obj, predicate) =>
    Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});


var lastSelection;
var originalDocument = "";
let documentPage = {};

$(function () {

    editablePage_getPage($("#content"));
    $(document).mouseup(function (e)
    {
        var container = $("#div-grid-wrapper");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });
});



