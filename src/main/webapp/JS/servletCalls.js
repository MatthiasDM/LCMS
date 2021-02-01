/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function page_doLoadPage(_page, parent) {
    function onDone(data) {
        var jsonData = JSON.parse(data, parent);
        jsonData.parent = parent;
        loadParameters(jsonData);
        setJumbo(_page);
        setEnviroment(jsonData.parameters['software-version']);
    }
    LCMSRequest("./page", {page: _page}, onDone);

}

async function credentials_doUserInfo(_parent){

    async function onDone(data) {
        try { 
            var jsonData = JSON.parse(data, _parent);
        jsonData.parent = _parent;
        loadParameters(jsonData);
        sessionCountdown();
        } catch (e) {
            console.log(e);
            return {};
        }


    }
    var requestOptions = {};
    requestOptions.action = "docommand";
    requestOptions.k = "doUserInfo";
    let request = await LCMSRequest("./servlet", requestOptions);
    let returnvalue = await onDone(request);
    return returnvalue;



}


function getUrlParam(url_string, param) {
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var p;
    if (isIE || isEdge) {
        p = parse_query_string(url_string);
        p = p[Object.keys(p)[0]]; // "a"
    } else {
        var url = new URL(url_string);
        p = url.searchParams.get(param);
    }
    if (typeof p === "undefined") {
        p = "";
    }
    if (p === "undefined") {
        p = "";
    }
    if(p === null){
        p = "";
    }
    return p;

}

//function downloadToTemp(file) {
//    var formData = new FormData();
//    formData.append('action', 'FILE_DOWNLOADTEMP');
//    formData.append('LCMS_session', $.cookie('LCMS_session'));
//    formData.append('filename', file.attr("name"));
//    var request = new XMLHttpRequest();
//    request.onreadystatechange = function () {
//        if (request.readyState == 4) {
//            var jsonData = JSON.parse(request.responseText);
//            var filePath = jsonData.filePath;
//            console.log("Changing filepath from " + file.attr("src") + " to " + filePath);
//            file.attr("src", filePath);
//            return file;
//
//        }
//    }
//    request.open('POST', "./upload", /* async = */ false);
//    request.send(formData);   
//}


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