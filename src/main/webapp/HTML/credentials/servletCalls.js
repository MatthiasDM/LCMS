/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function login_doLogin(_parent, _username, _password) {
    console.log("Log in attempt");
    $.ajax({
        method: "POST",
        url: "./credentials",
        data: {action: "CREDENTIALS_LOGIN", username: _username, password: _password},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        location.reload();
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}



