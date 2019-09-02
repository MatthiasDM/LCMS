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

    $("#btn-camera").on("click", function () {
        startScanner();
    });

});

function parseResult(result, codeReader) {

    codeReader.stopStreams();
    codeReader = null;
    $("#QR-modal").modal("hide");
    $("#QR-modal").remove();
    console.log(result);

    if (validURL(result.text)) {
        window.open(result.text, '_blank');
    }
}

function startScanner() {

    var m = create_blank_modal($("body"), "QR-modal", '<video autoplay="" height="300" id="video" muted="" playsinline="" width="400">&nbsp;</video>', "top:30%;");
    m.modal('show');

    var codeReader = new ZXing.BrowserQRCodeReader();
    codeReader
            .listVideoInputDevices()
            .then(function (videoInputDevices) {
                console.log(videoInputDevices.length + "found");
            }).catch(err => console.error(err));

    codeReader
            .decodeFromInputVideoDevice(undefined, 'video')
            .then(function (result) {
                parseResult(result, codeReader);
            }).catch(err => console.error(err));
}

