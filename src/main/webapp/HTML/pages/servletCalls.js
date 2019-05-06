/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function editablePage_getPage(_parent) {
    console.log("editablePage_getPage()");
    function onDone(data) {
        buildEditablePage(data, _parent);
    }
    var _v = getUrlParam(window.location.href, "v");
    var _k = getUrlParam(window.location.href, "k");
    if (_v === "" || _k === "") {
        LCMSRequest("./servlet", {action: "getpage", k: "title", v: "home"}, onDone);
    } else {
        LCMSRequest("./servlet", {action: "getpage", k: _k, v: _v}, onDone);
    }


}

