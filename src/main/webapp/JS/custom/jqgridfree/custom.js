/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function buildHtmlTable(json) {
    var table = $("<table></table>");
    var columns = addAllColumnHeaders(json, table);

    for (var i = 0; i < json.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = json[i][columns[colIndex]];
            if (cellValue === null)
                cellValue = "";
            if (typeof cellValue === "number" && String(cellValue).match(/\d{13}/g)) {
                cellValue = moment.unix(cellValue / 1000).format('d-M-Y H:m');
            }
            row$.append($("<td data-title='" + columns[colIndex] + "'/>").html(cellValue));
        }
        table.append(row$);
    }
    return table;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, table) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');

    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    table.append("<thead>" + headerTr$ + "</thead>");

    return columnSet;
}

function jqGridOptionsSimple() {
    var jqgridOptions = {
        data: JSON.parse(_data.table),
        datatype: "local",
        colModel: _colModel,
        colNames: cols,
        viewrecords: true, // show the current page, data rang and total records on the toolbar
        autowidth: true,
        autoheight: true,
        rownumbers: true,
        responsive: true,
        headertitles: true,
        guiStyle: "bootstrap4",
        //iconSet: "glyph",
        iconSet: "fontAwesome",
        searching: listGridFilterToolbarOptions,
        rowNum: 150,
        mtype: 'POST',
        altRows: true,
        editurl: _editUrl,
        loadonce: true,
        ondblClickRow: editRow,
        pager: _pagerName,
        caption: _caption,
        pgbuttons: false,
        pgtext: "",
        pginput: false

    };
    return jqgridOptions;
}

function popupEdit(_action, _tableObject, _parentObject, _editAction, _afterSubmitFunction) {
    var _tableObject = _tableObject;
    var parent = _parentObject;
    var grid = _tableObject;
    console.log("new item");

    grid.jqGrid('editGridRow', _action, {
        reloadAfterSubmit: false,
        afterShowForm: function (formid) {
            $("div[id^=editmod]").css('position', 'absolute');
            $("div[id^=editmod]").css('top', '5%');
            $("div[id^=editmod]").css('width', '90%');
            $("div[id^=editmod]").css('display', 'inline-block');
            $("div[id^=editmod]").css('margin-left', '5%');
            $("div[id^=editmod]").css('margin-right', '5%');
            $("div[id^=editmod]").css('left', '');

            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' '
                });
            });
            $("#created_on").val(moment().format('D-M-YY'));
            scrollTo($($("input")[0]));
        },
        beforeSubmit: function (postdata, formid) {
            $("textarea[title=ckedit]").each(function (index) {
                var editorname = $(this).attr('id');
                var editorinstance = CKEDITOR.instances[editorname];
                var text = editorinstance.getData();
                text = removeElements("nosave", text);
                postdata[editorname] = text;
            });
            console.log("Checking post data");
        },
        afterComplete: function (response, postdata, formid) {
            $("#cData").trigger("click");
            bootstrap_alert.warning('Rij toegevoegd', 'info', 1000);
            _afterSubmitFunction();

        },
        editData: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
    }

    );

}

function createDataAndModelFromCSV(val) {
    console.log("createDataAndModelFromCSV()");
    var importCSV = CSVToArray(val, ",");
    var colNames = new Array();
    var colModel = [];

    var data = new Array();
    var c = 0;
    importCSV.forEach(function split(a) {
        var line = a;
        var lineObject = {};
        line.forEach(function split(a, b) {
            var column = {};
            if (c < 1) {
                colNames.push(a);
                column.label = a;
                column.name = a;
                column.type = 'text';
                colModel.push(column);
            } else {
                lineObject[colNames[b]] = a;
            }
        });
        if (c > 0) {
            data.push(lineObject);
        }
        c++;
    });
    return {colModel: colModel, colNames: colNames, data: data};
}

function getValuesOfAttributeInList(_list, _attribute) {
    console.log("getValuesOfAttributeInList()");
    var distinctAttributes = {};
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _list) {
            var data = new Object();
            $(b).jqGrid("getGridParam").data.forEach(function (a, b) {
                distinctAttributes[a.id] = a[_attribute];
            });
            // distinctAttributes = filterUniqueJson($(b).jqGrid("getGridParam").data, _attribute);
        }
    });
    return distinctAttributes;
}

function getValuesOfAllAttributesInList(_list, _attribute) {
    var distinctAttributes = {};
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _list) {
            var data = new Object();
            $(b).jqGrid("getGridParam").data.forEach(function (a, b) {
                distinctAttributes[a.id] = a[_attribute];
            });
            // distinctAttributes = filterUniqueJson($(b).jqGrid("getGridParam").data, _attribute);
        }
    });
    return distinctAttributes;
}

function getJQGridParamByCaption(_name){
    var gridParam = {}; 
    console.log("getJQGridParamByCaption()");
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _name) {
            gridParam =  $(b).jqGrid("getGridParam");            
            return false;
        }
    });
    return gridParam;
}