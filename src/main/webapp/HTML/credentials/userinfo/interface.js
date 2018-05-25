/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {

    //check password for admin
//StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
//String encryptedPassword = passwordEncryptor.encryptPassword(userPassword);

    $("#form-logout").submit(function (event) {
        event.preventDefault();
        login_doLogout($("#container-login"));
    });

});


