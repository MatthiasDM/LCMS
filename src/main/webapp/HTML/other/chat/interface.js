/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var correspondent = {};
$(function () {
    console.log("Loading chat page");
    console.log(getUrlParameter('corr'));
    correspondent = JSON.parse(getUrlParameter('corr'));
    console.log(correspondent.firstName);
    chat_doLoad();

    $("#btn-send").on("click", function (e) {
        chat_message($("#txt-message").val());
    });

});

function addMessage(message) {    
    var messageItem = $("<div class='chatMessage'></div>");
    var header = $("<div class='messageHeader'><span class=''>" + message.timestamp + " " + message.correspondent + "</span></div>");
    messageItem.append(header);
    messageItem.append(message.message);
    $("#chat-history").append(messageItem);
}

function addHistory(history) {
    $.each(history, function (index, item) {
        addMessage(item);
    });
}


