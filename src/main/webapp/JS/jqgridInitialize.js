/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var numberTemplate = {
    align: 'center',
    sorttype: 'number',
    searchoptions: {
        sopt: ['ge', 'gt', 'eq', 'lt', 'le']
    }
}, listGridFilterToolbarOptions = {
    searchOnEnter: true,
    stringResult: true,
    multipleSearch: true,
    searchOperators: true
};

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
    $.jgrid.defaults.responsive = true;
    $.jgrid.defaults.guiStyle = 'bootstrap4';
});
function populateTable(_data, _editAction, _editUrl, _tableObject, _pagerName, _parent, _caption, _extraOptions, _parameters) {
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
    var parameters = {
        editParameters: {
            keys: true,
            extraparam: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
        },
        addParameters: {editData: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}},
        navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
            addParams: {
                position: "last",
                addRowParams: {
                    keys: true,
                    extraparam: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
                }
            },
            editParams: {
                editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                    extraparam: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
                }
            }
        }
    };
    $.each(_extraOptions, function (i, n) {
        jqgridOptions[i] = n;
    });
    _tableObject.jqGrid(jqgridOptions);

    replaceProperties(parameters, _parameters);


    var lastSelection;
    function editRow(id) {
        if (id && id !== lastSelection) {
            var grid = _tableObject;
            grid.jqGrid('restoreRow', lastSelection);
            grid.jqGrid('editRow', id, parameters.editParameters);
            lastSelection = id;
        }
    }
//    $.each(_navGridParameters, function (i, n) {
//        parameters.navGridParameters[i] = n;
//
//    });

    function replaceProperties(original, obj) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object" & typeof original[property] == "object")
                    replaceProperties(original[property], obj[property]);
                else
                    original[property] = obj[property];
                //console.log(property + "   " + obj[property]);
            }
        }
    }
    _tableObject.inlineNav(_pagerName, parameters.navGridParameters);
    _tableObject.jqGrid("filterToolbar");
    $(window).bind('resize', function () {
        _tableObject.setGridWidth(_parent.width() - 10);
    }).trigger('resize');

    _tableObject.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {
        $(".ui-jqgrid-titlebar-close", this).click();
    });
    _tableObject.click(function (e) {
        gridClickFunctions(e, $(this))
    });

    return _tableObject;
}

function generateView2(data) {
    console.log("generateView2()");
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
        if (value.type === "number") {
            column.template = numberTemplate;
        }
        if (value.type === "datetime") {
            column.formatoptions = {srcformat: "u1000", newformat: "d-m-y h:i"};
            column.formatter = "date";
            column.sorttype = "date";
            column.editoptions = {dataInit: initDateEdit};
        }

        if (value.type === "text") {
            column.edittype = "text";
        }
        if (value.type === "cktext") {
            column.edittype = "textarea";
            column.editoptions = {title: "ckedit"};
        }
        if (value.type === "cktext_code") {
            column.edittype = "textarea";
            column.editoptions = {title: "ckedit_code"};
        }
        if (value.type === "boolean") {
            column.template = "booleanCheckbox";
        }

        if (value.type === "internal_list") {
            value.type = "select"
            column.editoptions = {title: "internal_list"};
            column.internalListName = value.internalListName;
            column.internalListAttribute = value.internalListAttribute;

        }
        if (value.type === "external_list") {
            value.type = "select"
            column.editoptions = {title: "external_list"};
        }
        if (value.type === "select") {
            column.edittype = "select";
            column.formatter = "select";
            column.width = "200";
            if (value.choices.constructor.name === "String") {
                value.choices = JSON.parse(value.choices);
            }
            if (typeof column.editoptions === "undefined") {
                column.editoptions = {};
            }
            column.editoptions.multiple = value.multiple;
            column.editoptions.value = (value.choices);
            if (value.multiple === true) {
                column.editoptions.size = value.choices.length < 19 ? value.choices.length + 2 : 20;
            }
        }
        if (value.type === "password") {
            column.edittype = "password";
        }
        if (value.key === true) {
            column.key = true;
        }
        if (value.visibleOnTable === false || value.hidden === true) {
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

        if (typeof value.summaryTpl !== "undefined") {
            column.summaryTpl = value.summaryTpl;
        }
        if (typeof value.summaryType !== "undefined") {
            column.summaryType = value.summaryType;
        }


        view.push(column);
    });
    console.log("Generating view");
    return view;
}

function gridClickFunctions(e, target) {
    console.log("gridClickFunctions()");
    var $groupHeader = $(e.target).closest("tr.jqgroup");
    if ($groupHeader.length > 0) {
        target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
        target.css('cursor', 'pointer');
    }

    $groupHeader = $(e.target).closest("span.tree-wrap");
    if ($groupHeader.length > 0) {
        target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
    }



// $subGridExpanded = $(e.target).closest("td.sgexpanded");

}