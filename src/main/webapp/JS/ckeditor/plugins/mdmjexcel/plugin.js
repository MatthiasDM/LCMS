
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


//                        data = [
//                            ['Google', 1998, 807.80],
//                            ['Apple', 1976, 116.52],
//                            ['Yahoo', 1994, 38.66],
//                        ];
                        //editor.insertHtml("<table id='jexcel'></table>");
                        //$('iframe').contents().find('table').jexcel({data: data, colWidths: [300, 80, 100]});


                        $('iframe.cke_wysiwyg_frame').contents().find("body").append("<div style='visibility:hidden' id='jexceldata'></div>");
                        console.log("adding jexcel...");
                        //$('<script>').html(script))                    
                        editor.insertHtml("<iframe frameborder='0' style='width:100%' src='./JS/ckeditor/plugins/mdmjexcel/template.html' id='testiframe'></iframe>");
                        $('iframe').contents().find('#testiframe').iFrameResize();

                        var data = $('iframe.cke_wysiwyg_frame', parent.document).contents().find('#testiframe').contents().find("#jexceltable").jexcel('getData');
                        console.log(data);
                        $('iframe.cke_wysiwyg_frame', parent.document).contents().find("#jexceldata").append(data);

                        //  $('iframe').contents().find("#jexceldata").append($('iframe').contents().find('#testiframe').contents().find("#jexcel").jexcel('getData'));
                        //$("#jexceldata").

                    }
                }));



            }
        });