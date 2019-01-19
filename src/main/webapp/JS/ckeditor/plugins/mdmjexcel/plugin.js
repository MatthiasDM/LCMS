
CKEDITOR.plugins.add('mdmjexcel',
        {
            init: function (editor) {
                var pluginName = 'mdmjexcel';

                editor.ui.addButton('Add',
                        {
                            label: 'Add Jexcel element',
                            command: 'addJexcel',
                            icon: CKEDITOR.plugins.getPath('mdmjexcel') + 'jexcel.gif'
                        });
                editor.addCommand('addJexcel', new CKEDITOR.command(editor, {
                    exec: function (editor) {

                        $('iframe.cke_wysiwyg_frame').contents().find("body").append("<div style='visibility:hidden' id='jexceldata'></div>");
                        console.log("adding jexcel...");
                        //$('<script>').html(script))                    
                        editor.insertHtml("<iframe frameborder='0' style='width:100%' src='./JS/ckeditor/plugins/mdmjexcel/template.html' id='testiframe'></iframe>");
//                        var data = $('iframe.cke_wysiwyg_frame', parent.document).contents().find('#testiframe').contents().find("#jexceltable").jexcel('getData');
//                        console.log(data);
//                        $('iframe.cke_wysiwyg_frame', parent.document).contents().find("#jexceldata").append(data);
                        $('#testiframe').iFrameResize();


                    }
                }));



            }
        });