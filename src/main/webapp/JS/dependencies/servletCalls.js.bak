/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function page_doLoadPage(_page, parent) {

    $.ajax({
        method: "POST",
        url: "./page",
        data: {page: _page},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        parent.append(data);
        setJumbo(_page);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function credentials_doUserInfo(_parent) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./credentials",
        data: {action: "CREDENTIALS_USERINFO", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data, _parent);
        jsonData.parent = _parent;
        loadParameters(jsonData);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function getUrlParam(url_string) {
    var url = new URL(url_string);
    var p = url.searchParams.get("p");
    return p;
}

//function doLoginCheck() {
//
//    $.ajax({
//        method: "POST",
//        url: "./page",
//        data: {session: _session},
//        beforeSend: function (xhr) {
//            xhr.overrideMimeType("application/html");
//        }
//    }).done(function (data) {
//        parent.append(data);
//        
//    }).fail(function (data) {
//        alert("Sorry. Server unavailable. ");
//    });
//
//}