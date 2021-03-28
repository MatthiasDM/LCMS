/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class LCMSEditablePage {

    constructor(pageData, parent) {
        this.pageData = pageData;
        this.originalDocument = "";
        this.gridForm = new LCMSGridForm(this);
        this.canvasses = new Object();
        this.readonly = true;
        this.parent = parent;
        this.pageName = "Page";
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
                    var re = /^[0-9A-Fa-f]+$/;
                    if (re.test(jsonData.replaces["LCMSEditablePage-content"])) {
                        jsonData.replaces["LCMSEditablePage-content"] = new TextDecoder().decode(hexToBytes(jsonData.replaces["LCMSEditablePage-content"]));
                    }
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
        //me.gridController.checkGrids();
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
                        //data = new TextDecoder().decode(hexToBytes(data));
                        console.log("Reverting document...");
                        buildEditablePage(data, $("#content"), documentPage.originalDocument, documentPage.pageData);
                    }
                    let afterRequest = await onDone(request);
                });
                var getHistory = (async function () {

                    let request = await LCMSRequest("./servlet", {action: "docommand", k: "dobacklog", parameters: {object_id: rowData["object_id"], object_type: rowData["object_type"], created_on: moment(rowData["created_on"]).valueOf()}});
                    async function onDone(data) {
                        //data = new TextDecoder().decode(hexToBytes(data));
                        console.log("Reverting document...");
                        var dmp = new diff_match_patch();
                        var reverted = new TextDecoder().decode(hexToBytes($.parseJSON(data).replaces["LCMSEditablePage-content"]))
                        var current = documentPage.originalDocument;
                        var d = dmp.diff_main(current, reverted);
                        var ds = dmp.diff_prettyHtml(d);  
                        historyDiv.html(ds);
                    }
                    let afterRequest = await onDone(request);
//                    let promise = new Promise((res, rej) => {
//                        res(LCMSRequest("./servlet", {action: "getbacklog", k: "backlogid", v: rowData["backlogid"]}));
//                        console.log("getHistory promise");
//                    });
//                    let value = await promise;
//                    // value = new TextDecoder().decode(hexToBytes(value));
//                    var contents = $.parseJSON($.parseJSON(value).changes).contents;
//                    contents = decodeURI(decodeURI(contents));
//                    historyDiv.text(contents);
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
        var jqgridFunctionList = ["beforeRequest", "a", "loadBeforeSend", "beforeProcessing", "searching", "loadComplete", "onSelectRow"];
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

//    subGridRowExpanded(subgridDivId, rowId) {
//        var me = this;
//        var subgridTableId = subgridDivId + "_t";
//        var documentGrid = documentPage.gridController.LCMSGrids[subgridTableId];
//        documentPage.gridController.addLCMSGrid(subgridTableId, documentGrid);
//        $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table><div id='pager_" + subgridTableId + "'></div>");
//        var createSubGrid = (async function (me) {
//            let value;
//            documentGrid = documentPage.gridController.LCMSGrids[subgridTableId];
//            if (typeof documentGrid === "undefined") {
//                var documentGridToCopy = documentPage.gridController.LCMSGrids[Object.keys(documentPage.gridController.LCMSGrids).find(function (a) {
//                    return a.includes("_row");
//                })];
//                var documentGrid = jQuery.extend(true, {}, documentGridToCopy);
//                //var documentGrid = Object.assign({}, documentGridToCopy);
//                documentGrid.gridData.data.table = [];
//                documentGrid.gridData.pagerID = "pager_" + subgridTableId;
//                documentGrid.gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
//                documentGrid.gridData.tableObject = subgridTableId;
//                documentGrid = new LCMSGrid(documentGrid.gridData);
//                documentPage.gridController.addLCMSGrid(subgridTableId, documentGrid);
//            }
//            let promise = new Promise((res, rej) => {
//                res(documentGrid.createGridOptions(subgridTableId, {pager: "#pager_" + subgridTableId}));
//            });
//            value = await  promise;
//            $("#" + subgridTableId).jqGrid(value);
//            documentGrid.gridData.pagerID = "pager_" + subgridTableId;
//            documentGrid.gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
//            documentGrid.gridData.tableObject = subgridTableId;
//            $("#" + subgridTableId).inlineNav("#" + documentGrid.gridData.pagerID, documentGrid.gridData.jqGridParameters.navGridParameters);
//        })();
//    }

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
        documentGrid.addGridButton(new LCMSTemplateGridButton("fa-arrow-down", "Download table entry", "", function () {
            documentGrid.export_as_html();
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
        me.gridController.checkGrids();
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

    async export_page() {
        console.log("exportToHTML()");
        var me = this;
        var htmlData = $("<output id='tempOutaput'>");
        var styleText = getCSS();
        styleText = styleText.replace(/\s+/g, ' ').trim();
        var style = $("<style>" + getCSS() + "</style>");
//        let scriptText = await getJS();
//        scriptText = scriptText.replace(/\s+/g, ' ').trim();
//        scriptText = scriptText.replace("</script>", '\<\/script\>');
//        var script = $("<script></script>");
//        script.html(scriptText);
        htmlData.append(style);
//        htmlData.append(script);
        htmlData.append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"))));


        let gridControllerPromise = new Promise((res, rej) => {

            var tableData = {};
            $.each(me.gridController.LCMSGrids, async function (a, b)
            {
                let loadGrid = new Promise((loadGridResolve, loadGridResult) => {
                    var grid = new LCMSGrid();
                    $.each(b, function (x, y) {
                        grid[x] = y;
                    });
                    grid.export_as_html().then(function (result) {
                        tableData[b.gridData.tableObject] = result;
                        loadGridResolve("Done");
                    });
                    //
                });
                tableData[b.gridData.tableObject] = await loadGrid;
            });
            res(tableData);
        });

        let htmlTables = await
                gridControllerPromise;
        htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
            var htmlTable = "<table class='table'>" + htmlTables[$(b).attr('id').substring(5)] + "</table>";
            $(b).after("<div name='" + $(b).attr('id') + "' style='overflow-x:auto'>" + htmlTable + "</div>");
            $(b).remove();
        });
        let imageController = new LCMSImageController();
        var images = imageController.loadImages("", htmlData);
        var imagesLoadedCounter = 0;
        if (images.length > 0) {
            images.each(function (index) {
                imageController.toDataURL($(images[index]).attr('src'), function (dataUrl) {
                    htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith("<img src='" + dataUrl + "' >");
                    bootstrap_alert.clear();
                    bootstrap_alert.warning('Images loaded: ' + imagesLoadedCounter, 'success', 1000);
                    if (imagesLoadedCounter === images.length - 1) {
                        htmlData.find("div").attr("contenteditable", false);
                        openFile(me.pageName + ".html", "<div class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
                    }
                    imagesLoadedCounter++;
                });
            });
        } else {
            openFile(me.pageName + ".html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
        }


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
        var btn_exporteer = $('<button type="button" id="btn-export-html-' + menu_uuid + '" class="btn btn-primary" disabled><i class="fa fa-lg fa-fw fa-download" ></i><span>Download</span></button>');
        $(document).on('click', '#btn-export-html-' + menu_uuid, function (e) {
            console.log("Export page...");
            me.export_page(me);
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
