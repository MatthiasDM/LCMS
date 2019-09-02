/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {

    //check password for admin
//StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
//String encryptedPassword = passwordEncryptor.encryptPassword(userPassword);
    /*  $("#form-new-object").submit(function (event) {
     event.preventDefault();
     admin_newObject(JSON.stringify($(this).serializeObject()));
     });
     $("#form-new-user").submit(function (event) {
     event.preventDefault();
     admin_newUser(JSON.stringify($(this).serializeObject()));
     });*/


    // objects_doLoad($("#admin-container"));

    users_doLoad($("#admin-container"));
    mongoconfigurations_doLoad($("#admin-container"));
    actions_doLoad($("#admin-container"));
    pages_doLoad($("#pages-container"));
    commands_doLoad($("#admin-container"));
});
