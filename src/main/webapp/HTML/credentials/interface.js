/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {

    //check password for admin
//StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
//String encryptedPassword = passwordEncryptor.encryptPassword(userPassword);

    $("#form-signin").submit(function (event) {
        event.preventDefault();
        var username = $("input[id=singin-username]").val();
        var password = $("input[id=singin-password]").val();
        login_doLogin($("#container-login"), username, password);
    });

});



