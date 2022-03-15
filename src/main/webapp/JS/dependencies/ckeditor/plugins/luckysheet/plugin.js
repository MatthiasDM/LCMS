
CKEDITOR.plugins.add('luckysheet',
        {
            init: function (editor) {
                var pluginName = 'luckysheet';

                editor.ui.addButton('Add',
                        {
                            label: 'Add Jexcel element',
                            command: 'addluckysheet',
                            icon: CKEDITOR.plugins.getPath('luckysheet') + 'jexcel.gif'
                        });
                editor.addCommand('addluckysheet', new CKEDITOR.command(editor, {
                    exec: function (editor) {
                        console.log("adding luckysheet...");
                 
                        var modalId = uuidv4();
                        function showLuckysheetModal(modalId) {
                            //var uuid = uuidv4();
                            var luckysheetData = $("<div contenteditable='false' class='no-change' style='overflow-y:scroll' id='" + modalId + "'><iframe frameborder='0' style='width:100%;height:800px;overflow-y:scroll' src='./JS/dependencies/ckeditor/plugins/luckysheet/template.html' name='" + modalId + "' id='" + modalId + "'></iframe></div>");
                            var modalBody = gcmscore.createModal('Rekenblad', $('#admin-container'));
                            modalBody.attr("id", modalId);
                            var modalContent = $("<div></div>");
                            modalContent.append(luckysheetData);
                            var saveButton = $("<button type='button' id='save' class='btn btn-primary'>Opslaan</button>");
                            modalContent.append(luckysheetData);
                            modalContent.append(saveButton);
                            modalBody.html(modalContent)
                        }               
                        var modalPopupButton = $("<button type='button' id='luckysheet-"+modalId+"' class='btn btn-primary'>Rekenblad openen</button>");
                   


                        //modal.find("div[id=" + modalId + "-body]").append("<div contenteditable='false' class='no-change' style='overflow-y:scroll' id='" + uuid + "'><div style='visibility:hidden;display: none;' contenteditable='false' id='luckysheetdata'></div><iframe frameborder='0' style='width:100%;height:800px;overflow-y:scroll' src='./JS/dependencies/ckeditor/plugins/luckysheet/template.html' name='" + uuid + "' id='" + uuid + "'></iframe></div>");
                        //modalPopupButton.attr("onclick", "$('#" + modalId + "').modal('show')");
                        //editor.insertHtml("<script>" + showLuckysheetModal.toString() + "</script>");
                        editor.insertHtml($("<div></div>").append(modalPopupButton).html() + "<br/>");
                        $("#luckysheet-"+modalId).attr("onclick", showLuckysheetModal.toString() + ";showLuckysheetModal('"+modalId+"');");
                      //  $('#' + uuid).iFrameResize();
                    }
                }));
            }
        }); 