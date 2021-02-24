
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
                        var uuid = uuidv4();
                        var modalId = uuidv4();
                        var modalPopupButton = $("<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#" + modalId + "'>Rekenblad openen</button>");
                        var modal = $("<div id='" + modalId + "' class='modal fade' tabindex='-1' role='dialog' aria-hidden='true'>  <div class='modal-dialog modal-lg' role='document' style='max-width: 98%;'>    <div class='modal-content' style='height: 100%;'>      <div class='modal-header'>        <h5 class='modal-title'>Rekenblad</h5>        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>          <span aria-hidden='true'>×</span>        </button>      </div>      <div class='modal-body' id='" + modalId + "-body'>              </div>      <div class='modal-footer' contenteditable=false>        <button type='button' id='" + modalId + "-save' class='btn btn-primary no-change'>Save changes</button>        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>      </div>    </div>  </div></div>");
                        modal.find("div[id=" + modalId + "-body]").append("<div contenteditable='false' class='no-change' style='overflow-y:scroll' id='" + uuid + "'><div style='visibility:hidden;display: none;' contenteditable='false' id='luckysheetdata'></div><iframe frameborder='0' style='width:100%;height:800px;overflow-y:scroll' src='./JS/dependencies/ckeditor/plugins/luckysheet/template.html' name='" + uuid + "' id='" + uuid + "'></iframe></div>");
                        modalPopupButton.attr("onclick", "$('#" + modalId + "').modal('show')");

                        editor.insertHtml($("<div></div>").append(modalPopupButton).html() + $("<div></div>").append(modal).html() + "<br/>");
                        $('#' + uuid).iFrameResize();
                    }
                }));
            }
        }); 