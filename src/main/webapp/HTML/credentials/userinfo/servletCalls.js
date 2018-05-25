/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function login_doLogout() {
    
    console.log("Logging out");
     var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./credentials",
        data: {action: "CREDENTIALS_LOGOUT", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        location.reload();
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}
