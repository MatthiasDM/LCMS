/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function validations_getValidation(_parent, _id) {

    function onDone(data) {       
        buildDocumentPage(data, _parent);        
    }

    LCMSRequest("./validations", {action: "VALIDATION_GETVALIDATION", id: _id}, onDone);

}

