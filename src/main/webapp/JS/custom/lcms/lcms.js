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
//mysheet = $('link[href="/css/style.css"]')[0].sheet;

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
        var denominator = $("table[id^=grid]");
        denominator.each(function (a, b) {
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

//class LCMSSidebarPage {
//    constructor(pageData, gridData) {
//        console.log("LCMSSidebarPage()");
//        this.pageData = pageData;
//        this.gridData = gridData;
//        this.requestHeader = {};
//    }
//    loadFromServer() {
//        var gridData = this.gridData;
//        console.log(gridData.editUrl + ": getting data from server...");
//        function onDone(data) {
//            var jsonData = JSON.parse(data);
//            gridData.data = jsonData;
//            let grid = new LCMSGrid(gridData);
//            grid.createGrid();
//            grid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
//                return popupEdit('new', $("#" + gridData.tableObject), $(this), gridData.editAction, {});
//            }));
//            grid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
//                var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
//                if (rowid !== null) {
//                    return popupEdit(rowid, $("#" + gridData.tableObject), $(this), gridData.editAction);
//                } else {
//                    return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
//                }
//            }));
//
//            if (typeof gridData.extraButtons !== "undefined") {
//                $.each(gridData.extraButtons, function (index, btn) {
//                    grid.addGridButton(btn);
//                });
//            }
//        }
//
//
//        this.requestHeader = gridData.loadAction;
//        LCMSRequest(gridData.editUrl, this.requestHeader, onDone);
//    }
//
//    addLoadRequestParam() {
//
//    }
//
//    createPage() {
//        var _this = this;
//        var pageData = _this.pageData;
//        var wrapper = $("<div></div>");
//        //var sidebarLeft = dom_div("", this.pageData.sidebarLeft);
//        //var sidebarLeftList = dom_list(this.pageData.sidebarLeftList, []);
//        var sidebarRight = dom_div("", this.pageData.sidebarRight);
//        var sidebarRightTable = $("<table id='" + this.pageData.sidebarRightTable + "'></table>");
//        var sidebarRightTablePager = dom_div("", this.pageData.sidebarRightTablePager);
//        var mainPageContainer = dom_mainPageContainer(this.pageData.containerID, this.pageData.mainPageContentDivId);
//
//        //sidebarLeft.append(sidebarLeftList);
//        sidebarRight.append(sidebarRightTable);
//        sidebarRight.append(sidebarRightTablePager);
//
//        //wrapper.append(sidebarLeft);
//        wrapper.append(sidebarRight);
//        wrapper.append(mainPageContainer);
//
//        $(function () {
//         //   sidebarLeft.BootSideMenu({side: "left"});
//            sidebarRight.BootSideMenu({side: "right"});
//            sidebarRight.BootSideMenu.open();
//            _this.loadFromServer();
//            pageData.ckConfig();
//        });
//        return wrapper;
//    }
//
//}

class LCMSNormalPage {

}

class LCMSEditablePage {
//    var pageData = {
//        loadAction: "VALIDATION_LOADVALIDATIONS",
//        editUrl: "./validations",
//        pageId: "",
//        idName = "",
//    };


    constructor(pageData) {
        this.pageData = pageData;
        this.originalDocument = "";
        this.gridController = new LCMSgridController();
        this.canvasses = new Object();

    }

    buildPageData(data, _parent) {
        _parent.empty();
        console.log("Start loading page");
        var me = this;
        var jsonData = JSON.parse(data, _parent);
        var grids = {};
        jsonData.parent = _parent;
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-id", jsonData.replaces["LCMSEditablePage-id"]);
            jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-menu", jsonData.replaces["LCMSEditablePage-menu"]);
            me.setPageId(jsonData.replaces["LCMSEditablePage-id"]);
            console.log("Regenerating grids...");
            try {
                var LCMSEditablePage_content = {};
                if (jsonData.replaces["LCMSEditablePage-content"] !== "") {
                    LCMSEditablePage_content = $.parseJSON(jsonData.replaces["LCMSEditablePage-content"]);
                    me.originalDocument = JSON.stringify(LCMSEditablePage_content);
                } else {
                    LCMSEditablePage_content.html = "";
                    LCMSEditablePage_content.grids = {};
                    me.originalDocument = '';
                }
                jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-content", LCMSEditablePage_content.html);

                grids = LCMSEditablePage_content.grids;

            } catch (e) {
                bootstrap_alert.warning("Something went wrong", "error", "1000");
            }
            _parent.click();
        }
        jsonData.parent.empty();
        this.generatePage(jsonData, grids);
    }

    generatePage(jsonData, grids) {
        console.log("generatePage()");
        var me = this;
        var webPage = $($.parseHTML(jsonData.webPage, document, true));
        var scripts = jsonData.scripts;
        var parameters = jsonData.parameters;

        $.each(parameters, function (key, value) {
            webPage.find("[LCMS='" + key + "']").append(value);
        });

        //
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
            me.generateGrid(editor, key, value);
        });


        $.each(this.gridController.grids, function (key, value) {
            if (typeof value.subgridref !== "undefined") {
                value = me.option_subgrid(value, value.subgridref);
                $("#" + key).jqGrid("setGridParam", value);
                $("#" + key).trigger("reloadGrid");
            }
        });



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
                modal.find("#btn-save").remove();
                var btn = dom_button("btn-revert", "history", "Versie herstellen", "primary");
                btn.on("click", function (e) {
                    var rowData = $("#history-table").jqGrid('getRowData', rowid);

                    LCMSRequest("./servlet", {action: "dobacklog", k: "dobacklog", parameters: {object_id: rowData["object_id"], object_type: rowData["object_type"], created_on: moment(rowData["created_on"]).valueOf()}});
                });
                modal.find("div[class='modal-body']").append(btn);
                modal.modal('show');
                return true;
                //return  popupEdit('view', $("#history-table"), $("#public-menu"), "", {});
            }
        };
        LCMSTableRequest("loadbacklog", "", "./servlet", "history-table", "history-pager", "public-menu", lang["backlog"]['title'], 3, extraOptions, {excludes: "changes", object_id: me.pageData.pageId});


    }

    generateGrid(editor, gridId, gridParam) {
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
                subGridHasSubGridValidation: me.checkHasSubGrid
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
                            savePage();
                        }
                    }
                }
            }
        };
        let documentGrid = new LCMSGrid(gridData);
        var gridObject = documentGrid.createGrid();
        me.addGridButtons(documentGrid, gridObject, gridData, editor);
        //me.toggle_multiselect(grid.attr('id'));




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
                return popupEdit(rowid, gridObject, $(this), gridData.editAction, me.savePage);
            } else {
                return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
            }
        }));

        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-cogs", "Click here to change columns", "", function () {
            new_grid_popup(editor, gridObject.jqGrid('getGridParam'));
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

    getDataFromPage(me, onDone) {
        //var me = this;
        var htmlData = $('<output>').append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"), document, true)));
        me.gridController.checkGrids();
        htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
            $(b).after("<div name='" + $(b).attr('id') + "'></div>");
            $(b).remove();
        });
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

    export_as_html() {
        var gridData = this.gridData;
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
            var selRowsData = Object.filter($("#" + gridData.tableObject).jqGrid('getGridParam').data, item => selRows.includes(String(item.id)) === true);
            var arr = [];
            $.each(selRowsData, function (key, value) {
                arr.push(value);
            });
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
        openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");

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
        return moment(cellvalue).utcOffset(60).toString();

    }

    createColModel(_data) {
        console.log("createColModel()");
        var cols = new Array();
        var view = [];
        var me = this;
        $.each(_data, function (index, value) {
            var column = {};
            column.label = value.name;
            column.name = value.name;
            var type = value.type || value.edittype;
            //column.editable = true;

            if (type === "date") {
                column.formatoptions = {srcformat: "u1000", newformat: "d-m-y"};
                column.formatter = "date";
                column.sorttype = "date";
                column.editoptions = {dataInit: initDateEdit};
            }
            if (type === "number") {
                column.template = numberTemplate;
            }
            if (type === "datetime") {
                //column.formatoptions = {srcformat: "u1000", newformat: "d-m-y h:i"};
                column.formatter = me.datetimeformatter;
                column.type = "datetime";
                //column.sorttype = "date";
                column.editoptions = {dataInit: initDateTimeEdit};
            }

            if (type === "text") {
                column.edittype = "text";
            }
            if (type === "cktext") {
                column.edittype = "textarea";
                column.editoptions = {title: "ckedit"};
            }
            if (type === "cktext_code") {
                column.edittype = "textarea";
                column.editoptions = {title: "ckedit_code"};
            }
            if (type === "boolean") {
                column.template = "booleanCheckbox";
            }

            if (type === "internal_list") {
                value.type = "select";
                column.editoptions = {title: "internal_list"};
                column.internalListName = value.internalListName;
                column.internalListAttribute = value.internalListAttribute;

            }
            if (type === "external_list") {
                value.type = "select";
                column.editoptions = {title: "external_list"};
            }
            if (type === "select") {
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
                column.editoptions.value = (value.choices);
                if (value.multiple === true) {
                    column.editoptions.size = value.choices.length < 8 ? value.choices.length + 2 : 10;
                }
            }
            if (type === "password") {
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
        var me = this;
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
            onSelectRow: function (rowid) {
                if (typeof gridData.jqGridOptions.selectToEdit !== "undefined") {
                    if (gridData.jqGridOptions.selectToEdit === true) {
                        me.popupEdit(rowid);
                    }
                }
            },
            colModelData: colModelData,
            pgbuttons: tabelData.length > 150,
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
                        extraparam: {oper: 'add', action: gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
                    }
                },
                editParams: {
                    editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                        extraparam: {action: gridData.editAction, LCMS_session: $.cookie('LCMS_session')}

                    }//23045
                }
            }
        };


        if (typeof gridData.jqGridOptions.summaries !== "undefined") {
            jqgridOptions.summaries = gridData.jqGridOptions.summaries;
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
        if (typeof gridData.jqGridOptions.groups !== "undefined") {

            jqgridOptions.grouping = true;
            jqgridOptions.groupingView = {
                groupField: gridData.jqGridOptions.groups,
//                groupColumnShow: [true],
                groupText: ['<b>{0} - {1} Item(s) </b>'],
//                groupCollapse: false,
//                groupSummaryPos: ["header"],
//                groupSummary: [false]



                showSummaryOnHide: false,
                groupColumnShow: [true],
                groupSummaryPos: ["header"],
                groupSummary: [true]

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
//            if (typeof jqgridOptions.subGridHasSubGridValidation !== "undefined") {
//                $.each(subGridCells, function (i, value) {
//                    if (!jqgridOptions.subGridHasSubGridValidation(value.parentNode.id, jqgridOptions.subgridref, me.gridController)) {
//                        $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).unbind('click').html('');
//                    }
//                });
//            }

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
            me.gridClickFunctions(e, $(this));
        });

        return $("#" + gridData.tableObject);
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

    popupEdit(_action, _afterSubmitFunction) {
        var me = this;
        var gridData = this.gridData;
        var grid = $("#" + gridData.tableObject);
        console.log("new item");

        grid.jqGrid('editGridRow', _action, {
            reloadAfterSubmit: false,
            beforeShowForm: function (formid) {

                $("textarea[title=ckedit]").each(function (index) {

                    $(this).replaceWith("<div contenteditable='true' title=ckedit id='" + $(this).attr("id") + "'>" + $(this).val() + "</div>");
                    // CKEDITOR.replace($(this).attr('id'), {
                    //     customConfig: ' '
                    //  });


                });

                $("div[title=ckedit]").each(function (index) {
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
//                $("textarea[title=ckedit]").each(function (index) {
//                    CKEDITOR.replace($(this).attr('id'), {
//                        customConfig: ' '
//                    });  
//                  //  CKEDITOR.inline($(this).attr('id'));
//                });
                scrollTo($($("input")[0]));
            },

            onclickSubmit: function (params, postdata) {
                console.log("onclickSubmit()");
                var postdata = $("#FrmGrid_" + this.id).serializeObject();
                ;
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
                    if (a.type === "datetime") {
                        return true;
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
                //   postdata = formid.serializeObject();
//                $("textarea[title=ckedit]").each(function (index) {
//                    var editorname = $(this).attr('id');
//                    var editorinstance = CKEDITOR.instances[editorname];
//                    var text = editorinstance.getData();
//                    text = removeElements("nosave", text);
//                    postdata[editorname] = text;
//                });
//                var colModel = $("#" + this.id).jqGrid("getGridParam").colModel;
//                var filteredModel = Object.filter(colModel, function (a) {
//                    console.log(a.type);
//                    if (a.type === "datetime") {
//                        return true;
//                    } else {
//                        return false;
//                    }
//                    ;
//                });
//                $.each(filteredModel, function (a, b) {
//                    var value = postdata[b.label];
//                    if (value === "") {
//                        postdata[b.label] = moment().valueOf();
//                    } else {
//                        postdata[b.label] = moment(value).valueOf();
//                    }
//
//                });

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
                pills.push(lang[tableName][rowId]);
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
                var rowIndex = pills.indexOf(lang[tableName][rowId]);
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
    constructor() {
    }

    uploadFile() {}

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

function LCMSTableRequest(loadAction, editAction, editUrl, tableName, pagerName, wrapperName, caption, tableType, jqGridOptions, extraRequestOptions) {
    function onDone(data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
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
    }
    var requestOptions = {};
    if (typeof extraRequestOptions !== "undefined") {
        console.log("extraRequestOptions");
        requestOptions = extraRequestOptions;
    }
    requestOptions.action = loadAction;


    return LCMSRequest(editUrl, requestOptions, onDone);
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
    $("#" + _tableName).jqGrid('setGridWidth', 300);
    return LcmsGrid;
}

function LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {

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
    lcmsGrid.createGrid();
    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
        return lcmsGrid.popupEdit("new", function () {
            return null;
        });
        //return popupEdit('new', $("#" + gridData.tableObject), $(this), gridData.editAction, {});
    }));
    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
        var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
        if (rowid !== null) {
            return lcmsGrid.popupEdit(rowid, function () {
                return null;
            });
            // return popupEdit(rowid, $("#" + gridData.tableObject), $(this), gridData.editAction);
        } else {
            return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
        }
    }));
    return lcmsGrid;
}

function LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
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
    lcmsGrid.createGrid();
    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
        //  return popupEdit('new', $("#" + gridData.tableObject), $(this), gridData.editAction, {});
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
            //return popupEdit(rowid, $("#" + gridData.tableObject), $(this), gridData.editAction);
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
    //
    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-list-ul", "Click here to change columns", "", function () {
        return lcmsGrid.toggle_multiselect($("#" + gridData.tableObject).jqGrid('getGridParam', 'id'));
    }));
    return lcmsGrid;
}

function LCMSTemplateGridButton(icon, title, caption, onClickFunction) {
    this.icon = icon;
    this.title = title;
    this.caption = caption;
    this.onClickFunction = onClickFunction;
}

function buildEditablePage(data, _parent) {
    console.log("buildDocumentPage()");
    config2();
    documentPage = new LCMSEditablePage({loadAction: "getpage", editAction: "editpages", editUrl: "./servlet", pageId: "", idName: "editablepageid"});
    documentPage.buildPageData(data, _parent);

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