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



function buildEditablePage(data, _parent) {
    console.log("buildDocumentPage()");
    config2();
    documentPage = new LCMSEditablePage({loadAction: "getpage", editAction: "editpages", editUrl: "./servlet", pageId: "", idName: "editablepageid"});
    documentPage.buildPageData(data, _parent);
    // documentPage.setPageId($($("div[id^='wrapper']")[0]).attr("id").substring(8));
}
