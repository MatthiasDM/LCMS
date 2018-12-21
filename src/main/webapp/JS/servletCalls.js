/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function page_doLoadPage(_page, parent) {
    var _cookie = $.cookie('LCMS_session');
    console.log("Loading page...");
    $.ajax({
        method: "POST",
        url: "./page",
        data: {page: _page, LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        //parent.append(data);

        var jsonData = JSON.parse(data, parent);
        jsonData.parent = parent;
        loadParameters(jsonData);

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
        sessionCountdown();
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function getUrlParam(url_string) {
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var p;
    if (isIE || isEdge) {
        p = parse_query_string(url_string);
        p = p[Object.keys(p)[0]]; // "a"
    } else {
        var url = new URL(url_string);
        p = url.searchParams.get("p");
    }
    if (typeof p == "undefined") {
        p = "";
    }
    if(p == "undefined"){
        p = "";        
    }

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