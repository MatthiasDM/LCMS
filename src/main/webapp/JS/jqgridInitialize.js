/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {

    initDateEdit = function (elem) {
        $(elem).datepicker({
            dateFormat: "d-m-y",
            autoSize: true,
            changeYear: true,
            changeMonth: true,
            showButtonPanel: true,
            showWeek: true
        });
    };
    initDateSearch = function (elem) {
        setTimeout(function () {
            initDateEdit(elem);
        }, 100);
    };

});

function populateTable(_data, _editAction, _editUrl, _tableObject, _pagerName, _parent, _caption, _extraOptions) {
    var _colModel = generateView2(_data);
    var cols = new Array();
    $.each(JSON.parse(_data.header), function (index, value) {

        if (typeof value.tablename != 'undefined') {
            var _name = lang[value.tablename][value.name];
            if (_name != null) {
                cols.push(_name);
            } else {
                cols.push(value.name);
            }
        } else {
            cols.push(value.name);

        }

    });



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
        iconSet: "fontAwesome",
        guiStyle: "bootstrap",
        searching: {
            defaultSearch: "cn"
        },
        rowNum: 50,
        mtype: 'POST',
        editurl: _editUrl,
        loadonce: true,
        ondblClickRow: editRow,
        pager: _pagerName,
        caption: _caption

    };


    $.each(_extraOptions, function (i, n) {
        jqgridOptions[i] = n;
    });

    _tableObject.jqGrid(jqgridOptions);

    var lastSelection;

    function editRow(id) {
        if (id && id !== lastSelection) {
            var grid = _tableObject;
            grid.jqGrid('restoreRow', lastSelection);
            var editParameters = {
                keys: true,
                extraparam: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
            };
            grid.jqGrid('editRow', id, editParameters);
            lastSelection = id;
        }
    }
    ;

    var addDataOptions = {editData: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}};
    var navGridParameters = {add: true, edit: false, del: false, save: false, cancel: false, addParams: {position: "last", addRowParams: {
                keys: true,
                oneditfunc: function (grid) {
                    //grid.jqGrid('editGridRow', 'add', {})
                },
                extraparam: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
            }}};
    _tableObject.inlineNav(_pagerName, navGridParameters, {}, addDataOptions);
    _tableObject.jqGrid("filterToolbar");
    $(window).bind('resize', function () {
        _tableObject.setGridWidth(_parent.width() - 10);
    }).trigger('resize');

    _tableObject.click(function (e) {
        var $groupHeader = $(e.target).closest("tr.jqgroup");
        if ($groupHeader.length > 0) {
            $(this).jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
        }
    });



    function generateView2(data) {
        var cols = new Array();
        var view = [];
        $.each(JSON.parse(data.header), function (index, value) {
            var column = {};
            column.label = value.name;
            column.name = value.name;
            //column.editable = true;

            if (value.type === "date") {
                column.formatoptions = {srcformat: "u1000", newformat: "d-m-y"};
                column.formatter = "date";
                column.sorttype = "date";
                column.editoptions = {dataInit: initDateEdit};
            }
            if (value.type === "text") {
                column.edittype = "textarea";
            }
            if (value.type === "cktext") {
                column.edittype = "textarea";
                column.editoptions = {title: "ckedit"};
            }
            if (value.type === "boolean") {
                column.template = "booleanCheckbox";
            }
            if (value.type === "select") {
                column.edittype = "select";
                column.formatter = "select";
                column.width = "200";
                if (value.choices.constructor.name === "String") {
                    value.choices = JSON.parse(value.choices);
                }
                column.editoptions = {multiple: value.multiple, value: (value.choices)};
            }
            if (value.type === "password") {
                column.edittype = "password";
            }
            if (value.visibleOnTable === false) {
                column.hidden = true;
            }
            if (value.editable === false) {
                column.editable = false;
            } else {
                column.editable = true;
            }
            if (value.visibleOnForm === true) {
                column.editrules = {edithidden: true};
            }



            view.push(column);

        });

        console.log("Generating view");
        return view;
    }




}
