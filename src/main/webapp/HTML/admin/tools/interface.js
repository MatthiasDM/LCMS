/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    apikeys_doLoad($("#apikeys-container"));
    users_doLoad($("#admin-container"));
    mongoconfigurations_doLoad($("#admin-container"));
    actions_doLoad($("#admin-container"));
    pages_doLoad($("#pages-container"));
    commands_doLoad($("#admin-container"));
    workflows_doLoad($("#workflow-container"));

});
