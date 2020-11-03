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
    if (target.length && typeof event !== "undefined") {
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

function getCSSOfHref(href) {
    var css = [];
    //var sheet = $("<link type='text/css' rel='stylesheet' href='"+href+"'/>")[0].sheet;
    var sheet = $("link[href='" + href + "']")[0].sheet;
    var rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
    if (rules)
    {
        css.push('\n/* Stylesheet : ' + (sheet.href || '[inline styles]') + ' */');
        for (var j = 0; j < rules.length; j++)
        {
            var rule = rules[j];
            if ('cssText' in rule)
                css.push(rule.cssText);
            else
                css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n');
        }
    }
    var cssInline = css.join('\n') + '\n';
    return cssInline;
}

function getCSS() {
    var css = [];
    for (var i = 0; i < document.styleSheets.length; i++)
    {
        var sheet = document.styleSheets[i];
        var rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
        if (rules)
        {
            css.push('\n/* Stylesheet : ' + (sheet.href || '[inline styles]') + ' */');
            for (var j = 0; j < rules.length; j++)
            {
                var rule = rules[j];
                if ('cssText' in rule)
                    css.push(rule.cssText);
                else
                    css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n');
            }
        }
    }
    var cssInline = css.join('\n') + '\n';
    return cssInline;
}

async function getDocumentByName(_parent, _id) {
    let request = await LCMSRequest("./servlet", {action: "getdocument", k: "title", v: _id});
    let afterRequest = await onDone(request);
    return "done";
    async function onDone(data) {
        return await buildDocumentPage(data, _parent);
    }
}

async function doCommand(_command, _parameters, _ondone) {
    let request = await LCMSRequest("./servlet", {action: "docommand", k: _command, parameters: _parameters});
    let afterRequest = await onDone(request);
    return "done";
    async function onDone(data) {
        return await _ondone(data);
    }
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
    constructor(parent) {
        console.log("new gridcontroller");
        this.grids = {};
        this.references = [];
        this.views = [];
        this.LCMSGrids = {};
        this.parent = parent;
    }

    addLCMSGrid(_gridId, _grid) {
        this.LCMSGrids[_gridId] = _grid;
    }
    addGrid(_gridId, _grid) {
        this.grids[_gridId] = _grid;
    }

    regenerateGrids() {
        var me = this;
        me.references = [];
        console.log("regenerating grids...");
        documentPage.minimizeGrids(documentPage, $("div[id^='wrapper']"));
        $.each($("div[class=grid-placeholder]"), function (a, b) {
            documentPage.generateGrid($(b).parent(), $(b).attr('name').substring(5), me.grids[$(b).attr('name').substring(5)]);
        });
    }

    checkGrids() {
        var me = this;
        me.references = [];
        var denominator = $("table[id^=grid]");
        var gridsOnPage = {};
        //me.grids = new Array();
        denominator.each(function (a, b) { //remove grids that are not in the denominator array
            try {
                if ($(b).jqGrid('getGridParam') !== null) {
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
                    gridsOnPage[$(b).attr('id')] = me.grids[$(b).attr('id')];
                } else {
                    console.log("Gridparams are null!");
                }
            } catch (err) {
                console.log(err);
            }
        });
        // me.grids = gridsOnPage;

        $.each(me.grids, function (a, b) {

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
                $("#" + b.list).jqGrid("getGridParam").colModel[Object.keys(column)[0]].editoptions.value = newValues; //Object.values(column)[0];
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
        if (typeof me.grids[grid.attr('id')] !== "undefined" && me.grids[grid.attr('id')].hasOwnProperty("subGridHasSubGridValidation")) {
            $.each(subGridCells, function (i, value) {

                var htmlValue = $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).html();
                if (!me.grids[grid.attr('id')].subGridHasSubGridValidation(value.parentNode.id, me.grids[grid.attr('id')].subgridref, me)) {
                    $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).unbind('click').html('');
                } else {
                    $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).bind('click').html("<div class='sgbutton-div'><a role='button' class='btn btn-xs sgbutton'><span class='fa fa-fw fa-plus'></span></a></div>");
                }
                if (htmlValue !== $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).html()) {
                    change = true;
                }
            });
        }



    }
}

class LCMSNormalPage {

}

class LCMSEditablePage {

    constructor(pageData, parent) {
        this.pageData = pageData;
        this.originalDocument = "";
        this.gridForm = new LCMSGridForm(this);
        this.canvasses = new Object();
        this.readonly = true;
        this.parent = parent;
        this.gridController = new LCMSgridController(this.parent);
    }

    buildPageData(data, _originalDocument) {
        console.log("Start loading page");
        var me = this;

        me.parent.empty();
        var jsonData = JSON.parse(data, me.parent);
        var grids = {};
        jsonData.parent = me.parent;
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-id", jsonData.replaces["LCMSEditablePage-id"]);
            //jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-menu", jsonData.replaces["LCMSEditablePage-menu"]);
            me.setPageId(jsonData.replaces["LCMSEditablePage-id"]);
            console.log("Regenerating grids...");
            try {
                var LCMSEditablePage_content = {};
                if (jsonData.replaces["LCMSEditablePage-content"] !== "") {

                    LCMSEditablePage_content = $.parseJSON(jsonData.replaces["LCMSEditablePage-content"]);
                    if (typeof _originalDocument !== "undefined") {
                        me.originalDocument = _originalDocument;
                    } else {
                        me.originalDocument = JSON.stringify(LCMSEditablePage_content);
                    }

                } else {
                    LCMSEditablePage_content.html = "";
                    LCMSEditablePage_content.grids = {};
                    me.originalDocument = '';
                }
                jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-content", LCMSEditablePage_content.html);
                grids = LCMSEditablePage_content.grids;
            } catch (e) {
                console.log(e);
                bootstrap_alert.warning("Something went wrong", "warning", "1000");
            }
            me.parent.click();
        }
        jsonData.parent.empty();
        this.generatePage(jsonData, grids);
    }

    generatePage(jsonData, grids) {
        console.log("generatePage()");
        var me = this;
        me.gridsloaded = false;
        var webPage = $($.parseHTML(jsonData.webPage, document, true));
        var scripts = jsonData.scripts;
        var parameters = jsonData.parameters;
        $.each(parameters, function (key, value) {
            webPage.find("[LCMS='" + key + "']").append(value);
        });
        webPage.find("input[name^='canvas_']").each(function (a, b) {
            var canvas = $("<canvas style='border:1px solid' id='" + $(b).attr('id') + "'></canvas>");
            var ctx = canvas[0].getContext('2d');
            var myImage = new Image();
            var URI = $(b).val();
            me.canvasses[$(b).attr('id')] = URI;
            myImage.src = URI;
            myImage.onload = function ()
            {
                console.log(myImage.src);
                ctx.drawImage(myImage, 0, 0);
                $(b).after(canvas);
                $(b).remove();
            };
        });
        jsonData.parent.append(webPage);
        jsonData.parent.append("<script>" + scripts + "</script>");
        var editor = $($("div[id^='wrapper']")[0]);
        $.each(grids, function (key, value) {
            var grid = (async function () {
                me.key = key;
                me.value = value;
                let promise = new Promise((res, rej) => {
                    res(me.generateGrid($("div[name*=" + key + "]").parent(), me.key, me.value));

                });
                let val = await  promise;

            })();

        });
        me.gridsloaded = true;
        me.toggleCtrlClick();
        me.gridController.checkGrids();
        $.each(me.gridController.grids, function (key, value) {
            if (typeof value.subgridref !== "undefined") {
                value = me.option_subgrid(value, value.subgridref);
                $("#" + key).jqGrid("setGridParam", value);
                $("#" + key).trigger("reloadGrid");
            }
        });
        var numEditors = me.parent.find("div[id^=editable]").length;
        if (numEditors > 0) {
            showLoading();
            (async () => {

                let editorsLoaded = await me.loadEditors();
                try {
                    me.loadSideBarMenu();
                    $("#sidebar").BootSideMenu({side: "left"});
                    me.afterLoadComplete();
                    hideLoading();
                } catch (e) {
                    hideLoading();
                }
            })();
            hideLoading();
        } else {
            me.loadSideBarMenu();
            $("#sidebar").BootSideMenu({side: "left"});
            me.afterLoadComplete();
        }
        $("#page-elements").remove();
        me.setReadOnly();
    }

    doSave(me, data) {

        var patches = getPatches(me.originalDocument, data);
        var _cookie = $.cookie('LCMS_session');
        function onDone(_data) {
            me.originalDocument = data;
            bootstrap_alert.warning('Validatie opgeslaan', 'success', 2000);
            console.log("Changes saved.");
        }
        var formData = new FormData();
        var pageContent = new Blob([patches], {type: "text/xml"});
        formData.append("action", me.pageData.editAction);
        formData.append("LCMS_session", _cookie);
        formData.append("oper", "edit");
        formData.append("contents", pageContent);
        formData.append(me.pageData.idName, me.pageData.pageId);
        var extraParams = {
            enctype: "multipart/form-data",
            processData: false,
            async: false,
            accepts: "application/json",
            // cache: false,
            contentType: false
        };
        LCMSRequest(me.pageData.editUrl, formData, onDone, extraParams);
    }

    savePage() {
        console.log("savePage()");
        var me = this;
        JSON.stringify(me.getDataFromPage(me, me.doSave));
    }

    getHistory() {
        var me = this;
        var extraOptions = {
            onSelectRow: function (rowid) {
                var modal = create_modal($("#public-menu"), "Geschiedenis bekijken", "");
                modal.attr("id", "historyModal");
                modal.find("#btn-save").remove();
                var btn = dom_button("btn-revert", "history", "Versie herstellen", "primary");
                var historyDiv = $("<div></div>");
                var rowData = $("#history-table").jqGrid('getRowData', rowid);
                btn.on("click", async function (e) {
                    $("#historyModal").modal('hide');
                    $("#historyModal").remove();
                    let request = await LCMSRequest("./servlet", {action: "docommand", k: "dobacklog", parameters: {object_id: rowData["object_id"], object_type: rowData["object_type"], created_on: moment(rowData["created_on"]).valueOf()}});
                    async function onDone(data) {
                        console.log("Reverting document...");
                        buildEditablePage(data, $("#content"), documentPage.originalDocument, documentPage.pageData);
                    }
                    let afterRequest = await onDone(request);
                });

                var getHistory = (async function () {
                    let promise = new Promise((res, rej) => {
                        res(LCMSRequest("./servlet", {action: "getbacklog", k: "backlogid", v: rowData["backlogid"]}));
                        console.log("getHistory promise");
                    });
                    let value = await promise;
                    var contents = $.parseJSON($.parseJSON(value).changes).contents;
                    contents = decodeURI(decodeURI(contents));
                    historyDiv.text(contents);
                })();

                modal.find("div[class='modal-body']").append(historyDiv);
                modal.find("div[class='modal-body']").append(btn);
                modal.modal('show');
                return true;
                //return  popupEdit('view', $("#history-table"), $("#public-menu"), "", {});
            }
        };
        LCMSTableRequest("loadbacklog", "", "./servlet", "history-table", "history-pager", "public-menu", lang["backlog"]['title'], 3, extraOptions, {excludes: "changes", object_id: me.pageData.pageId});
    }

    generateGrid(editor, gridId, gridParam) {
        console.log("generateGrid();");
        var me = this;
        var grid = $("<table id='" + gridId + "'></table>");
        var pager = $("<div id='pager_" + gridId + "'></div>");
        editor.find("div[name*=" + gridId + "]").after(grid);
        editor.find("div[name*=" + gridId + "]").after(pager);
        editor.find("div[name*=" + gridId + "]").remove();
        var gridData = {
            data: {table: gridParam.data, header: gridParam.colModel},
            editAction: " ",
            editUrl: " ",
            tableObject: gridId,
            pagerID: gridParam.pager.replace("#", ""),
            wrapperObject: editor,
            multiselect: true,
            jqGridOptions: {
                pager: '#' + 'pager_' + gridId,
                autowidth: true,
                autoheight: true,
                rownumbers: true,
                colModel: gridParam.colModel,
                caption: gridParam.caption,
                groups: gridParam.groups,
                summaries: gridParam.summaries,
                subGrid: typeof gridParam.subgridref !== "undefined",
                subgridref: gridParam.subgridref,
                subgridof: gridParam.subgridof,
                subGridTemplate: gridParam.subGridTemplate,
                subGridHasSubGridValidation: me.checkHasSubGrid,
                subGridRowExpanded: me.subGridRowExpanded,
                loadCompleteFunction: gridParam.loadCompleteFunction,
                extraOptionsJSON: gridParam.extraOptionsJSON
            },
            jqGridParameters: {
                navGridParameters: {
                    add: true,
                    save: true,
                    del: true,
                    cancel: true,
                    addParams: {
                        rowID: function (options) {
                            return "row_" + uuidv4();
                        },
                        position: "last",
                        addRowParams: {
                            rowID: function (options) {
                                return "row_" + uuidv4();
                            },
                            position: "last",
                            keys: true
                        }
                    },
                    editParams: {
                        aftersavefunc: function (id) {
                            //me.savePage();
                        }
                    }
                }
            }
        };

        var jqgridFunctionList = ["beforeRequest", "a", "loadBeforeSend"];
        try {
            $.each(JSON.parse(gridParam.extraOptionsJSON), function (i, n) {
                if (typeof n === "string") {
                    var re = new RegExp(`\\b${i}\\b`, 'gi');
                    if (jqgridFunctionList.findIndex(value => re.test(value)) !== -1) {
                        gridData.jqGridOptions[i] = eval(n);
                    } else {
                        gridData.jqGridOptions[i] = n;
                    }
                    ;
                } else {
                    gridData.jqGridOptions[i] = n;
                }
            });
        } catch (e) {

        }

        let documentGrid = new LCMSGrid(gridData);
        console.log("pushing LCMSgrid to gridcontroller");
        this.gridController.addLCMSGrid(gridId, documentGrid);

        let gridObject = documentGrid.createGrid();
        gridObject.then(
                function (gridObjectResult) {
                    console.log("After createGrid...");

                    me.gridController.addGrid(gridObjectResult.jqGrid("getGridParam").id, gridObjectResult.jqGrid("getGridParam"));
                    me.addGridButtons(documentGrid, gridObjectResult, gridData, editor);
                    if (typeof gridData.jqGridOptions.loadCompleteFunction !== "undefined") {
                        eval(gridData.jqGridOptions.loadCompleteFunction);
                    }
                }
        );





        //me.toggle_multiselect(grid.attr('id'));



        return "done";
    }

    subGridRowExpanded(subgridDivId, rowId) {
        var me = this;
        var subgridTableId = subgridDivId + "_t";
        var documentGrid = documentPage.gridController.LCMSGrids[subgridTableId];

        documentPage.gridController.addLCMSGrid(subgridTableId, documentGrid);
        $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table><div id='pager_" + subgridTableId + "'></div>");
        var createSubGrid = (async function (me) {
            let value;
            documentGrid = documentPage.gridController.LCMSGrids[subgridTableId];
            if (typeof documentGrid === "undefined") {
                var documentGridToCopy = documentPage.gridController.LCMSGrids[Object.keys(documentPage.gridController.LCMSGrids).find(function (a) {
                    return a.includes("_row");
                })];
                var documentGrid = jQuery.extend(true, {}, documentGridToCopy);
                //var documentGrid = Object.assign({}, documentGridToCopy);
                documentGrid.gridData.data.table = [];
                documentGrid.gridData.pagerID = "pager_" + subgridTableId;
                documentGrid.gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
                documentGrid.gridData.tableObject = subgridTableId;
                documentGrid = new LCMSGrid(documentGrid.gridData);
                documentPage.gridController.addLCMSGrid(subgridTableId, documentGrid);
            }
            let promise = new Promise((res, rej) => {
                res(documentGrid.createGridOptions(subgridTableId, {pager: "#pager_" + subgridTableId}));
            });
            value = await  promise;

            $("#" + subgridTableId).jqGrid(value);

            documentGrid.gridData.pagerID = "pager_" + subgridTableId;
            documentGrid.gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
            documentGrid.gridData.tableObject = subgridTableId;
            $("#" + subgridTableId).inlineNav("#" + documentGrid.gridData.pagerID, documentGrid.gridData.jqGridParameters.navGridParameters);
        })();
    }

    checkHasSubGrid(_rowid, _subgridref, _gridController) {
        console.log("checking hasSubgrid");
        var gridController = _gridController;
        var hasSubgrid = false;
        if (typeof gridController !== "undefined" && typeof _subgridref !== "undefined") {
            if (gridController.references.length > 0) {
                var filteredObj = Object.filter(gridController.references, ref => ref.list === _subgridref.gridId);
                var keys = Object.keys(filteredObj);
                keys.forEach(function (key) {
                    var attr = filteredObj[key].attr;
                    var filteredData = Object.filter(gridController.grids[_subgridref.gridId].data, function (row) {
                        if (typeof row[attr] !== "undefined") {
                            return row[attr].includes(_rowid);
                        } else {
                            return false;
                        }
                    });
                    if (!isEmptyObj(filteredData)) {
                        hasSubgrid = true;
                    }
                });
            } else {
                hasSubgrid = false;
            }
        } else {
            hasSubgrid = false;
        }
        return hasSubgrid;
    }

    addGridButtons(documentGrid, gridObject, gridData, editor) {
        var me = this;
        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
            var rowid = gridObject.jqGrid('getGridParam', 'selrow');
            if (rowid !== null) {
                return documentGrid.popupEdit(rowid, gridObject, $(this), gridData.editAction);
            } else {
                return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
            }
        }));
        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-cogs", "Click here to change columns", "", function () {
            me.gridForm.new_grid_form(me, gridObject.jqGrid('getGridParam'));
        }));
        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-download", "Download selection as csv", "", function () {
            var selRows = gridObject.jqGrid("getGridParam", "selarrrow");
            var data = gridObject.jqGrid("getGridParam", "data");
            var selRowsData = Object.filter(data, item => selRows.includes(String(item.id)) === true);
            var arr = [];
            $.each(selRowsData, function (key, value) {
                arr.push(value);
            });
            var csv = Papa.unparse(JSON.stringify(arr));
            let csvContent = "data:text/csv;charset=utf-8," + csv;
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", gridObject.jqGrid("getGridParam", "caption") + ".csv");
            document.body.appendChild(link); // Required for FF
            link.click();
            document.body.removeChild(link);
        }));
        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-trash", "Click here to change columns", "", function () {
            var rowid = gridObject.jqGrid('getGridParam', 'selrow');
            gridObject.jqGrid('delRowData', rowid);
        }));
        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-list-ul", "Click here to change columns", "", function () {
            me.toggle_multiselect(gridObject.jqGrid('getGridParam', 'id'));
        }));
    }

    toggle_multiselect(gridId) {
        console.log("toggle_multiselect()");
        if ($('#' + gridId + ' .cbox:visible').length > 0)
        {
            $('#' + gridId).jqGrid('hideCol', 'cb');
            jQuery('.jqgrow').click(function () {
                jQuery('#' + gridId).jqGrid('resetSelection');
                this.checked = true;
            });
        } else
        {
            $('#' + gridId).jqGrid('showCol', 'cb');
            jQuery('.jqgrow').unbind('click');
        }
    }

    setPageId(_pageId) {
        this.pageData.pageId = _pageId;
    }

    minimizeGrids(_me, _htmlData) {
        //_me.gridController.checkGrids();
        _htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
            $(b).after("<div class='grid-placeholder' name='" + $(b).attr('id') + "'></div>");
            $(b).remove();
        });
        return _htmlData;
    }

    getDataFromPage(me, onDone) {

        console.log("getDataFromPage()");

        var htmlData = $('<output>').append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"), document, true)));
        htmlData = me.minimizeGrids(me, htmlData);
        var data = {};
        var size = htmlData.find("canvas").length;
        if (size < 1) {
            data['html'] = htmlData.prop("innerHTML");
            data['grids'] = me.getTrimmedGridControllerGrids();
            data['html'] = removeElements("nosave", data['html']);
            onDone(me, JSON.stringify(data));
        } else {
            var c = 0;
            htmlData.find("canvas").each(function (a, b) {
                var canvasData = $("<input type='hidden' name='canvas_" + $(b).attr('id') + "' id='" + $(b).attr('id') + "'></div>");
                var myImage = new Image();
                myImage.src = document.getElementById($(b).attr('id')).toDataURL("image/png");
                myImage.onload = function ()
                {
                    canvasData.val(myImage.src);
                    console.log(canvasData.val());
                    $(b).after(canvasData);
                    $(b).remove();
                    c++;
                    if (c === size) {
                        data['html'] = htmlData.prop("innerHTML");
                        data['grids'] = me.getTrimmedGridControllerGrids();
                        data['html'] = removeElements("nosave", data['html']);
                        data['html'] = data['html'].replace("&#8203;", "");
                        onDone(me, JSON.stringify(data));
                    }
                };
            });
        }







    }

    replaceViews(_classname, _content) {
        console.log("replace table views");
        var $s = _content.find("." + _classname);
        $s.each(function (index, item) {
            $(this).replaceWith(replaceBy).end();
        });
        return $("<div></div>").append($s).html();
    }

    getTrimmedGridControllerGrids() {
        var me = this;
        var gridControllerCopy = jQuery.extend(true, {}, me.gridController);
        $.each(gridControllerCopy.grids, function (index, item) {
            //      item.data = me.gridController.LCMSGrids[item.id].data;
            var colModel = item.colModel;
            var colNames = item.colNames;
            var colModelArray = [];
            var colNameArray = [];
            var c = 0;
            var colModelCopy = jQuery.extend(true, {}, colModel);
            colModelCopy = Object.filter(colModelCopy, model => model.name !== "rn" & model.name !== "cb" & model.name !== "subgrid");
            $.each(colModelCopy, function (i, j) {
                colModelArray[c] = colModel[i];
                colNameArray.push(j.name);
                c++;
            });
            item.colNames = colNameArray;
            item.colModel = colModelArray;
        });
        return gridControllerCopy.grids;
    }

    option_subgrid(options, subgridref) {
        console.log("option_subgrid()");
        var me = this;
        var gridId = options.id;
        var gridCaption = options.caption;
        options.subGrid = true;
//    options.subGridOptions = {hasSubgrid: function (options) {
//            checkHasSubGrid(options, subgridref);
//        }};
        options.subGridRowExpanded = function (subgridDivId, rowId) {
            var subgridTableId = subgridDivId + "_t";
            $("[id='" + subgridDivId + "']").html("<table id='" + subgridTableId + "'></table>");
            var filteredObj = Object.filter(me.gridController.references, ref => ref.list === subgridref.gridId && ref.refList === gridCaption);
            var key = Object.keys(filteredObj)[0];
            var attr = filteredObj[key].attr;
            var filteredData = Object.filter(me.gridController.grids[subgridref.gridId].data, function (row) {
                if (typeof row[attr] !== "undefined") {
                    return row[attr].includes(rowId);
                } else {
                    return false;
                }
            });
            var key = Object.keys(filteredData)[0];
            console.log(Object.values(filteredData));
            $("[id='" + subgridTableId + "']").jqGrid({
                datatype: 'local',
                data: Object.values(filteredData),
                colNames: subgridref.colNames,
                colModel: subgridref.colModel,
                gridview: true,
                rownumbers: false,
                autoencode: true,
                responsive: true,
                headertitles: true,
                iconSet: "fontAwesome",
                guiStyle: "bootstrap4"

            });
        };
        return options;
    }

    toggleCtrlClick() {
        var me = this;
        if (me.readonly === false) {
            me.parent.find("div[id^=editable]").on('click', function (e) {
                me.parent.find(".cke").css("border", "none");
                if (typeof e.target.href !== 'undefined' && e.ctrlKey === true) {
                    window.open(e.target.href, 'new' + e.screenX);
                }
            });
        } else {
            me.parent.find("div[id^=editable]").on('click', function (e) {
                me.parent.find(".cke").css("border", "none");
                if (typeof e.target.href !== 'undefined') {
                    window.open(e.target.href, "_self");
                }
            });
        }

    }

    async loadEditors() {
        var me = this;
        me.parent.find("div[id^=editable]").each(function (a, b) {
            if (CKEDITOR.instances[$(b).attr('id')]) {
                CKEDITOR.remove(CKEDITOR.instances[$(b).attr('id')]);
            }
            var ck = CKEDITOR.inline($(b).attr('id'));
            ck.on('instanceReady', function (ev) {
                console.log("CKEDITOR instance ready");
                var editor = ev.editor;
                console.log(editor.filter.allowedContent);
                editor.setReadOnly(me.readonly);
                me.toggleCKmenu(editor);
            });
            ;
        });
        return "done";
    }

    toggleCKmenu(editor) {
        if (typeof editor !== "undefined") {
            var elements = $("#cke_" + editor.name).find(".cke_inner");
            if (elements.css("display") === "none") {
                elements.css("display", "flex");
            } else {
                elements.css("display", "none");
            }
        } else {
            if ($(".cke_inner").css("display") === "none") {
                $(".cke_inner").css("display", "flex");
            } else {
                $(".cke_inner").css("display", "none");
            }
        }
        console.log("Load completed");
    }

    loadSideBarMenu() {
        var me = this;
        console.log("loadSideBarMenu()");
        me.parent.find("#sidebar").empty();
        var sidebarContainer = dom_div("", "sidebar-container");
        //---------------------------------------------------
        var row1 = dom_row("sidebar-row-1");
        var col1 = dom_col("sidebar-col-1", 12);
        var div1 = dom_div("navbar-brand", "sidebar-title");
        col1.css("text-align", "center");
        div1.css("margin-right", "0px");
        div1.css("margin-top", "0.5em");
        div1.append("Menu");
        col1.append(div1);
        col1.append("<hr>");
        row1.append(col1);
        sidebarContainer.append(row1);
        //---------------------------------------------------
        var row2 = dom_row("sidebar-row-2");
        var col2 = dom_col("sidebar-col-2", 12);
        me.generate_menu(col2);
        row2.append(col2);
        sidebarContainer.append(row2);
        //---------------------------------------------------
        var row1 = dom_row("sidebar-row-1");
        var col1 = dom_col("sidebar-col-1", 12);
        var div1 = dom_div("navbar-brand", "sidebar-title");
        col1.css("text-align", "center");
        div1.css("margin-right", "0px");
        div1.css("margin-top", "0.5em");
        div1.append("Inhoudsopgave");
        col1.append(div1);
        col1.append("<hr>");
        row1.append(col1);
        sidebarContainer.append(row1);
        //---------------------------------------------------
        var row2 = dom_row("sidebar-row-2");
        var col2 = dom_col("sidebar-col-contentmenu", 12);
        row2.append(col2);
        sidebarContainer.append(row2);
        //---------------------------------------------------
        var row1 = dom_row("sidebar-row-1");
        var col1 = dom_col("sidebar-col-1", 12);
        var div1 = dom_div("navbar-brand", "sidebar-title");
        col1.css("text-align", "center");
        div1.css("margin-right", "0px");
        div1.css("margin-top", "0.5em");
        //div1.append("Structuur");
        col1.append(div1);
        col1.append("<hr>");
        row1.append(col1);
        sidebarContainer.append(row1);
        //---------------------------------------------------
        var row3 = dom_row("sidebar-row-3");
        var col3 = dom_col("sidebar-col-3", 12);
        var div3 = dom_div("", "structure-container");
        //  div3.append(dom_moveUpDownList("page-elements", $("div[id^=gbox_grid], div[id^=editable]")));
        col3.append(div3);
        row3.append(col3);
        //sidebarContainer.append(row3);





        me.parent.find("#sidebar").append(sidebarContainer);
        //---------------------------------------------------
        me.parent.find("#importTableButton").change(function () {
            $.each(this.files, function (index, file) {
                var reader = new FileReader();
                var name = file.name;
                reader.onload = function (e) {
                    var text = reader.result;
                    console.log(text);
                    bootstrap_alert.warning(name, "info", 1000);
                    me.gridForm.createGridBasedOnImportFile($(me.parent.find("div[id^='wrapper']")[0]), createDataAndModelFromCSV(text), name);
                };
                reader.readAsText(file);
            });
        });
    }

    afterLoadComplete() {
        var me = this;
        $.each(me.canvasses, function (a, b) {
            var canvas = $("#" + a);
            var ctx = canvas[0].getContext('2d');
            var myImage = new Image();
            var URI = b;
            myImage.src = URI;
            myImage.onload = function ()
            {
                console.log(myImage.src);
                ctx.drawImage(myImage, 0, 0);
            };
            startCanvas(a);
        });
        if (typeof loadPageScripts !== "undefined") {
            console.log("Load page scripts");
            loadPageScripts();
        }


    }

    setCKmenu(state) {
        $(".cke_inner").css("display", state);
    }

    setReadOnly() {
        var me = this;
        console.log("setReadOnly()");
        if (me.readonly) {
            me.toggleCtrlClick();
            me.setCKmenu("none");
        }
    }

    edit_page() {
        var me = this;
        console.log("edit_page()");
        me.toggleCtrlClick();
        //toggleCKmenu();
        if (me.readonly) {
            me.readonly = false;
            me.setCKmenu("flex");
            // periodic_save();
        } else {
            me.readonly = true;
            me.setCKmenu("none");
        }
        me.parent.find("div[contenteditable]").each(function (a, b) {
            if (typeof CKEDITOR.instances[b.id] !== "undefined") {

                var retryCount = 0;
                var delayedSetReadOnly = function () {
                    if (typeof CKEDITOR.instances[b.id].editable() === "undefined" && retryCount < 10) {
                        retryCount++;
                        setTimeout(delayedSetReadOnly, retryCount * 100);
                    } else {
                        CKEDITOR.instances[b.id].setReadOnly(me.readonly);
                    }
                };
                setTimeout(delayedSetReadOnly, 50);

                // CKEDITOR.instances[b.id].setReadOnly(me.readonly);
            }
        });
        me.parent.find("#edit-menu button").each(function (index, btn) {
            if ($(btn).prop('disabled') === true) {
                $(btn).prop('disabled', false);
            } else {
                $(btn).prop('disabled', true);
            }

        });
    }

    new_editable_field() {
        console.log("new_editable_field()");
        var me = this;
        var editor = $(me.parent.find("div[id^='wrapper']")[0]);
        var editable_field = $("<div id='editable_" + uuidv4() + "' contenteditable='true'><p>Nieuw bewerkbaar veld</p></div>");
        editor.append(editable_field);
        var ck = CKEDITOR.inline(editable_field.attr('id'));
        ck.on('instanceReady', function (ev) {
            var editor = ev.editor;
            editor.setReadOnly(false);
        });
        return editable_field;
    }

    generate_menu(_parent) {
        console.log("generate menu");
        var menu_uuid = uuidv4();
        var me = this;
        var div_page_menu = $('<div id="div-page-menu"></div>');
        div_page_menu.appendTo(_parent);
        var btn_page_edit = $('<button type="button" id="btn-page-edit-' + menu_uuid + '" class="btn btn-info"><i class="fa fa-lg fa-fw fa-edit"></i><span>Bewerken</span></button>');
        $(document).on('click', '#btn-page-edit-' + menu_uuid, function (e) {
            me.edit_page();
        });
        btn_page_edit.appendTo(div_page_menu);
        var edit_menu = $('<div id="edit-menu"></div>');
        var btn_page_save = $('<button type="button" id="btn-page-save-' + menu_uuid + '" class="btn btn-primary" disabled><i class="fa fa-lg fa-fw fa-save"></i><span>Opslaan</span></button>');
        $(document).on('click', '#btn-page-save-' + menu_uuid, function (e) {
            me.savePage();
        });
        var btn_invoegen = $('<button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#collapseInvoegen" role="button" aria-expanded="false" aria-controls="collapseInvoegen" disabled>Invoegen</button>');
        var div_invoegen = $('<div class="collapse" id="collapseInvoegen"></div>');
        var div_card_invoegen = $('<div class="card card-body"></div>');
        var btn_tekstveld = $('<button type="button" id="btn-new-editable-field-' + menu_uuid + '" class="btn btn-primary" disabled><i class="fa fa-lg fa-fw fa-align-justify"></i><span>Tekstveld</span></button>');
        $(document).on('click', '#btn-new-editable-field-' + menu_uuid, function (e) {
            me.new_editable_field();
        });
        var btn_jqgrid = $('<button type="button" id="btn-new-jqgrid-' + menu_uuid + '" class="btn btn-primary" disabled><i class="fa fa-lg fa-fw fa-table"></i><span>Tabel</span></button>');
        $(document).on('click', '#btn-new-jqgrid-' + menu_uuid, function (e) {
            me.gridForm.new_grid_wizard(me);
        });
        var btn_acties = $('<button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#collapseActies" role="button" aria-expanded="false" aria-controls="collapseActies" disabled>Acties</button>');
        var div_acties = $('<div class="collapse" id="collapseActies"></div>');
        var div_card_acties = $('<div class="card card-body"></div>');
        var btn_importeer_tabel = $('<label class="btn btn-primary btn-file"><i class="fa fa-lg fa-fw fa-th"></i><span>Importeer</span> <input id="importTableButton" type="file" style="display: none;"></label>');
        var btn_exporteer = $('<button type="button" id="btn-export-html" class="btn btn-primary" disabled><i class="fa fa-lg fa-fw fa-download" ></i><span>Download</span></button>');
        btn_exporteer.on("click", function () {
            me.exportToHTML();
        });
        edit_menu.appendTo(div_page_menu);
        btn_page_save.appendTo(edit_menu);
        btn_invoegen.appendTo(edit_menu);
        div_invoegen.appendTo(edit_menu);
        div_card_invoegen.appendTo(div_invoegen);
        btn_tekstveld.appendTo(div_card_invoegen);
        btn_jqgrid.appendTo(div_card_invoegen);
        btn_acties.appendTo(edit_menu);
        div_acties.appendTo(edit_menu);
        div_card_acties.appendTo(div_acties);
        btn_importeer_tabel.appendTo(div_card_acties);
        btn_exporteer.appendTo(div_card_acties);
        var div_public_menu = $('<div id="public-menu"></div>');
        var btn_page_history = $('<button type="button" id="btn-page-history" class="btn btn-primary" onclick="documentPage.getHistory()"><i class="fa fa-lg fa-fw fa-history"></i><span>Versies</span></button>');
        var history_table = $('<table id="history-table"></table>');
        var history_pager = $(' <div id="history-pager"></div>');
        div_public_menu.appendTo(div_page_menu);
        btn_page_history.appendTo(div_public_menu);
        history_table.appendTo(div_public_menu);
        history_pager.appendTo(div_public_menu);
    }

}

class LCMSGridForm {

    constructor(_editablePage) {
        console.log("loading LCMSGridForm");
        var me = this;
        me.editablePage = _editablePage;
        loadFormatters().then(
                function (result) {
                    me.formatters = result;
                }
        );
    }

    new_grid_wizard(_editablePage, colModel, extraOptions, importCSV, _gridData, gridId, location) {
        console.log("new_grid_form()");
        var me = this;


        if (typeof colModel === 'undefined') {
            me.new_grid_form(_editablePage);
        } else {

            if (typeof extraOptions.subgridof !== "undefined") {

            } else {

            }


            var editable = $("div[id^=editable_]");
            if (editable.length === 0) {
                editable = _editablePage.new_editable_field();
            }
            var uuid = gridId;
            var editor = $("<div contenteditable='false' class='no-change' id='master_" + uuid + "'></div>");
            $("#" + editable.attr('id')).appendOrReplace(editor);
            var grid = $("<table id='" + uuid + "'></table>");
            var pager = $("<div id='pager_" + uuid + "'></div>");
            if (typeof extraOptions.subgridof === "undefined") {
                if (typeof location !== "undefined") {
                    location.after(grid);
                    location.after(pager);
                } else {
                    editor.append(grid);
                    editor.append(pager);
                }
            }

            var data = [];
            importCSV.forEach(function split(a) {
                var line = a;
                var lineObject = {};
                var colNames = filterUnique($.map(colModel, function (el) {
                    return el;
                }), 'name');
                line.forEach(function split(a, b) {
                    lineObject[colNames[b]] = a;
                });
                data.push(lineObject);
            });
            _gridData = Object.assign(_gridData, data);
            var gridData = {
                data: {table: _gridData, header: colModel},
                editAction: " ",
                editUrl: " ",
                tableObject: gridId,
                pagerID: pager.attr('id'),
                wrapperObject: editor,
                jqGridOptions: {
                    pager: "#" + pager.attr('id'),
                    autowidth: true,
                    autoheight: true,
                    rownumbers: true,
                    //colModel: colModel,
                    caption: extraOptions.caption
                },
                jqGridParameters: {
                    navGridParameters: {
                        add: true,
                        save: true,
                        del: true,
                        cancel: true,
                        addParams: {
                            rowID: function (options) {
                                return "row_" + uuidv4();
                            },
                            position: "last",
                            addRowParams: {
                                rowID: function (options) {
                                    return "row_" + uuidv4();
                                },
                                position: "last",
                                keys: true
                            }
                        },
                        editParams: {
                            aftersavefunc: function (id) {
                                //me._editablePage.savePage();
                            }
                        }
                    }
                }
            };
            $.each(extraOptions, function (i, n) {
                gridData.jqGridOptions[i] = n;
            });


            var jqgridFunctionList = ["beforeRequest", "a", "b", "loadBeforeSend"];
            try {
                $.each(JSON.parse(extraOptions.extraOptionsJSON), function (i, n) {
                    if (typeof n === "string") {
                        var re = new RegExp(`\\b${i}\\b`, 'gi');
                        if (jqgridFunctionList.findIndex(value => re.test(value)) !== -1) {
                            gridData.jqGridOptions[i] = eval(n);
                        } else {
                            gridData.jqGridOptions[i] = n;
                        }
                        ;
                    } else {
                        gridData.jqGridOptions[i] = n;
                    }
                });
            } catch (e) {

            }

            let documentGrid = new LCMSGrid(gridData);
            let gridObject = documentGrid.createGrid();
            gridObject.then(
                    function (gridObjectResult) {
                        console.log("after documentGrid.createGrid()");
                        documentPage.addGridButtons(documentGrid, gridObjectResult, gridData, editor);

                    }
            );



            if (typeof extraOptions.subgridof !== "undefined") {

                var id = getJQGridParamByCaption(extraOptions.subgridof).id;
                var params = getJQGridParamByCaption(extraOptions.subgridof);
                var createSubGrid = (async function () {
                    let promise = new Promise((res, rej) => {
                        res(documentGrid.createGridOptions(id + "_subgridTableTemplate", {pager: "#" + id + "_subgridPagerTemplate"}));
                    });
                    let subGridTemplate = await promise;
                    params.subgridTemplate = subGridTemplate;
                });
                params.subGridRowExpanded = function (subgridDivId, rowId) {
                    var subgridTableId = subgridDivId + "_t";
                    $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table><div id='pager_" + subgridTableId + "'></div>");
                    var createSubGrid = (async function () {
                        let promise = new Promise((res, rej) => {
                            res(documentGrid.createGridOptions(subgridTableId, {pager: "#pager_" + subgridTableId}));
                        });
                        let value = await  promise;
                        $("#" + subgridTableId).jqGrid(value);
                        params.subgridTemplate = value;
                        //documentGrid = new LCMSGrid($("#" + subgridTableId).jqGrid("getGridParam"));
                        gridData.tableObject = subgridTableId;
                        gridData.pagerID = "pager_" + subgridTableId;
                        gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
                        documentGrid.gridData.pagerID = "pager_" + subgridTableId;
                        documentGrid.gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
                        documentGrid.gridData.tableObject = subgridTableId;
                        documentPage.gridController.addLCMSGrid(subgridTableId, documentGrid);
                        $("#" + subgridTableId).inlineNav("#" + gridData.pagerID, gridData.jqGridParameters.navGridParameters);

                    })();

                };
                //params.subgridof = extraOptions.subgridof;
                // params.subgridTemplate = $("#" + id).jqGrid("getGridParam");
                params.subGridHasSubGridValidation = me.checkHasSubGrid;

                $("#" + id).jqGrid("setGridParam", params);
                $("#" + id).trigger("reloadGrid");

            }


            return gridObject;



        }



    }

    async new_grid_form(_editablePage, _gridData, _parentGrid) {
        console.log("new_grid_form()");
        var me = this;
        // me.formatters = await loadFormatters();

        var modal = create_modal(_editablePage.parent, "Tabel invoegen of wijzigen", "");
        var form = me.createForm(modal.find("div[class='modal-body']"), _gridData, modal, _editablePage);
        modal.modal('show');
        modal.find("button[id=btn-save]").on('click', function (e) {
            e.preventDefault();
            modal.modal('hide');
            var colModelWrapper = me.createColModel(form, _gridData, _editablePage); //1. create new colModel
            var newColumns = filterUniqueJson(colModelWrapper.colModel, "name"); //2. remove unused rows of data
            if (typeof _gridData !== "undefined") {
                _gridData.data = removeUnusedDataFromJqGrid(newColumns, _gridData.data, colModelWrapper.options.renames);
            }
            var gridId = me.createGridBasedOnModel(_gridData, colModelWrapper, _editablePage); //3. create new grid based on colModel




        });
        modal.on('hidden.bs.modal', function (e) {
            modal.remove();
        });
    }

    createGridBasedOnModel(_gridData, _colModelWrapper, _editablePage) {
        console.log("createGridBasedOnModel()");
        var me = this;
        var data = [];
        var importCSV = [];
        if (typeof _colModelWrapper.options.importCSV !== "undefined") {
            importCSV = _colModelWrapper.options.importCSV;
        }

        var gridId;
        if (typeof _gridData !== "undefined") {
            var gridData = $.extend(true, [], _gridData); //_gridData.clone();
            gridId = gridData.id;
            _editablePage.parent.find(("div[id^=gbox_" + gridData.id + "]")).each(function (a, b) {
                $(b).after("<div name='" + gridData.id + "'></div>");
                $(b).remove();
            });
            _editablePage.parent.find(("div[id^=pager_gbox_" + gridData.id + "]")).each(function (a, b) {
                $(b).remove();
            });
            $('#' + _gridData.id).jqGrid('GridUnload');
            me.new_grid_wizard(_editablePage, _colModelWrapper.colModel, _colModelWrapper.options, importCSV, gridData.data, gridData.id); //, $("div[name=" + gridData.id + "]"));
            $("div[name=" + gridData.id + "]").remove();
        } else {
            gridId = "grid_" + uuidv4();
            me.new_grid_wizard(_editablePage.parent.attr('id'), _colModelWrapper.colModel, _colModelWrapper.options, importCSV, data, gridId);
        }

        return gridId;
    }

    createGridBasedOnImportFile(_editablePage, importData, caption) {
        var me = this;
        var gridId = "grid_" + uuidv4();
        return new_grid_wizard(_editablePage, importData.colModel, {caption: caption}, [], importData.table, gridId);
    }

    createColModel(form, _gridData, _editablePage) {
        var me = this;
        console.log("createColModel from Form()"); //deze moet in lcms.js komen te staan
        var modalArray = form.serializeArray();
        var options = new Object();
        var colModel = new Object();
        var c = -1;
        var summaries = [];
        var groups = [];
        var subgridref = {};
        var renames = new Object();
        $.each(modalArray, function (i, val) {
            if (val.name === 'name') {
                c++;
                colModel[c] = new Object();
                colModel[c].name = val.value;
            }
            if (val.name === 'type') {
                colModel[c].type = val.value;
            }
            if (val.name === 'choices') {
                colModel[c].choices = val.value.split(/\r\n/);
                var choices = {};
                $.each(colModel[c].choices, function (a, b) {
                    if (b !== "") {
                        choices[b] = b;
                    }
                });
                colModel[c].choices = choices;
            }
            if (val.name === 'internalListName') {
                colModel[c].internalListName = val.value;
            }

            if (val.name === 'formatterName') {
                colModel[c].formatterName = val.value;
            }
            if (val.name === 'formatterFunction') {
                colModel[c].formatterFunction = val.value;
            }

            if (val.name === 'internalListAttribute') {
                colModel[c].internalListAttribute = val.value;
                colModel[c].choices = getValuesOfAttributeInList(colModel[c].internalListName, colModel[c].internalListAttribute);
            }
            if (val.name.match("^option")) {
                var option = val.name.substring(7);
                if (option === 'hidden') {
                    if (val.value === "on") {
                        colModel[c].hidden = true;
                        colModel[c].visibleOnForm = true;
                    }
                }
                if (option === 'multiple') {
                    colModel[c].multiple = true;
                }
                if (option === 'rename') {
                    renames[val.value] = colModel[c].name;
                }
//                if (option === 'loadComplete'){
//                    val.value = eval(val.value);                    
//                }

                if (option === 'summary') {
                    summaries.push(val.value);
                    Object.keys(colModel).forEach(function (i) {
                        if (colModel[i].name === val.value) {
                            colModel[i].summaryTpl = [
                                "<span style=''>Subtotaal: {0}</span>"
                            ];
                            colModel[i].summaryType = ["sum"];
                            colModel[i].template = "number";
                        }
                    });
                }
                if (option === 'group') {
                    groups.push(val.value);
                }
                if (option === 'subgridref') {
                    subgridref.colNames = getJQGridParamByCaption(val.value).colNames;
                    subgridref.colModel = getJQGridParamByCaption(val.value).colModel;
                    subgridref.gridId = getJQGridParamByCaption(val.value).id;
                }
                if (option === 'subgridof') {
                    options.subgridof = val.value;
                }

                options[val.name.substring(7)] = val.value;
            }
            if (val.name.match("^import")) {
                if (val.value.length > 0) {
                    options.importCSV = CSVToArray(val.value, ",");
                }
            }

        });
        if ($.isEmptyObject(renames) === false) {
            options.renames = renames;
        }
        if (summaries.length > 0) {
            options.summaries = summaries;
            options.footerrow = true;
            options.userDataOnFooter = true;
            options.loadComplete = function () {
                var sumJson = {};
                var grid = $(this);
                summaries.forEach(function (a) {
                    sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
                });
                $(this).jqGrid("footerData", "set", sumJson);
            };
        } else {
            options.footerrow = false;
        }
        if (groups.length > 0) {
            options.groups = groups;
            options.grouping = true;
            options.groupingView = {
                groupField: groups,
//            groupColumnShow: [true],
                groupText: ['<b>{0} - {1} Item(s) </b>'],
//            groupCollapse: false,
//            groupSummaryPos: ["header"],
//            groupSummary: [false]

                hideFirstGroupCol: true,
                showSummaryOnHide: false,
                groupColumnShow: [false],
                groupSummaryPos: ["header"],
                groupSummary: [true]

            };
        } else {
            options.grouping = false;
        }

        if (typeof subgridref.colNames !== "undefined") {
            options.subgridref = subgridref;
            options = me.editablePage.option_subgrid(options, subgridref);
        }



        return {"colModel": colModel, "options": options};
    }

    createForm(_parent, _griddata, _modal, _editablepage) {
        console.log("createForm()");
        var me = this;
        if (typeof _griddata === 'undefined') {
            _griddata = {};
        }
        var form = $("<form></form>");
        var container = $("<div class='container'></div>");
        var rowParent = dom_div("", "rowParent");
        var addRowButton = $("<button type='button' class='btn btn-primary'>Add column</button>");
        form.append(container);
        form.append(forms_textbox("Titel", "option_caption", "option_caption", _griddata.caption));
        form.append(forms_checkbox("Geminimaliseerd starten", "option_hiddengrid", "option_hiddengrid", _griddata.hiddengrid));
        form.append(forms_textarea("Importeer CSV", "import", "import"));
        form.append(addRowButton);
        me.addHeader(form);
        form.append(rowParent);
        if (typeof _griddata.colModel !== 'undefined') {
            var colModel = _griddata.colModel;
            for (var key in colModel) {
                if (typeof colModel[key].name !== 'undefined') {
                    if (colModel[key].name !== "rn" && colModel[key].name !== "cb" && colModel[key].name !== "subgrid") {
                        me.addRow(form,
                                uuidv4(),
                                colModel[key],
                                _editablepage,
                                _griddata, rowParent);
                    }
                }
            }
        } else {
            me.addRow(form, uuidv4(), {}, _editablepage, _griddata, rowParent);
        }
        addRowButton.on('click', function (e) {
            me.addRow(form, uuidv4(), {}, _editablepage, _griddata, rowParent);
        });
        //OPTIE SAMENVATTING START
        var obj = [];
        form.find("div[class*=row]").each(function (a, b) {
            var name = $(b).find("input[name=name]").val();
            var id = $(b).find("input[name=name]").attr('id');
            if (typeof id !== "undefined") {
                obj.push({id, name});
            }
        });
        form.append(forms_select("Samenvatting van: ", "option_summary", "option_summary", obj, _griddata.summaries));
        //OPTIE SAMENVATTING EINDE
        form.append(forms_select("Groeperen op: ", "option_group", "option_group", obj, _griddata.groups));
        // if (isEmptyObj(Object.filter(documentPage.gridController.references, reference => reference.list === _griddata.id))) {
//        var gridReferences = [];
//        _editablepage.gridController.references.forEach(function (item) {
//            var id = item.list;
//            var name = me.editablePage.gridController.grids[id].caption;
//            gridReferences.push({id, name});
//        });
//        form.append(forms_select("Subgrid van: ", "option_subgridref", "option_subgridref", gridReferences, _griddata.subgrid));

        var gridsOnPage = [];
        Object.keys(_editablepage.gridController.LCMSGrids).forEach(function (item) {
            if (!item.includes("row")) {
                if (_editablepage.gridController.grids[item] === undefined) {
                    // delete _editablepage.gridController.LCMSGrids[item];
                } else {
                    var name = _editablepage.gridController.grids[item].caption;
                    gridsOnPage.push({item, name});
                }

            }
        });
        form.append(forms_select("Voeg als subgrid toe aan: ", "option_subgridof", "option_subgridof", gridsOnPage, _griddata.subgridof));

        // }
        var loadCompleteFunction = typeof _griddata.loadCompleteFunction !== "undefined" ? _griddata.loadCompleteFunction : "";
        form.append(forms_textbox("Load complete function", "option_loadCompleteFunction", "option_loadCompleteFunction", loadCompleteFunction));

        var extraOptionsJSON = typeof _griddata.extraOptionsJSON !== "undefined" ? _griddata.extraOptionsJSON : "";
        form.append(forms_textbox("Extra grid options", "option_extraOptionsJSON", "option_extraOptionsJSON", extraOptionsJSON));


        var deleteContentButton = $("<button type='button' style='margin-right: 5px;' class='btn btn-warning'>Verwijder inhoud</button>");
        form.append(deleteContentButton);
        deleteContentButton.on('click', function (e) {
            $("#" + _griddata.id).jqGrid("clearGridData", true);
        });
        var deleteTableButton = $("<button type='button' class='btn btn-danger'>Verwijder tabel</button>");
        form.append(deleteTableButton);
        deleteTableButton.on('click', function (e) {
            $("#" + _griddata.id).remove();
            $("#" + _griddata.id).jqGrid('GridUnload');
            $("#" + _griddata.id).jqGrid('GridDestroy');
            $("#gbox_" + _griddata.id).remove();
            _modal.modal('hide');
        });
        _parent.append(form);
        return form;
    }

    addHeader(parent) {
        var me = this;
        var row = $("<div class='row'></div>");
        row = me.addLabel(row, "Naam", 4);
        row = me.addLabel(row, "Type", 4);
        row = me.addLabel(row, "Verborgen", 2);
        row = me.addLabel(row, "", 2);
        parent.append(row);
        return parent;
    }

    addLabel(parent, text, colWidth) {
        var col = $("<div class='col-sm-" + colWidth + " mx-auto'></div>");
        var formGroup = $("<div class='form-group'></div>");
        var label = $("<label><center>" + text + "</center></label>");
        formGroup.append(label);
        col.append(formGroup);
        parent.append(col);
        return parent;
    }

    addElement(parent, element, colWidth, clazz) {
        var col = $("<div class='col-sm-" + colWidth + " mx-auto' style='text-align:center;top: 5px;'></div>");
        var formGroup = $("<div class='" + clazz + "'></div>");
        formGroup.append(element);
        col.append(formGroup);
        parent.append(col);
        return parent;
    }

    addRow(parent, elementID, colModelValue, _editablepage, _griddata, _rowParent) {
        console.log("addRow()");
        var me = this;
        var nameVal = colModelValue.name;
        var typeVal = colModelValue.edittype || colModelValue.formatter || colModelValue.template;
        var choiceList = colModelValue.editoptions;
        var visibleVal = colModelValue.hidden;
        var row = dom_div("row row-striped");
        var element1 = $("<input type='text' class='form-control' name='name' id='name-" + elementID + "' placeholder='fieldname'>");
        element1.val(nameVal);
        row = me.addElement(row, element1, 4, "form-group");
        var element2 = $("<select class='form-control' name='type' id='type-" + elementID + "'><option value='text'>Tekst</option><option value='number'>Getal</option><option value='boolean'>Ja/Nee</option><option value='euro'>Euro</option><option value='cktext_code'>Code</option><option value='date'>Datum</option><option value='cktext'>Tekst met opmaak</option><option value='select'>Keuzelijst</option><option value='internal_list' multiple='true'>Interne lijst</option><option value='external_list'>Externe lijst</option><option value='customformatter'>Aangepast</option></select>");
        if (typeVal === "textarea") {
            if (typeof colModelValue.editoptions !== "undefined") {
                if (colModelValue.editoptions.title === "ckedit") {
                    typeVal = "cktext";
                }
                if (colModelValue.editoptions.title === "ckedit_code") {
                    typeVal = "cktext_code";
                }
            }
        }
        if (typeVal === "select") {
            if (typeof colModelValue.editoptions !== "undefined") {
                if (colModelValue.editoptions.title === "internal_list") {
                    typeVal = "internal_list";
                }
                if (colModelValue.editoptions.title === "external_list") {
                    typeVal = "external_list";
                }
            }
        }

        if (typeVal === "checkbox") {
            typeVal = "booleanCheckbox";
        }
        if (colModelValue.sorttype === "number") {
            typeVal = "number";
        }
        if (colModelValue.sorttype === "date") {
            typeVal = "date";
        }
        if (typeof colModelValue.formatterName !== "undefined") {
            typeVal = "customformatter";
        }

        if (typeof typeVal !== "undefined") {
            if (typeVal.sorttype === "number") {
                typeVal = "number";
            }
        }

        element2.val(typeVal);
        row = me.addElement(row, element2, 4, "form-group");
        var element3 = $("<input type='checkbox' class='form-check-input' name='option_hidden' id='hidden-" + elementID + "' placeholder='fieldname'>");
        element3.attr("checked", visibleVal);
        row = me.addElement(row, element3, 2, "form-check");
        var element4 = $("<button type='button' class='btn btn-secondary'>X</button>");
        row = me.addElement(row, element4, 2, "form-group");
        element1.on('change', function (e) {
            if ($("#option_rename-name-" + elementID).length < 1 && typeof nameVal !== "undefined") {
                if (element1.val !== nameVal) {
                    element1.after(forms_hidden("option_rename-name-" + elementID, "option_rename", nameVal));
                }

            }
        });
        var currentRows = [];
        $.each(_editablepage.gridController.grids, function (a, b) {
            var id = a;
            var name = b.caption;
            currentRows.push({id, name});
        });
        element2.on('change', async function (e) {
            var val = this.value;
            if (this.value === 'select') {
                element2.after(forms_textarea('Keuzelijst', "choicelist-" + elementID, "choices"));
            } else {
                parent.find("div[id='" + "choicelist-" + elementID + "']").remove();
            }
            if (this.value === 'internal_list') {
                me.createInternalList(parent, element2, elementID, _editablepage);
            } else {
                parent.find("div[id='" + "select-" + elementID + "']").remove();
                parent.find("div[id='" + "select-attribute-" + elementID + "']").remove();
            }
            if (this.value === "customformatter") {
                element2.after(forms_select("Aangepast: ", "formatter-" + elementID, "formatterName", me.formatters, {}));
            }

        });

        if (typeVal === "select") {
            var choices = {};
            if (typeof choiceList !== "undefined") {
                choices = choiceList.value;
            }
            element2.after(forms_textarea('Keuzelijst', "choicelist-" + elementID, "choices", choices));
        }
        if (typeVal === "internal_list") {
            element2.after(forms_select("Kies attribuut: ", "select-attribute-" + elementID, "internalListAttribute", getAttributesOfGrid(colModelValue.internalListName), colModelValue.internalListAttribute));
            element2.after(forms_select("Kies tabel: ", "select-" + elementID, "internalListName", me.getGridsInDocument(), colModelValue.internalListName));
            element2.after(forms_hidden("option_multiple", "option_multiple", true));
        }
        if (typeVal === "customformatter") {
            element2.after(forms_select("Aangepast: ", "formatter-" + elementID, "formatterName", me.formatters, colModelValue.formatterName));

        }


        //als rij wordt toegevoegd kijken of formatter bestaat en zodoende toevoegen








//    if(choiceList.length){
//                
//    }

        element4.on('click', function (e) {
            row.remove();
        });
        _rowParent.append(row);
        return parent;
    }

    createInternalList(parent, insetAfterObject, elementID, _editablePage) {
        var obj = [];
        $.each(_editablePage.gridController.grids, function (a, b) {
            var id = a;
            var name = b.caption;
            obj.push({id, name});
        });
        var forms_select_internal_list = forms_select("Kies tabel: ", "select-" + elementID, "internalListName", obj, "");
        insetAfterObject.after(forms_select_internal_list);
        $("#select-" + forms_select_internal_list.attr("id")).on('change', function (e) {
            parent.find("div[id='" + "select-attribute-" + elementID + "']").remove();
            var obj = getAttributesOfGrid(this.value);
            var forms_select_attribute = forms_select("Kies attribuut: ", "select-attribute-" + elementID, "internalListAttribute", obj, "");
            forms_select_internal_list.after(forms_select_attribute);
        });
    }

    getGridsInDocument() {
        var obj = [];
        $("table[id^=grid]").each(function (a, b) {
            var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
            var id = $(b).attr('id');
            if (typeof id !== "undefined") {
                obj.push({id, name});
            }
        });
        return obj;
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
        this.colModel = [];
        var me = this;
        loadFormatters().then(
                function (result) {
                    me.formatters = result;
                }
        );
    }

    addGridButton(LCMSTemplateGridButton) {
        var gridData = this.gridData;
        $("#" + gridData.tableObject).navButtonAdd("#" + gridData.pagerID, {
            caption: LCMSTemplateGridButton.caption,
            title: LCMSTemplateGridButton.title,
            buttonicon: LCMSTemplateGridButton.icon,
            onClickButton: function () {
                LCMSTemplateGridButton.onClickFunction();
            },
            position: "last"
        });
    }

    toggle_multiselect() {
        var gridData = this.gridData;
        console.log("toggle_multiselect()");
        if ($('#' + gridData.tableObject + ' .cbox:visible').length > 0)
        {
            $('#' + gridData.tableObject).jqGrid('hideCol', 'cb');
            jQuery('.jqgrow').click(function () {
                jQuery('#' + gridData.tableObject).jqGrid('resetSelection');
                this.checked = true;
            });
        } else
        {
            $('#' + gridData.tableObject).jqGrid('showCol', 'cb');
            jQuery('.jqgrow').unbind('click');
        }
    }

    download_grid() {
        console.log("Download as CSV");
        var gridData = this.gridData;
        var selRows = $("#" + gridData.tableObject).jqGrid("getGridParam", "selarrrow");
        var data = $("#" + gridData.tableObject).jqGrid("getGridParam", "data");
        var selRowsData = Object.filter(data, item => selRows.includes(String(item.id)) === true);
        var arr = [];
        $.each(selRowsData, function (key, value) {
            arr.push(value);
        });
        var csv = Papa.unparse(JSON.stringify(arr));
        let csvContent = "data:text/csv;charset=utf-8," + csv;
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", $("#" + gridData.tableObject).jqGrid("getGridParam", "caption") + ".csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    }

    async export_as_html() {
        var gridData = this.gridData;
        var getFullRowData = this.getFullRowData;
        var callFullRowDataRequest = this.callFullRowDataRequest;
        console.log("exportToHTML()");
        var htmlData = $("<output id='tempOutput'>");
        htmlData.append("<link rel='stylesheet' href='./JS/dependencies/bootstrap/bootstrap_themes/flatly/bootstrap.min.css'>");
        //htmlData.append("<link rel='stylesheet' href='./CSS/style.css'>");
        //htmlData.append("<link rel='stylesheet' href='./HTML/validation/template/export.css'>");

        var style = $("<style>" + getCSSOfHref("./CSS/export.css") + getCSSOfHref("./CSS/style.css") + getCSS() + "</style>");
        htmlData.append(style);
        htmlData.append($($.parseHTML($(gridData.wrapperObject[0]).prop("innerHTML"))));
        var htmlTableObject = {};
        var tableData = {};
        if ($('#' + gridData.tableObject + ' .cbox:visible').length > 0) {

            var selRows = $("#" + gridData.tableObject).jqGrid("getGridParam", "selarrrow");
            //first download complete row data if this had been configured

            var selRowsData = Object.filter($("#" + gridData.tableObject).jqGrid('getGridParam').data, item => selRows.includes(String(item.id)) === true);
            var arr = [];
            async function callFullRowDataRequest(selRowsData) {
                console.log("start");
                var keys = Object.keys(selRowsData);
                for (var i = 0; i < keys.length; i++) {
                    var rowData = selRowsData[keys[i]];
                    let newRowData = await getFullRowData(gridData, rowData.id, rowData[gridData.jqGridOptions.idColumn]);
                    arr.push(newRowData); //$("#" + gridData.tableObject).jqGrid ('getRowData', rowId);
                    console.log("pushing data to export...");
                }
                console.log("end");
            }


            await callFullRowDataRequest(selRowsData);
            tableData = arr;
        } else {
            tableData = $("#" + gridData.tableObject).jqGrid('getGridParam').data;
        }

        htmlTableObject = buildHtmlTable(tableData);
        htmlData.find(("div[id^=gbox_]")).each(function (a, b) {
            var htmlTable = "<table class='table'>" + htmlTableObject[0].innerHTML + "</table>";
            $(b).after("<div name='" + $(b).attr('id') + "' style='overflow-x:auto'>" + htmlTable + "</div>");
            $(b).remove();
        });
        let imageController = new LCMSImageController();
        var images = imageController.loadImages("", htmlData);
        var imagesLoadedCounter = 0;
        if (images.length > 0) {
            images.each(function (index) {
//htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith($(images[index]));
                imageController.toDataURL($(images[index]).attr('src'), function (dataUrl) {
                    htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith("<img src='" + dataUrl + "' >");
                    bootstrap_alert.warning('Images loaded: ' + imagesLoadedCounter, 'success', 1000);
                    if (imagesLoadedCounter === images.length - 1) {
                        htmlData.find("div").attr("contenteditable", false);
                        openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
                    }
                    imagesLoadedCounter++;
                });
            });
        } else {
            openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
        }



//        var images = loadImages("", htmlData);
//        var imagesWrapper = $("<div></div>");
//        let imageController = new LCMSImageController();
//        var allImagesLoaded = false;
//        var imagesLoadedCounter = 0;
//        images.each(function (index) {
//            //htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith($(images[index]));
//            imageController.toDataURL($(images[index]).attr('src'), function (dataUrl) {
//
//                htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith("<img src='" + dataUrl + "' >");
//
//                bootstrap_alert.warning('Images loaded: ' + imagesLoadedCounter, 'success', 1000);
//                if (imagesLoadedCounter === images.length - 1) {
//                    htmlData.find("div").attr("contenteditable", false);
//                    openFile("test.html", "<div class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
//
//                }
//                imagesLoadedCounter++;
//
//            });
//        });
    }

    datetimeformatter(cellvalue, options, rowObject) {
        console.log("creating datetimeformat()");
        return moment(cellvalue).utcOffset(60).format("Y-MM-DD H:mm");
    }

    async loadFormatters() {
        return loadFormatters();
    }

    createColModel(_data) {
        console.log("createColModel from Data()");
        var cols = new Array();
        var view = [];
        var me = this;

        //first do async stuff

        $.each(_data, function (index, value) {
            var column = {};
            column.label = value.name;
            column.name = value.name;
            var type = value.type || value.edittype;
            if (typeof type === "undefined") {
                type = value.formatter;
            }
            if (type === "textarea" && value.editoptions.title === "ckedit") {
                type = "cktext";
            }
            if (type === "textarea" && value.editoptions.title === "ckedit_code") {
                type = "cktext_code";
            }

            //column.editable = true;

            if (type === "date" || value.formatter === "date") {
                column.formatoptions = {srcformat: "u1000", newformat: "Y-m-d H:i"};
                column.formatter = "date";

                column.sorttype = "date";
                column.editoptions = {dataInit: initDateEdit};
            }
            if (type === "number") {
                column.template = numberTemplate;
            }
            if (type === "timespan") {
                column.template = numberTemplate;
            }
            if (type === "datetime") {
                //column.formatoptions = {srcformat: "u1000", newformat: "d-m-y h:i"};
                column.formatter = me.datetimeformatter;
                column.type = "datetime";
                //column.sorttype = "date";
                column.editoptions = {dataInit: initDateTimeEdit};
            }

            if (type === "text" && typeof value.formatterName === "undefined") {
                column.edittype = "text";
            }
            if (type === "cktext") {
                column.edittype = "textarea";
                column.editoptions = {title: "ckedit"};
                column.formatter = function (cellvalue, options, rowObject) {
                    var div = $("<div></div>");
                    div.append(cellvalue);
                    return div.html();
                };
            }
            if (type === "cktext_code") {
                column.edittype = "textarea";
                column.editoptions = {title: "ckedit_code"};
            }
            if (type === "boolean") {
                column.template = "booleanCheckbox";
            }

            if (typeof value.formatterName !== "undefined") {

                column.type = "text";
                column.formatterName = value.formatterName;
                column.formatterFunction = Object.filter(me.formatters, f => f.name === value.formatterName);
                column.formatter = column.formatterFunction[value.formatterName];



            }

            if (type === "select") {// && typeof value.editoptions === "undefined") {
                column.edittype = "select";
                column.formatter = "select";
                column.width = "200";
                if (typeof value.choices !== "undefined") {
                    if (value.choices.constructor.name === "String") {
                        value.choices = JSON.parse(value.choices);
                    }
                }
                if (typeof column.editoptions === "undefined") {
                    column.editoptions = {};
                }
                column.editoptions.multiple = value.multiple;
                column.editoptions.value = typeof value.choices !== "undefined" ? value.choices : value.editoptions.value;
                var choices = {};
                $.each(column.editoptions.value, function (a, b) {
                    choices[a] = b;
                });
                column.editoptions.value = choices;
                if (value.multiple === true) {
                    column.editoptions.size = value.choices.length < 8 ? value.choices.length + 2 : 10;
                }


            }

            if ((typeof value.editoptions !== "undefined" && value.editoptions.title === "internal_list") || type === "internal_list") {
                value.type = "select";
                column.edittype = "select";
                column.formatter = "select";
                column.editoptions = {title: "internal_list", multiple: true};
                column.internalListName = value.internalListName;
                column.internalListAttribute = value.internalListAttribute;
            }
            if ((typeof value.editoptions !== "undefined" && value.editoptions.title === "external_list") || type === "internal_list") {
                value.type = "select";
                column.editoptions = {title: "external_list"};
            }

            if (type === "password" || type === "encrypted") {
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
                column.editable = "disabled";
            } else {
                column.editable = true;
            }
            if (value.creatable === false) {
                column.creatable = false;
            } else {
                column.creatable = true;
            }
            column.editrules = value.editrules;
            if (value.visibleOnForm !== undefined) {
                if (value.visibleOnForm === true) {
                    column.editrules = {edithidden: true};
                } else {
                    column.editrules = {edithidden: false};
                }
            }


            if (typeof value.searchoptions !== "undefined") {
                column.searchoptions = value.searchoptions;
            }
            if (typeof value.formatter !== "undefined") {
                column.formatter = value.formatter;
            }
            if (typeof value.classes !== "undefined") {
                column.classes = value.classes;
            }
            if (typeof value.summaryTpl !== "undefined") {
                column.summaryTpl = value.summaryTpl;
            }
            if (typeof value.summaryType !== "undefined") {
                column.summaryType = value.summaryType;
            }
            if (typeof value.sorttype !== "undefined") {
                column.sorttype = value.sorttype;
            }


            if (typeof value.width !== 'undefined' && typeof value.lso === "undefined") {
                column.width = value.width;
            }

            view.push(column);
        });
        console.log("Generating view");
        me.colModel = view;
        return view;
    }

    async createGridOptions(subgridTableId, extraOptions) {


        console.log("createGridOptions()");
        var me = this;
        let promise = new Promise((res, rej) => {
            res(me.loadFormatters());
            //  res("Now it's done!");
        });
        let value = await promise;

        me.formatters = value;

        var gridData = me.gridData;
        var colModelData = {};
        var tabelData = {};
        if (typeof me.gridData.data.header === "string") {
            colModelData = JSON.parse(me.gridData.data.header);
        } else {
            colModelData = me.gridData.data.header;
        }
        if (typeof me.gridData.data.table === "string") {
            tabelData = JSON.parse(me.gridData.data.table);
        } else {
            tabelData = me.gridData.data.table;
        }

        me.createColModel(colModelData);
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
            colModel: me.colModel,
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
            pager: "#pager_" + subgridTableId,
            caption: "",
            onSelectRow: function (rowid) {
                if (typeof gridData.jqGridOptions.selectToEdit !== "undefined") {
                    if (gridData.jqGridOptions.selectToEdit === true) {
                        me.popupEdit(rowid);
                    }
                }
            },
            newItem: me.popupEdit,
            colModelData: colModelData,
            pgbuttons: typeof tabelData !== "undefined" ? tabelData.length > 40 : false,
            pgtext: "",
            multiselect: true,
            pginput: false

        };
        var parameters = {
            navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
                addParams: {
                    position: "last",
                    addRowParams: {
                        keys: true,
                        extraparam: {oper: 'add', action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
                    }
                },
                editParams: {
                    editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                        extraparam: {action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}

                    }//23045
                }
            }
        };

        if (typeof me.gridData.jqGridOptions !== "undefined") {
            if (typeof me.gridData.jqGridOptions.summaries !== "undefined") {
                jqgridOptions.summaries = me.gridData.jqGridOptions.summaries;
                jqgridOptions.footerrow = true;
                jqgridOptions.userDataOnFooter = true;
            }
            if (typeof me.gridData.jqGridOptions.groups !== "undefined") {

                jqgridOptions.grouping = true;
                jqgridOptions.groupingView = {
                    groupField: me.gridData.jqGridOptions.groups,
                    groupText: ['<b>{0} - {1} Item(s) </b>'],
                    showSummaryOnHide: false,
                    groupColumnShow: [true],
                    groupSummaryPos: ["footer"],
                    groupSummary: [false]

                };
            } else {
                jqgridOptions.grouping = false;
            }
            if (typeof me.gridData.jqGridOptions.subgrid !== "undefined") {
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
            $.each(me.gridData.jqGridOptions, function (i, n) {
                if (i !== "colModel") {
                    jqgridOptions[i] = n;
                }

            });
        }





        $.each(extraOptions, function (i, n) {
            if (i !== "colModel") {
                jqgridOptions[i] = n;
            }

        });
        jqgridOptions.loadComplete = function () {
            console.log("firing loadComplete");
            var grid = $(this);
            grid.jqGrid('hideCol', 'cb');
            var subGridCells = $("td.sgcollapsed", grid[0]);
            if (typeof gridData.jqGridOptions !== "undefined") {
                if (typeof gridData.jqGridOptions.summaries !== "undefined") {
                    var sumJson = {};
                    var grid = $(this);
                    gridData.jqGridOptions.summaries.forEach(function (a) {
                        sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
                    });
                    $(this).jqGrid("footerData", "set", sumJson);
                }
            }
        };
        jqgridOptions.colModel = jqgridOptions.colModel.filter(function (el) {
            return el !== null;
        });


        var lastSelection;
        function editRow(id) {
            if (id && id !== lastSelection) {
                var grid = $("#" + me.gridData.tableObject);
                grid.jqGrid('restoreRow', lastSelection);
                grid.jqGrid('editRow', id, parameters.editParameters);
                lastSelection = id;
            }
        }


        return jqgridOptions;
    }

    async createGrid() {

        console.log("createGrid()");
        var me = this;
        var gridObject;
        await me.loadFormatters().then(
                function (result) {
                    me.formatters = result;

                    var gridData = me.gridData;
                    var colModelData = {};
                    var tabelData = {};
                    if (typeof me.gridData.data.header === "string") {
                        colModelData = JSON.parse(me.gridData.data.header);
                    } else {
                        colModelData = me.gridData.data.header;
                    }
                    if (typeof me.gridData.data.table === "string") {
                        tabelData = JSON.parse(me.gridData.data.table);
                    } else {
                        tabelData = me.gridData.data.table;
                    }

                    me.createColModel(colModelData);
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
                        colModel: me.colModel,
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
                        onSelectRow: function (rowid) {
                            if (typeof gridData.jqGridOptions.selectToEdit !== "undefined") {
                                if (gridData.jqGridOptions.selectToEdit === true) {
                                    me.popupEdit(rowid);
                                }
                            }
                        },
                        newItem: me.popupEdit,
                        colModelData: colModelData,
                        pgbuttons: tabelData.length > 40,
                        pgtext: "",
                        multiselect: true,
                        pginput: false

                    };
                    var parameters = {
                        navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
                            addParams: {
                                position: "last",
                                addRowParams: {
                                    keys: true,
                                    extraparam: {oper: 'add', action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
                                }
                            },
                            editParams: {
                                editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                                    extraparam: {action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}

                                }//23045
                            }
                        }
                    };
                    if (typeof me.gridData.jqGridOptions.summaries !== "undefined") {
                        jqgridOptions.summaries = me.gridData.jqGridOptions.summaries;
                        jqgridOptions.footerrow = true;
                        jqgridOptions.userDataOnFooter = true;
//            jqgridOptions.loadComplete = function () {
//                var sumJson = {};
//                var grid = $(this);
//                gridData.jqGridOptions.summaries.forEach(function (a) {
//                    sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
//                });
//                $(this).jqGrid("footerData", "set", sumJson);
//            };
                    }
                    if (typeof me.gridData.jqGridOptions.groups !== "undefined") {

                        jqgridOptions.grouping = true;
                        jqgridOptions.groupingView = {
                            groupField: me.gridData.jqGridOptions.groups,
//                groupColumnShow: [true],
                            groupText: ['<b>{0} - {1} Item(s) </b>'],
//                groupCollapse: false,
//                groupSummaryPos: ["header"],
//                groupSummary: [false]


                            //hideFirstGroupCol: true,
                            showSummaryOnHide: false,
                            groupColumnShow: [true],
                            groupSummaryPos: ["footer"],
                            groupSummary: [false]

                        };
                    } else {
                        jqgridOptions.grouping = false;
                    }
                    if (typeof me.gridData.jqGridOptions.subgrid !== "undefined") {
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

                    $.each(me.gridData.jqGridOptions, function (i, n) {
                        if (i !== "colModel") {
                            jqgridOptions[i] = n;
                        }

                    });

                    if (jqgridOptions["url"] !== undefined) {
                        console.log("Detected url data, removing data-key");
                        delete jqgridOptions["data"];
                    }

                    jqgridOptions.loadComplete = function () {
                        console.log("firing loadComplete");
                        var grid = $(this);
                        grid.jqGrid('hideCol', 'cb');
                        var subGridCells = $("td.sgcollapsed", grid[0]);
                        if (typeof gridData.jqGridOptions.summaries !== "undefined") {
                            var sumJson = {};
                            var grid = $(this);
                            gridData.jqGridOptions.summaries.forEach(function (a) {
                                sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
                            });
                            $(this).jqGrid("footerData", "set", sumJson);
                        }


                    };
                    jqgridOptions.colModel = jqgridOptions.colModel.filter(function (el) {
                        return el !== null;
                    });
                    $("#" + me.gridData.tableObject).jqGrid(jqgridOptions);
                    replaceProperties(parameters, me.gridData.jqGridParameters);
                    var lastSelection;
                    function editRow(id) {
                        if (id && id !== lastSelection) {
                            var grid = $("#" + me.gridData.tableObject);
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

                    $("#" + me.gridData.tableObject).inlineNav("#" + me.gridData.pagerID, parameters.navGridParameters);
                    $("#" + me.gridData.tableObject).jqGrid("filterToolbar");
                    $(window).bind('resize', function () {
                        if (gridData.wrapperObject.width() > 100) {
                            $("#" + gridData.tableObject).setGridWidth(gridData.wrapperObject.width() - 10);
                        }
                    }).trigger('resize');
                    $("#" + me.gridData.tableObject).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {
                        $(".ui-jqgrid-titlebar-close", this).click();
                    });
                    $("#" + me.gridData.tableObject).click(function (e) {
                        me.gridClickFunctions(e, $(this));
                    });
                    gridObject = $("#" + me.gridData.tableObject);

                }
        );

        return gridObject;

    }

    gridClickFunctions(e, target) {
        var $groupHeader = $(e.target).closest("tr.jqgroup");
        if ($groupHeader.length > 0) {
            target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
            target.css('cursor', 'pointer');
//            var index = gridIds.map(function (e) {
//                return e.gridid;
//            }).indexOf(target.attr('id'));
//
//            var indexofClickItem = gridIds[index].gridexpandedgroups.find(function (a) {
//                return a === $groupHeader.attr("id")
//            });
//            if (typeof indexofClickItem !== "undefined") {
//                gridIds[index].gridexpandedgroups.splice(indexofClickItem, 1);
//            } else {
//                gridIds[index].gridexpandedgroups.push($groupHeader.attr("id"));
//            }
        }

        $groupHeader = $(e.target).closest("span.tree-wrap");
        if ($groupHeader.length > 0) {
            target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
        }

    }

    async getFullRowData(_gridData, _id, _rowId) {
        let request = await LCMSRequest("./servlet", {action: _gridData.jqGridOptions.getAction, k: _gridData.jqGridOptions.idColumn, v: _rowId});
        async function onDone(data, _id, gridData) {
            var grid = $("#" + gridData.tableObject);
            grid.jqGrid('setRowData', _id, $.parseJSON(data));
            return $.parseJSON(data);
        }
        let afterRequest = await onDone(request, _id, _gridData);
        return afterRequest;
    }

    async popupEdit(_action, _afterSubmitFunction) {
        var me = this;
        var gridData = this.gridData;
        var grid = $("#" + gridData.tableObject);
        console.log("new item");
        if (_action !== "new" && typeof this.gridData.jqGridOptions.getAction !== "undefined") {
            var id = _action;
            try {
                var rowData = grid.jqGrid('getRowData', _action);
                var id = rowData[this.gridData.jqGridOptions.idColumn];
            } catch (e) {

            }
            if (typeof id === "undefined") {
                id = _action;
            }
            let fullRowDataRequest = await this.getFullRowData(gridData, _action, id);
        }
        if (_action === "new") {
            $.each(Object.values(Object.filter(grid.jqGrid("getGridParam").colModel, model => model.creatable === true)), function (index, val) {
                val.editable = true;
            });
        }

        grid.jqGrid('editGridRow', _action, {
            reloadAfterSubmit: false,
            beforeShowForm: function (formid) {
                $("textarea[title=ckedit]").each(function (index) {
                    $(this).replaceWith("<div contenteditable='true' title=ckedit id='" + $(this).attr("id") + "'>" + $(this).val() + "</div>");
                });
                $("textarea[title=ckedit_code]").each(function (index) {
                    //$(this).replaceWith("<div contenteditable='true' title=ckedit id='" + $(this).attr("id") + "'>" + $(this).val() + "</div>");
                    CodeMirror.fromTextArea($(this));
                });
                $("div[title=ckedit]").each(function (index) {
                    $(this).addClass("border rounded p-3");
                    //   buildEditablePage("{\"parameters\":{\"public\":false},\"webPage\":\"\", \"grids\": {}}", $(this));
                    CKEDITOR.inline($(this).attr('id'));
                });
            },
            afterShowForm: function (formid) {
                var pills = me.createPills(formid);
                $("div[id^=editmod]").css('position', 'absolute');
                $("div[id^=editmod]").css('top', '5%');
                $("div[id^=editmod]").css('width', '90%');
                $("div[id^=editmod]").css('display', 'inline-block');
                $("div[id^=editmod]").css('margin-left', '5%');
                $("div[id^=editmod]").css('margin-right', '5%');
                $("div[id^=editmod]").css('left', '');
//                $("textarea[title=ckedit]").each(function (index) {100
//                    CKEDITOR.replace($(this).attr('id'), {
//                        customConfig: ' '
//                    });  
//                  //  CKEDITOR.inline($(this).attr('id'));
//                });

                scrollTo($($("input")[0]));
            },
            onclickSubmit: function (params, postdata) {
                console.log("onclickSubmit()");

//                $.each($("#FrmGrid_" + this.id).find("[type=checkbox]"), function (a, b) {
//                    $(b).val(b.checked);
//                });
                var postdata = $("#FrmGrid_" + this.id).serializeObject();
                var serialized = $("#FrmGrid_" + this.id).find("[type=checkbox]").map(function () {
                    postdata[this.name] = this.checked ? this.value : "false";
                });
                $("div[title=ckedit]").each(function (index) {
                    var editorname = $(this).attr('id');
                    var editorinstance = CKEDITOR.instances[editorname];
                    var text = editorinstance.getData();
                    text = removeElements("nosave", text);
                    postdata[editorname] = text;
                });
                var colModel = $("#" + this.id).jqGrid("getGridParam").colModel;
                var filteredModel = Object.filter(colModel, function (a) {
                    console.log(a.type);
                    if (a.formatter === "date" || a.type === "datetime") {
                        //postdata[a.name] = moment().valueOf();// return moment(cellvalue).utcOffset(60).format("Y-MM-DD H:mm");
                        postdata[a.name] = moment(postdata[a.name]).valueOf();
                    } else {
                        return false;
                    }
                    ;
                });
                $.each(filteredModel, function (a, b) {
                    var value = postdata[b.label];
                    if (value === "") {
                        postdata[b.label] = moment().valueOf();
                    } else {
                        postdata[b.label] = moment(value).valueOf();
                    }

                });
                return postdata;
            },
            beforeSubmit: function (postdata, formid) {
                console.log("Checking post data");
            },
            afterComplete: function (response, postdata, formid) {
                $("#cData").trigger("click");
                bootstrap_alert.warning('Rij toegevoegd', 'info', 1000);
                $(this).trigger("reloadGrid");
                _afterSubmitFunction();
            },
            editData: {action: gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
        }

        );
        return "done";
    }

    createPills(form) {
        var me = this;
        var pills = [];
        if (typeof me.gridData.data.header === "string") {
            me.gridData.data.header = JSON.parse(me.gridData.data.header);
        }
        var header = $.extend(true, [], me.gridData.data.header);
        var tabId = uuidv4();
        pills.push("Algemeen");
        $(form).find("tr[data-rowpos]").each(function () {
            if ($(this).find("td.DataTD").find("div[title='ckedit']").length > 0) {
                var rowId = ($($(this).find("td.DataTD").find("div[title='ckedit']")).attr("id"));
                var headerItem = Object.filter(me.gridData.data.header, obj => obj.name === rowId);
                var tableName = headerItem[Object.keys(headerItem)[0]].tablename;
                var tableAttr = lang[tableName] === undefined ? rowId : lang[tableName][rowId];
                pills.push(tableAttr);


            }
            ;
        });
        $(form).append(dom_nav(pills, tabId));
        $(form).find("tr[data-rowpos]").each(function () {
            if ($(this).find("td.DataTD").find("div[title='ckedit']").length > 0) {
                console.log(header);
                var rowId = ($($(this).find("td.DataTD").find("div[title='ckedit']")).attr("id"));
                var headerItem = Object.filter(me.gridData.data.header, obj => obj.name === rowId);
                var tableName = headerItem[Object.keys(headerItem)[0]].tablename;
                var tableAttr = lang[tableName] === undefined ? rowId : lang[tableName][rowId];
                var rowIndex = pills.indexOf(tableAttr);
                if (rowIndex > 0) {
                    $("#" + (rowIndex) + "-tab").append((this));
                }
            } else {
                $("#0-tab").append((this));
            }

        });
        $("#" + tabId + " a[id='0-pill']").tab('show');
        console.log(pills);
        return pills;
    }

}

class LCMSImageController {
    constructor(publicPage) {
        this.publicPage = publicPage;
    }

    uploadFile() {}

    loadImages(editor, editorObject) {
        var me = this;
        var _editorObject;
        if (editor !== "") {
            var images = $("#" + editor).find('[fileid]');
            if (images.length < 1) {
                images = $("#cke_" + editor).find("iframe").contents().find('[fileid]');
            }
            _editorObject = $("#" + editor);
        } else {
            var images = editorObject.find('[fileid]');
            _editorObject = editorObject;
        }
        images.each(function (index) {
            var newImage = me.downloadToTemp($(this));
            _editorObject.find('[fileid]')[index] = newImage;
        });
        return images;
    }

    downloadToTemp(file) {
        var formData = new FormData();
        formData.append('action', 'FILE_DOWNLOADTEMP');
        formData.append('LCMS_session', $.cookie('LCMS_session'));
        formData.append('public', this.publicPage);
        formData.append('filename', file.attr("name"));
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var jsonData = JSON.parse(request.responseText);
                var filePath = jsonData.filePath;
                console.log("Changing filepath from " + file.attr("src") + " to " + filePath);
                file.attr("src", filePath);
                file.attr("href", filePath);
                return file;
            }
        }
        request.open('POST', "./upload", /* async = */ false);
        request.send(formData);
    }

    insertFileInEditor(_fileName, _fileId, _ckeditor) {
        var re = /(?:\.([^.]+))?$/;
        var type = re.exec(_fileName)[0];
        var formData = new FormData();
        var ckeditor = CKEDITOR.instances[_ckeditor.attr('id')];
        formData.append('action', 'FILE_DOWNLOADTEMP');
        formData.append('LCMS_session', $.cookie('LCMS_session'));
        formData.append('public', this.publicPage);
        formData.append('filename', _fileName);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                var jsonData = JSON.parse(request.responseText);
                var filePath = jsonData.filePath;
                if (type === ".png" || type === ".jpg" || type === ".JPG" || type === ".gif" || type === ".PNG") {
                    ckeditor.insertHtml("<div style='overflow-x:auto'><img name='" + _fileName + "' fileid='" + _fileId + "' src='" + filePath + "'/></div>");
                } else {
                    ckeditor.insertHtml("<a name='" + _fileName + "'  href='" + filePath + "' fileid='" + _fileId + "'>" + _fileName + "</a>");
                }
            }
        };
        request.open('POST', "./upload", /* async = */ false);
        request.send(formData);
    }

//    encodeImage(imageUri, callback) {
//        var c = document.createElement('canvas');
//        var ctx = c.getContext("2d");
//        var img = new Image();
//        img.crossOrigin = "";
//        img.onload = function () {
//            c.width = this.width;
//            c.height = this.height;
//            ctx.drawImage(img, 0, 0);
//            var dataURL = c.toDataURL("image/jpeg");
//            callback(dataURL);
//        };
//        img.src = imageUri;
//    }

//    encodeImage(imageUri) {
//        fetch(imageUri)
//                .then(res => res.blob())
//                .then(blob => {
//                    const file = new File([blob], 'dot.png', blob);
//                    console.log(file);
//                    
//                });
//    }

    toDataURL(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function () {
            var fileReader = new FileReader();
            fileReader.onloadend = function () {
                callback(fileReader.result);
            };
            fileReader.readAsDataURL(httpRequest.response);
        };
        httpRequest.open('GET', url);
        httpRequest.responseType = 'blob';
        httpRequest.send();
    }

    urltoFile(url, filename, mimeType) {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
        return (fetch(url)
                .then(function (res) {
                    return res.arrayBuffer();
                })
                .then(function (buf) {
                    return new File([buf], filename, {type: mimeType});
                })
                );
    }

}

function getPostDataFromUrl() {

}

async function LCMSRequest(_url, _data, _onDone, _extraParam) {


    if (!_data.__proto__.toString().includes("FormData")) {
        _data['LCMS_session'] = $.cookie('LCMS_session');
    }

    var ajaxParameters = {
        method: "POST",
        url: _url,
        data: _data, //{action: "VALIDATION_GETVALIDATION", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    };
    $.each(_extraParam, function (key, value) {
        ajaxParameters[key] = value;
    });
    return await $.ajax(ajaxParameters).done(function (data) {

        if (typeof _onDone !== "undefined") {
            _onDone(data);
        }
        return data;
        //bootstrap_alert.warning('Success', 'success', 1000);        
    }).fail(function (jqXHR, textStatus, errorThrown) {
//bootstrap_alert.warning('Something went wrong + \n ' + errorThrown, 'error', 5000);
        console.log(errorThrown);
    });
}

function getPatches(oldData, newData) {
    console.log("getPatches()");
    //oldData = btoa(oldData);
    //newData = btoa(newData);
    var dmp = new diff_match_patch();
    // var diff = dmp.diff_main((oldData), (newData));
    var diff = dmp.diff_main((oldData), (newData));
    //  dmp.diff_cleanupSemantic(diff);
    var patches = dmp.patch_make(diff);
    var textPatches = dmp.patch_toText(patches);
    return textPatches;
}

function getPatchesReverse(oldData, newData) {
    console.log("getPatches()");
    var dmp = new diff_match_patch();
    // var diff = dmp.diff_main((oldData), (newData));
    var diff = dmp.diff_main((newData), (oldData));
    //  dmp.diff_cleanupSemantic(diff);
    var patches = dmp.patch_make(diff);
    var textPatches = dmp.patch_toText(patches);
    return (textPatches);
}

async function LCMSTableRequest(loadAction, editAction, editUrl, tableName, pagerName, wrapperName, caption, tableType, jqGridOptions, extraRequestOptions, LCMSEditablePageObject) {

    function onDone(data) {
        try {
            var jsonData = JSON.parse(data);
            console.log(jsonData.webPage);
            if (typeof jsonData.webPage !== 'undefined') {
                jsonData.parent = _parent;
                loadParameters(jsonData);
            } else {
                var LCMSGrid = {};
                if (tableType === 1) {
                    LCMSGrid = LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                } else if (tableType === 2) {
                    LCMSGrid = LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                } else if (tableType === 3) {
                    LCMSGrid = LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                } else {
                    LCMSGrid = LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                }
                if (typeof LCMSEditablePageObject !== "undefined") {
                    LCMSEditablePageObject.gridController.addLCMSGrid(LCMSGrid.gridData.tableObject, LCMSGrid);
                }
            }
        } catch (e) {
            console.log(e);
        }

    }
    var requestOptions = {};
    if (typeof extraRequestOptions !== "undefined") {
        console.log("extraRequestOptions");
        requestOptions = extraRequestOptions;
    }
    requestOptions.action = loadAction;
    return LCMSRequest(editUrl, requestOptions, onDone);
}

function LCMSTableFromData(loadAction, editAction, editUrl, tableName, pagerName, wrapperName, caption, tableType, jqGridOptions, extraRequestOptions, data) {
    console.log("LCMSTableFromData()");
    var jsonData = JSON.parse(data);
    console.log(jsonData.webPage);
    if (typeof jsonData.webPage !== 'undefined') {
        jsonData.parent = wrapperName;
        loadParameters(jsonData);
    } else {
        if (tableType === 1) {
            return LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
        } else if (tableType === 2) {
            return LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
        } else if (tableType === 3) {
            return LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
        } else {
            return LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
        }
    }

//    var requestOptions = {};
//    if (typeof extraRequestOptions !== "undefined") {
//        console.log("extraRequestOptions");
//        requestOptions = extraRequestOptions;
//    }
//    requestOptions.action = loadAction;


// return LCMSRequest(editUrl, requestOptions, onDone);
}


function LCMSGridTemplateSimple(_jqGridOptions, _editAction, _editUrl, _tableName, _wrapperObject) {
    var gridData = {
        data: {header: _jqGridOptions.colModel, table: _jqGridOptions.data},
        editAction: _editAction,
        editUrl: _editUrl,
        tableObject: _tableName,
        pagerID: _tableName + "_pager",
        wrapperObject: _wrapperObject,
        jqGridOptions: {
            onSelectRow: function (rowid) {
                return popupEdit(rowid, $("#" + _tableName), $("body"), "_editAction");
            },
            caption: _jqGridOptions.caption
        },
        jqGridParameters: {
            navGridParameters: {add: false}
        }
    };
    let LcmsGrid = new LCMSGrid(gridData);
    try {
        $("#" + _tableName).jqGrid('setGridWidth', 300);

    } catch (e) {

    }

    return LcmsGrid;
}

function LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
    try {
        if (typeof jsonData.table === "string") {
            jsonData.table = $.parseJSON(jsonData.table);
        }
        if (typeof jsonData.header === "string") {
            jsonData.header = $.parseJSON(jsonData.header);
        }
    } catch (e) {

    }



    var gridData = {
        data: jsonData,
        editAction: editAction, //"LAB_EDITDEPARTMENT",
        editUrl: editUrl, // "./lab",
        tableObject: tableName, //("department-table"),
        pagerID: pagerName, //"department-pager",
        wrapperObject: $("#" + wrapperName),
        jqGridOptions: {
            grouping: false,
            caption: caption, //lang["department"]['title']
        },
        jqGridParameters: {
            navGridParameters: {add: false, cancel: false, save: false, keys: true}
        }
    };
    if (typeof jqGridOptions !== "undefined") {
        $.each(jqGridOptions, function (i, n) {
            gridData.jqGridOptions[i] = n;
        });
    }
    let lcmsGrid = new LCMSGrid(gridData);
    lcmsGrid.createGrid();
    return lcmsGrid;
}

function LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
    console.log("LCMSGridTemplateStandard()");
    var gridData = {
        data: jsonData,
        editAction: editAction, //"LAB_EDITDEPARTMENT",
        editUrl: editUrl, // "./lab",
        tableObject: tableName, //("department-table"),
        pagerID: pagerName, //"department-pager",
        wrapperObject: $("#" + wrapperName),
        jqGridOptions: {
            grouping: false,
            caption: caption //lang["department"]['title']
        },
        jqGridParameters: {
            navGridParameters: {add: false, cancel: true, save: true, keys: true}
        }
    };
    if (typeof jqGridOptions !== "undefined") {
        $.each(jqGridOptions, function (i, n) {
            gridData.jqGridOptions[i] = n;
        });
    }
    let lcmsGrid = new LCMSGrid(gridData);
    lcmsGrid.createGrid().then(
            function (result) {
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
                    return lcmsGrid.popupEdit("new", function () {
                        return null;
                    });
                }));
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
                    var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
                    if (rowid !== null) {
                        return lcmsGrid.popupEdit(rowid, function () {
                            return null;
                        });
                    } else {
                        return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
                    }
                }));
            }
    );
    return lcmsGrid;
}

function LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
    try {
        if (typeof jsonData.table === "string") {
            jsonData.table = $.parseJSON(jsonData.table);
        }
        if (typeof jsonData.header === "string") {
            jsonData.header = $.parseJSON(jsonData.header);
        }
    } catch (e) {

    }
    var gridData = {
        data: jsonData,
        editAction: editAction, //"LAB_EDITDEPARTMENT",
        editUrl: editUrl, // "./lab",
        tableObject: tableName, //("department-table"),
        pagerID: pagerName, //"department-pager",
        wrapperObject: $("#" + wrapperName),
        jqGridOptions: {
            caption: caption //lang["department"]['title']
        },
        jqGridParameters: {
            navGridParameters: {add: false, cancel: true, save: true, keys: true}
        }
    };
    $.each(jqGridOptions, function (i, n) {
        gridData.jqGridOptions[i] = n;
    });
    let lcmsGrid = new LCMSGrid(gridData);
    lcmsGrid.createGrid().then(
            function (result) {
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
                    return lcmsGrid.popupEdit("new", function () {
                        return null;
                    });
                }));
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
                    var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
                    if (rowid !== null) {
                        return lcmsGrid.popupEdit(rowid, function () {
                            return null;
                        });
                    } else {
                        return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
                    }
                }));
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-download", "Export", "", function () {
                    return lcmsGrid.export_as_html();
                }));
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-arrow-down", "Download as CSV", "", function () {
                    return lcmsGrid.download_grid();
                }));
                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-list-ul", "Click here to change columns", "", function () {
                    return lcmsGrid.toggle_multiselect($("#" + gridData.tableObject).jqGrid('getGridParam', 'id'));
                }));
            }
    );

    return lcmsGrid;
}

function LCMSTemplateGridButton(icon, title, caption, onClickFunction) {
    this.icon = icon;
    this.title = title;
    this.caption = caption;
    this.onClickFunction = onClickFunction;
}

function buildEditablePage(data, _parent, _originalDocument, _pageData) {
    console.log("buildDocumentPage()");
    var jsonData = JSON.parse(data, _parent);
    var publicPage = typeof jsonData.parameters.public !== "undefined" ? jsonData.parameters.public : false;
    var pageData = {loadAction: "getpage", editAction: "editpages", editUrl: "./servlet", pageId: "", idName: "editablepageid"};
    if (typeof _pageData !== "undefined") {
        pageData = _pageData;
    }
    config2(publicPage);
    documentPage = new LCMSEditablePage(pageData, _parent);
    documentPage.buildPageData(data, _originalDocument);
    // documentPage.setPageId($($("div[id^='wrapper']")[0]).attr("id").substring(8));
}

function editablePage_getPage(_parent) {
    console.log("editablePage_getPage()");
    function onDone(data) {
        buildEditablePage(data, _parent);
    }
    var _v = getUrlParam(window.location.href, "v");
    var _k = getUrlParam(window.location.href, "k");
    if (_v === "" || _k === "") {
        LCMSRequest("./servlet", {action: "getpage", k: "title", v: "home"}, onDone);
    } else {
        LCMSRequest("./servlet", {action: "getpage", k: _k, v: _v}, onDone);
    }


}

function LCMSgetEditablePage(_parent, _k, _v) {
    console.log("LCMSgetEditablePage()");
    function onDone(data) {
        buildEditablePage(data, _parent);
    }
    if (_v === "" || _k === "") {
        LCMSRequest("./servlet", {action: "getpage", k: "title", v: "home"}, onDone);
    } else {
        LCMSRequest("./servlet", {action: "getpage", k: _k, v: _v}, onDone);
    }
}

