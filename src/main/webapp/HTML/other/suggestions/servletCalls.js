/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function suggestions_doLoad() {
    console.log("suggestions load");
    var jqGridOptions = {
        grouping: false,
        groupingView: {
            groupField: ['status', 'category'],
            groupColumnShow: [true, false],
            groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
            groupCollapse: true
        },
        onSelectRow: function (rowid) {
            return popupEdit(rowid, $("#suggestions-table"), $("#div-grid-wrapper"), "editsuggestions");
        }
    };
    LCMSTableRequest("loadsuggestions", "editsuggestions", "./servlet", "suggestions-table", "suggestions-pager",
            "div-grid-wrapper", lang["suggestions"]['title'], 2, jqGridOptions);
}
//
//function suggestions_doLoad(_parent) {
//    console.log("suggestions load");
//    var _cookie = $.cookie('LCMS_session');
//    $.ajax({
//        method: "POST",
//        url: "./lab",
//        data: {action: "GENERAL_LOADSUGGESTION", LCMS_session: _cookie},
//        beforeSend: function (xhr) {
//            xhr.overrideMimeType("application/html");
//        }
//    }).done(function (data) {
//        var jsonData = JSON.parse(data);
//        console.log(jsonData.webPage);
//        if (typeof jsonData.webPage !== 'undefined') {
//            jsonData.parent = _parent;
//            loadParameters(jsonData);
//        } else {
//            var extraOptions = {
//                grouping: true,
//                groupingView: {
//                    groupField: ['category'],
//                    groupColumnShow: [false],
//                    groupText: ['<b>{0} - {1} Item(s)</b>'],
//                    groupCollapse: true,
//                }};
//            extraOptions.onSelectRow = editSuggestion;
//            var navGridParameters = {
//                add: false
//            }
//            populateTable(jsonData, "GENERAL_EDITSUGGESTION", './lab', $("#suggestions-table"), "#suggestions-pager", $("#div-grid-wrapper"), lang.suggestions["title"], extraOptions, navGridParameters);//"Algemene idëeen of opmerkingen over het laboratorium en de werking ervan.", {});
//        }
//    }).fail(function (data) {
//        alert("Sorry. Server unavailable. ");
//    });
//}
//
//
//function editSuggestion(action) {
//    var _tableObject = $("#suggestions-table");
//    var parent = $("#btn-edit-suggestions");
//    var grid = _tableObject;
//    console.log("new suggestions");
//
//    grid.jqGrid('editGridRow', action, {
//        reloadAfterSubmit: false,
//        width: $("body").width() * 0.9,
//        left: parent.offset().left * -1 + $("body").width() * 0.05,
//        top: parent.offset().top * -1 + 40,
//        afterShowForm: function (formid) {
//            $("textarea[title=ckedit]").each(function (index) {
//                CKEDITOR.replace($(this).attr('id'), {
//                    customConfig: ' '
//                });
//            });
//            $("#created_on").val(moment().format('D-M-YY'));
//        },
//        beforeSubmit: function (postdata, formid) {
//            $("textarea[title=ckedit]").each(function (index) {
//                var editorname = $(this).attr('id');
//                var editorinstance = CKEDITOR.instances[editorname];
//                var text = editorinstance.getData();
//                // CKEDITOR.instances[editorname].element.remove()
//                postdata[editorname] = text;
//            });
//            console.log("Checking post data");
//        },
//        afterComplete: function (response, postdata, formid) {
//            $("#cData").trigger("click");
//            return [success, message, new_id];
//        },
//        editData: {action: "GENERAL_EDITSUGGESTION", LCMS_session: $.cookie('LCMS_session')}
//    }
//
//    );
//
//}