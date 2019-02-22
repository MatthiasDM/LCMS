/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function chat_doLoad() {
    console.log("chat_doLoad()");
    function onDone(data) {
        var message = {timestamp: moment().calendar(), correspondent: "Systeem", message: "Goeiedag, " + correspondent.firstName};
        if ($("#chat-history").val() === "") {
            if (typeof data === "undefined") {
                addMessage(message);
            } else {
                addMessage(message);
                addHistory(data.history);
            }
        } else {
            addMessage(message);
        }

    }
    LCMSRequest("./lab", {action: "LAB_GETCHAT", correspondent: correspondent}, onDone);
}

function chat_message(_message) {
    function onDone(data) {
        if (typeof data !== "undefined") {
            addMessage(JSON.parse(_message));
        }
    }
    LCMSRequest("./lab", {action: "LAB_SENDCHAT", correspondent: correspondent.loginName, message: _message, timestamp: moment().unix()}, onDone);
}
