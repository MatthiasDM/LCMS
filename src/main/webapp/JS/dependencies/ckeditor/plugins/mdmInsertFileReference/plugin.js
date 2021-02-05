/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


CKEDITOR.plugins.add('mdmInsertFileReference',
{
    init: function (editor) {
        var pluginName = 'mdmInsertFileReference';
        editor.ui.addButton('Insert file link',
            {
                label: 'Insert link to file on LCMS',
                command: 'OpenWindow',
                icon: CKEDITOR.plugins.getPath('mdmInsertFileReference') + 'linkref.gif'
            });
        var cmd = editor.addCommand('fileRef', new CKEDITOR.dialogCommand( 'fileRefDialog' ));
    }
});
function showMyDialog(e) {
    window.open('/Default.aspx', 'MyWindow', 'width=800,height=700,scrollbars=no,scrolling=no,location=no,toolbar=no');
}