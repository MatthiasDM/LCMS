/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function worksummary_doLoad(type) {
    console.log("worksummary load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_WORKSUMMARY", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {  
        var jsonData = JSON.parse(data);
        var data = JSON.parse(jsonData.data);
        data.forEach(function lines(line, index) {


            line = line.replace(/[']/g, "\"");
            line = JSON.parse(line);
            data[index] = line;

        })
        if(type === 'new'){
           parseData(data);  
            
        }
        if(type === 'refresh'){
            refreshData(data);            
        }
        
        setTimeout(function(){ worksummary_doLoad("refresh"); }, 100000);     
        setTimeout(function(){ bootstrap_alert.warning('Update in 5 sec.', 'info', 5000); }, 95000); 

        
       
        console.log(data);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}


function editSuggestion(action) {
    var _tableObject = $("#worksummary-table");
    var parent = $("#btn-edit-worksummary");
    var grid = _tableObject;
    console.log("new worksummary");

    grid.jqGrid('editGridRow', action, {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: parent.offset().left * -1 + $("body").width() * 0.05,
        top: parent.offset().top * -1 + 40,
        afterShowForm: function (formid) {
            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' '
                });
            });
            $("#created_on").val(moment().format('D-M-YY'));
        },
        beforeSubmit: function (postdata, formid) {
            $("textarea[title=ckedit]").each(function (index) {
                var editorname = $(this).attr('id');
                var editorinstance = CKEDITOR.instances[editorname];
                var text = editorinstance.getData();
                // CKEDITOR.instances[editorname].element.remove()
                postdata[editorname] = text;
            });
            console.log("Checking post data");
        },
        afterComplete: function (response, postdata, formid) {
            $("#cData").trigger("click");
            return [success, message, new_id];
        },
        editData: {action: "GENERAL_EDITSUGGESTION", LCMS_session: $.cookie('LCMS_session')}
    }

    );

}