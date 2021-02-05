/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


CKEDITOR.plugins.add('mdmUploadFiles',
        {
            init: function (editor) {
                var pluginName = 'mdmUploadFiles';
                CKEDITOR.dialog.add('uploadFileDialog', this.path + 'dialogs/uploadFileDialog.js');
                editor.ui.addButton('Upload',
                        {
                            label: 'Upload files to LCMS',
                            command: 'uploadFile',
                            icon: CKEDITOR.plugins.getPath('mdmUploadFiles') + 'upload.gif'
                        });
                editor.addCommand('uploadFile', new CKEDITOR.dialogCommand('uploadFileDialog'));



            }
        });
function showMyDialog(e) {
    window.open('/Default.aspx', 'MyWindow', 'width=800,height=700,scrollbars=no,scrolling=no,location=no,toolbar=no');
}