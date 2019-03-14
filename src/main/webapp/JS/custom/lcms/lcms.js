/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function filterAttributeJson(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];


    Object.keys(data).forEach(function (val) {
        var key = data[val][filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }
    });

    return result;
}

function filterUniqueJson(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];


    Object.keys(data).forEach(function (val) {
        var key = data[val][filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }
    })

    return result;
}

function filterUnique(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];

    for (var item, i = 0; item = items[i++]; ) {

        //$.each((item), function (key, value) {
        var key = item[filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }

    }
    return result;
}

function scrollTo(target) {
    //var target = editorContents.contents().find(this.getAttribute('anchor'));
    if (target.length) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top - 80
        }, 500);
    }
}

function CSVToArray(strData, strDelimiter) {
    console.log("CSVToArray()");
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
            (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    // Standard fields.
                    "([^\"\\" + strDelimiter + "(\\r\\n|\\r)]*))"
                    ),
            "gi"
            );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                    );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push(strMatchedValue);
    }

    // Return the parsed data.
    return(arrData);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }

    }

}

class LCMSgridController {
    constructor() {
        this.grids = {};
        this.references = [];
        this.views = [];
    }
    checkGrids() {
        var me = this;
        me.references = [];
        $("table[id^=grid]").each(function (a, b) {
            try {
                me.grids[$(b).attr('id')] = $(b).jqGrid('getGridParam');
                me.grids[$(b).attr('id')].colModel.forEach(function (column) {
                    if (typeof column.editoptions !== "undefined") {
                        if (column.editoptions.title === "internal_list") {
                            var referenceJson = {
                                "list": $(b).attr('id'),
                                "attr": column.name,
                                "refList": column.internalListName,
                                "refAttr": column.internalListAttribute
                            };
                            me.references.push(referenceJson);
                        }
                    }
                });


            } catch (err) {
                console.log(err);
            }
        });

        $.each(Object.filter(me.grids, grid => typeof grid.subgridref !== "undefined"), function (a, b) {
            me.checkSubGridValidity(b.id);

        });



        //console.log(this.references);


        setTimeout(function () {
            me.checkGrids();
            me.updateReferences();
        }, 10000);
    }

    updateReferences() {
        var me = this;
        $.each(me.references, function (a, b) {
            //console.log(b);
            var column = Object.filter(me.grids[b.list].colModel, model => model.name === b.attr);
            var newValues = getValuesOfAttributeInList(b.refList, b.refAttr);
            var newValuesAllAtrributes = getValuesOfAttributeInList(b.refList, b.refAttr);
            var oldValues = Object.values(column)[0].editoptions.value;
            if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
                console.log("Updating references... ");
                Object.values(column)[0].editoptions.value = newValues;
                $("#" + b.list).jqGrid("getGridParam").colModel[Object.keys(column)[0]].editoptions.value = newValues;//Object.values(column)[0];
                $("#" + b.list).trigger("reloadGrid");
            }







        });

    }

    checkSubGridValidity(gridId) {
        console.log("checkSubGridValidity()");
        var me = this;
        var grid = $("#" + gridId);
        var subGridCells = $("td.sgcollapsed", grid[0]);
        var change = false;
        if (typeof me.grids[grid.attr('id')].subGridHasSubGridValidation !== "undefined") {
            $.each(subGridCells, function (i, value) {

                var htmlValue = $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).html();
                if (!me.grids[grid.attr('id')].subGridHasSubGridValidation(value.parentNode.id, me.grids[grid.attr('id')].subgridref)) {
                    $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).unbind('click').html('');
                } else {
                    $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).bind('click').html("<div class='sgbutton-div'><a role='button' class='btn btn-xs sgbutton'><span class='fa fa-fw fa-plus'></span></a></div>");
                }
                if (htmlValue !== $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).html()) {
                    change = true;
                }
            });
        }
        if (change) {
            // grid.trigger("reloadGrid");
        }




    }
}

class LCMSSidebarPage {
    constructor(pageData, gridData) {
        this.pageData = pageData;
        this.gridData = gridData;
    }
    loadFromServer() {
        var gridData = this.gridData;
        console.log(gridData.editUrl + ": getting data from server...");
        function onDone(data) {
            var jsonData = JSON.parse(data);
            gridData.data = jsonData;
            let grid = new LCMSGrid(gridData);
            grid.createGrid();
            grid.addGridButton("fa-plus", "Nieuw item", "", function () {
                return popupEdit('new', $("#" + gridData.tableObject), $(this), gridData.editAction, {});
            });
            grid.addGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
                var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
                if (rowid !== null) {
                    return popupEdit(rowid, $("#" + gridData.tableObject), $(this), gridData.editAction);
                } else {
                    return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
                }
            });
        }
        LCMSRequest(gridData.editUrl, {action: gridData.loadAction}, onDone);
    }

    createPage() {
        var _this = this;
        var pageData = _this.pageData;
        var wrapper = $("<div></div>");
        var sidebarLeft = dom_div("", this.pageData.sidebarLeft);
        var sidebarLeftList = dom_list(this.pageData.sidebarLeftList, []);
        var sidebarRight = dom_div("", this.pageData.sidebarRight);
        var sidebarRightTable = $("<table id='" + this.pageData.sidebarRightTable + "'></table>");
        var sidebarRightTablePager = dom_div("", this.pageData.sidebarRightTablePager);
        var mainPageContainer = dom_mainPageContainer(this.pageData.containerID, this.pageData.mainPageContentDivId);

        sidebarLeft.append(sidebarLeftList);
        sidebarRight.append(sidebarRightTable);
        sidebarRight.append(sidebarRightTablePager);

        wrapper.append(sidebarLeft);
        wrapper.append(sidebarRight);
        wrapper.append(mainPageContainer);

        $(function () {
            sidebarLeft.BootSideMenu({side: "left"});
            sidebarRight.BootSideMenu({side: "right"});
            sidebarRight.BootSideMenu.open();
            _this.loadFromServer();
            pageData.ckConfig();
        });
        return wrapper;
    }

}

class LCMSGrid {
    /*
     * gridData
     * *****************************
     *  var gridData = {
     data: object,
     editAction: "string",
     editUrl: "string",
     tableObject: "string", --> change to tableID
     pagerID: "string",
     wrapperObject: object
     jqGridOptions: { //example options
     grouping: true,
     groupingView: {
     groupField: ['status', 'category'],
     groupColumnShow: [false, false],
     groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
     groupCollapse: true
     },
     onSelectRow: function (rowid) {
     return popupEdit(rowid, tableObject, _parent, "editActionString");
     },
     caption: "this is a caption"
     },
     jqGridParameters: {
     navGridParameters: {add: false}
     }
     gridCONTROLLER
     */



    constructor(gridData) {
        this.gridData = gridData;
    }

    addGridButton(icon, title, caption, onClickFunction) {
        var gridData = this.gridData;
        $("#" + gridData.tableObject).navButtonAdd("#" + gridData.pagerID, {
            caption: caption,
            title: title,
            buttonicon: icon,
            onClickButton: function () {
                onClickFunction();
            },
            position: "last"
        });
    }

    createColModel(_data) {
        console.log("createColModel()");
        var cols = new Array();
        var view = [];
        $.each(_data, function (index, value) {
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
                column.editoptions = {dataInit: initDateTimeEdit};
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
                value.type = "select";
                column.editoptions = {title: "internal_list"};
                column.internalListName = value.internalListName;
                column.internalListAttribute = value.internalListAttribute;

            }
            if (value.type === "external_list") {
                value.type = "select";
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
                    column.editoptions.size = value.choices.length < 8 ? value.choices.length + 2 : 10;
                }
            }
            if (value.type === "password") {
                column.edittype = "password";
            }
            if (value.key === true) {
                column.key = true;
            }
            if (value.visibleOnTable === false) {
                column.hidden = true;
            }
            if (value.hidden === true) {
                column.hidden = true;
            }
            if (value.editable === false) {
                column.editable = false;
            } else {
                column.editable = true;
            }
            if (value.visibleOnForm === true) {
                column.editrules = {edithidden: true};
            } else {
                column.editrules = {edithidden: false};
            }

            if (typeof value.summaryTpl !== "undefined") {
                column.summaryTpl = value.summaryTpl;
            }
            if (typeof value.summaryType !== "undefined") {
                column.summaryType = value.summaryType;
            }

            if (typeof value.width !== 'undefined' && typeof value.lso === "undefined") {
                column.width = value.width;
            }

            view.push(column);
        });
        console.log("Generating view");
        return view;
    }

    createGrid() {
        console.log("createGrid()");
        var gridData = this.gridData;
        var colModelData = {};
        var tabelData = {};
        if (typeof this.gridData.data.header === "string") {
            colModelData = JSON.parse(this.gridData.data.header);
        } else {
            colModelData = this.gridData.data.header;
        }
        if (typeof this.gridData.data.table === "string") {
            tabelData = JSON.parse(this.gridData.data.table);
        } else {
            tabelData = this.gridData.data.table;
        }

        var _colModel = this.createColModel(colModelData);
        var cols = new Array();
        $.each(colModelData, function (index, value) {
            if (typeof value.tablename !== 'undefined') {
                var _name = lang[value.tablename][value.name];
                if (typeof _name !== "undefined") {
                    cols.push(_name);
                } else {
                    cols.push(value.name);
                }
            } else {
                cols.push(value.name);
            }
        });

        var jqgridOptions = {
            data: tabelData,
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
            editurl: gridData.editUrl,
            loadonce: true,
            ondblClickRow: editRow,
            pager: "#" + gridData.pagerID,
            caption: "",
            pgbuttons: false,
            pgtext: "",
            pginput: false

        };

        var parameters = {
            navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
                addParams: {
                    position: "last",
                    addRowParams: {
                        keys: true,
                        extraparam: {oper: 'add', action: gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
                    }
                },
                editParams: {
                    editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                        extraparam: {action: gridData.editAction, LCMS_session: $.cookie('LCMS_session')},

                    }
                }
            }
        };

        if (typeof gridData.jqGridOptions.summaries !== "undefined") {
            jqgridOptions.summaries = gridData.jqGridOptions.summaries;
            jqgridOptions.footerrow = true;
            jqgridOptions.userDataOnFooter = true;
            jqgridOptions.loadComplete = function () {
                var sumJson = {};
                var grid = $(this);
                gridData.jqGridOptions.summaries.forEach(function (a) {
                    sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
                });
                $(this).jqGrid("footerData", "set", sumJson);

            };
        }

        if (typeof gridData.jqGridOptions.groups !== "undefined") {

            jqgridOptions.grouping = true;
            jqgridOptions.groupingView = {
                groupField: gridData.jqGridOptions.groups,
                //groupColumnShow: [false, false],
                groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
                groupCollapse: true,
                groupSummaryPos: ["header", "header"],
                groupSummary: [true, true]
            };
        } else {
            jqgridOptions.grouping = false;
        }
        if (typeof gridData.jqGridOptions.subgrid !== "undefined") {
            jqgridOptions.subGrid = true;
            if (typeof gridData.jqGridOptions.subGridOptions !== "undefined") {
                jqgridOptions.subGridOptions = {
                    hasSubgrid: function (options) {
                        return true;
                    }
                };
            }

            if (typeof gridData.jqGridOptions.subGridRowExpanded !== "undefined") {
                jqgridOptions.subGridRowExpanded = function (subgridDivId, rowId) {
                    var subgridTableId = subgridDivId + "_t";
                    $("[id='" + subgridDivId + "']").html("<table id='" + subgridTableId + "'></table>");
                    $("[id='" + subgridTableId + "']").jqGrid({
                        datatype: 'local',
                        data: [],
                        colNames: gridData.jqGridOptions.subgridref.colNames,
                        colModel: gridData.jqGridOptions.subgridref.colModel,
                        gridview: true,
                        rownumbers: true,
                        autoencode: true,
                        responsive: true,
                        headertitles: true,
                        iconSet: "fontAwesome",
                        guiStyle: "bootstrap4"
                    });
                };
            }


        }

        $.each(gridData.jqGridOptions, function (i, n) {
            jqgridOptions[i] = n;
        });

        jqgridOptions.loadComplete = function () {
            var grid = $(this);
            var subGridCells = $("td.sgcollapsed", grid[0]);
            if (typeof jqgridOptions.subGridHasSubGridValidation !== "undefined") {
                $.each(subGridCells, function (i, value) {
                    if (!jqgridOptions.subGridHasSubGridValidation(value.parentNode.id, jqgridOptions.subgridref)) {
                        $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).unbind('click').html('');
                    }
                });
            }

        };

        $("#" + gridData.tableObject).jqGrid(jqgridOptions);

        replaceProperties(parameters, gridData.jqGridParameters);



        var lastSelection;
        function editRow(id) {
            if (id && id !== lastSelection) {
                var grid = $("#" + gridData.tableObject);
                grid.jqGrid('restoreRow', lastSelection);
                grid.jqGrid('editRow', id, parameters.editParameters);
                lastSelection = id;
            }
        }

        function replaceProperties(original, obj) {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] === "object" & typeof original[property] === "object")
                        replaceProperties(original[property], obj[property]);
                    else
                        original[property] = obj[property];
                    //console.log(property + "   " + obj[property]);
                }
            }
        }

        $("#" + gridData.tableObject).inlineNav("#" + gridData.pagerID, parameters.navGridParameters);
        $("#" + gridData.tableObject).jqGrid("filterToolbar");
        $(window).bind('resize', function () {
            $("#" + gridData.tableObject).setGridWidth(gridData.wrapperObject.width() - 10);
        }).trigger('resize');

        $("#" + gridData.tableObject).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {
            $(".ui-jqgrid-titlebar-close", this).click();
        });
        $("#" + gridData.tableObject).click(function (e) {
            gridClickFunctions(e, $(this));
        });

        return $("#" + gridData.tableObject);
    }
}

class LCMSImageController {
    constructor() {
    }
    
    uploadFile(){}
    
    insertFileInEditor(_fileName, _fileId, _ckeditor) {
        var re = /(?:\.([^.]+))?$/;
        var type = re.exec(_fileName)[0];
        var formData = new FormData();
        var ckeditor = CKEDITOR.instances[_ckeditor.attr('id')];
        formData.append('action', 'FILE_DOWNLOADTEMP');
        formData.append('LCMS_session', $.cookie('LCMS_session'));
        formData.append('filename', _fileName);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                var jsonData = JSON.parse(request.responseText);
                var filePath = jsonData.filePath;
                if (type === ".png" || type === ".jpg" || type === ".JPG" || type === ".gif") {
                    ckeditor.insertHtml("<div style='overflow-x:scroll'><img name='" + _fileName + "' fileid='" + _fileId + "' src='" + filePath + "'/></div>");
                } else {
                    ckeditor.insertHtml("<a name='" + _fileName + "'  href='" + filePath + "' fileid='" + _fileId + "'>" + _fileName + "</a>");
                }
            }
        };
        request.open('POST', "./upload", /* async = */ false);
        request.send(formData);         
    }
}


function getPostDataFromUrl() {

}



function LCMSRequest(_url, _data, _onDone) {
    _data['LCMS_session'] = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: _url,
        data: _data, //{action: "VALIDATION_GETVALIDATION", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        _onDone(data);
        bootstrap_alert.warning('Success', 'success', 1000);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        bootstrap_alert.warning('Something went wrong + \n ' + errorThrown, 'error', 5000);
    });
}

function getPatches(oldData, newData) {
    var dmp = new diff_match_patch();
    var diff = dmp.diff_main((oldData), (newData));
    dmp.diff_cleanupSemantic(diff);
    var patches = dmp.patch_make(diff);
    var textPatches = dmp.patch_toText(patches);
    return textPatches;

}