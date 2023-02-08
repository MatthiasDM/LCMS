/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class LCMSEditablePage {

    constructor(pageData, parent) {
        require(['ckeditor']);

        this.pageData = pageData;
        this.originalDocument = "";
        this.gridForm = new LCMSGridForm(this);
        this.canvasses = new Object();
        this.readonly = true;
        this.parent = parent;
        this.pageName = "Page";
        this.gridController = new LCMSgridController(this.parent);
        this.usermenu = $("#content-menu");
    }

    buildPageData(data, _originalDocument) {
        console.log("Start loading page");
        var me = this;
        me.parent.empty();
        var jsonData = JSON.parse(data, me.parent);
        var grids = {};
        jsonData.parent = me.parent;
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "$pageId$", jsonData.replaces["$pageId$"]);
            //jsonData.webPage = replaceAll(jsonData.webPage, "LCMSEditablePage-menu", jsonData.replaces["LCMSEditablePage-menu"]);
            me.setPageId(jsonData.replaces["$pageId$"]);
            console.log("Regenerating grids...");
            try {
                var pageContent = {};
                if (jsonData.replaces["$pageContent$"] !== "") {
                    var re = /^[0-9A-Fa-f]+$/;
                    if (re.test(jsonData.replaces["$pageContent$"])) {
                        jsonData.replaces["$pageContent$t"] = new TextDecoder().decode(hexToBytes(jsonData.replaces["$pageContent$"]));
                    }
                    pageContent = $.parseJSON(jsonData.replaces["$pageContent$"]);

                    if (typeof _originalDocument !== "undefined") {
                        me.originalDocument = _originalDocument;
                    } else {
                        me.originalDocument = JSON.stringify(pageContent);
                    }

                } else {
                    pageContent.html = "";
                    pageContent.grids = {};
                    me.originalDocument = '';
                }
                jsonData.webPage = replaceAll(jsonData.webPage, "$pageContent$", pageContent.html);
                grids = pageContent.grids;
            } catch (e) {

                var temp_editable = $("<div id='editable_" + uuidv4() + "' contenteditable='false' class='cke_editable cke_editable_inline cke_contents_ltr cke_focus'tabindex='0' role='textbox' aria-label='false'></div>");
                pageContent = jsonData.replaces["$pageContent$"];
                temp_editable.text(pageContent);
                jsonData.webPage = replaceAll(jsonData.webPage, "$pageContent$", temp_editable[0].outerHTML);
                bootstrap_alert.warning("Something went wrong", "warning", "1000");
                console.log(e);
            }
            me.parent.click();
        }
        jsonData.parent.empty();
        this.generatePage(jsonData, grids);
    }

    async fetchDependencies() {
        console.log("fetchDependencies()");
        var me = this;
        function fetchedDeps(results) {
            if (results.length > 0) {
                var parsedResults = $.parseJSON(results);
                if (parsedResults.cursor.firstBatch.length > 0) {
                    var deps = parsedResults.cursor.firstBatch[0]._id.dependencies;
                    var scripts = "";
                    $.each(deps, async function (a, dep) {
                        $.each(dep, async function (b, code) {
                            var type = $(code)[0].localName;
                            if (type == "script" && $(code).attr("type") == "module" && typeof $(code).attr("name") != "undefined") {
                                if (typeof $(code).attr("src") != "undefined") {
                                    let _module = await import($(code).attr("src"));
                                    window[$(code).attr("name")] = _module;
                                } else {
                                    let _module = await import("data:text/javascript," + $(code).html());
                                    window[$(code).attr("name")] = _module;
                                }


                            } else {
                                scripts += code;
                            }
                        })

                    });
                    return "<div class='nosave'>" + scripts + "</div>";
                }
            }

        }
        async function getModuleSource(_url, _onDone) {
            var ajaxParameters = {
                method: "GET",
                url: _url,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("application/html");
                }
            };

            await $.ajax(ajaxParameters).done(function (data) {
                if (typeof _onDone !== "undefined") {
                    _onDone(data);
                }
                return data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            });
        }
        return await gcmscore.doCommand("getPageDepedencies", {"replaces": {"editablepageid": me.pageData.pageId}}, fetchedDeps);
        //return await gcmscore.doQuery("getPageDepedencies", {"editablepageid": me.pageData.pageId}, fetchedDeps);
    }

//    async fetchDependencies() {
//        console.log("fetchDependencies()");
//        var me = this;
//        function fetchedDeps(results) {
//            if (results.length > 0) {
//                var parsedResults = $.parseJSON(results);
//                if (parsedResults.cursor.firstBatch.length > 0) {
//                    var deps = parsedResults.cursor.firstBatch[0]._id.dependencies;
//                    var scripts = "";
//                    $.each(deps, function (a, b) {
//                        scripts += b;
//                    });
//                    return "<div class='nosave'>" + scripts + "</div>";
//                }
//            }
//
//        }
//        return await gcmscore.doCommand("getPageDepedencies", {"replaces": {"editablepageid": me.pageData.pageId}}, fetchedDeps);
//        //return await gcmscore.doQuery("getPageDepedencies", {"editablepageid": me.pageData.pageId}, fetchedDeps);
//    }

    async generatePage(jsonData, grids) {
        console.log("generatePage()");
        var me = this;
        me.gridsloaded = false;
        var deps = await me.fetchDependencies();
        //jsonData.webPage = $('<div />').html(jsonData.webPage).text();
        //require(jsonData.scripts);
        //var scripts = jsonData.scripts;
        var webPage = $($.parseHTML(jsonData.webPage, document, true));
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
        jsonData.parent.append(deps);
        jsonData.parent.append(webPage);
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
                    //me.usermenu.BootSideMenu({side: "left"});

                    me.afterLoadComplete();
                    hideLoading();
                } catch (e) {
                    hideLoading();
                }
            })();
            hideLoading();
        } else {
            me.loadSideBarMenu();
            //me.usermenu.BootSideMenu({side: "left"});
            me.afterLoadComplete();
        }
        $("#page-elements").remove();
        me.setReadOnly();
    }

    doSave(me, data) {

        // var patches = getPatches(me.originalDocument, data);
        var _cookie = $.cookie('LCMS_session');
        // data = data.replace(/[u200B-u200DuFEFF]/g, '');
        var re = new RegExp("\u2028|\u2029");
        var data = data.replace(re, '');
        function onDone(_data) {
            me.originalDocument = data;
            bootstrap_alert.info('Validatie opgeslaan', 'success', 3000);
            console.log("Changes saved.");
        }
        var formData = new FormData();
        var pageContent = new Blob([data], {type: "text/xml"});
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
            rowNum: 10,
            onSelectRow: function (rowid) {
                var modal = create_modal($("#public-menu"), "Geschiedenis bekijken", "");
                modal.attr("id", "historyModal");
                modal.find("#bg-save").remove();
                var btn = dom_button("bg-revert", "history", "Versie herstellen", "primary");
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
                        //var reverted = new TextDecoder().decode(hexToBytes($.parseJSON(data).replaces["LCMSEditablePage-content"]))
                        var reverted = ($.parseJSON(data).replaces["LCMSEditablePage-content"])
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
                //guiStyle: "bootstrap4"

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
        //me.parent.find("#sidebar").empty();
        me.usermenu.empty();
        var sidebarContainer = dom_div("", "sidebar-container");


        var sidebarMenu = $('<ul class="nav nav-pills flex-column mb-auto" id="global-menu" style="display: contents;flex-direction: column;justify-content: space-between;overflow: hidden;"></ul>');
        var documentMenu = $('<li class="nav-item"><a href="#documentCollapse" class="nav-link active" aria-expanded="false" aria-controls="documentCollapse" data-bs-toggle="collapse" data-bs-target="#documentCollapse" aria-current="page"><i class="fa fa-lg fa-fw fa-edit"></i>Menu</a></li>');
        var documentCollapse = $('<div class="collapse" id="documentCollapse"></div>');
        sidebarMenu.append(documentMenu);
        sidebarMenu.append(documentCollapse);
        //sidebarMenu.append(contentTable);
        //sidebarMenu.append(contentTableCollapse);
        sidebarContainer.append(sidebarMenu);
        me.generate_menu(documentCollapse);
        me.usermenu.append(sidebarContainer);
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

    edit_page(editOptionsWrapper) {
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
        editOptionsWrapper.find(".nav-link").each(function (index, btn) {
            $(btn).toggleClass("disabled");
//            if ($(btn).prop('disabled') === true) {
//                $(btn).prop('disabled', false);
//            } else {
//                $(btn).prop('disabled', true);
//            }

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
        console.log("exportPage()");
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
                        gcmscore.openFile(me.pageName + ".html", "<div class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
                    }
                    imagesLoadedCounter++;
                });
            });
        } else {
            gcmscore.openFile(me.pageName + ".html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
        }


    }

    generate_menu(_parent) {
        console.log("generate menu");
        var menu_uuid = uuidv4();
        var me = this;
        // var div_page_menu = $('<div id="div-page-menu"></div>');
        var div_page_menu = $('<ul class="nav nav-pills flex-column mb-auto" id="global-menu" style="display: contents;flex-direction: column;justify-content: space-between;overflow: hidden;"></ul>');

        div_page_menu.appendTo(_parent);
        var btn_page_edit = $('<li class="nav-item" id="bg-page-edit-' + menu_uuid + '"><a href="#" class="nav-link" aria-current="page"><i class="fa fa-lg fa-fw fa-edit"></i>Bewerken</a></li>');
        $(document).on('click', '#bg-page-edit-' + menu_uuid, function (e) {
            me.edit_page($("#edit-menu"));
        });
        btn_page_edit.appendTo(div_page_menu);
        var edit_menu = $('<div id="edit-menu"></div>');
        var btn_page_save = $('<li class="nav-item" id="bg-page-save-' + menu_uuid + '" disabled><a href="#" class="nav-link disabled" aria-current="page"><i class="fa fa-lg fa-fw fa-save"></i>Opslaan</a></list>');
        $(document).on('click', '#bg-page-save-' + menu_uuid, function (e) {
            me.savePage();
        });
        var btn_invoegen = $('<li class="nav-item" data-bs-toggle="collapse" data-bs-target="#collapseInvoegen" role="button" aria-expanded="false" aria-controls="collapseInvoegen" disabled><a href="#" class="nav-link disabled" aria-current="page"><i class="fa fa-lg fa-fw fa-plus"></i>Invoegen</a></li>');
        var div_invoegen = $('<div class="collapse" id="collapseInvoegen"></div>');
        var div_card_invoegen = $('<div class="card card-body"></div>');
        var btn_tekstveld = $('<li class="nav-item"  id="bg-new-editable-field-' + menu_uuid + '" disabled><i class="fa fa-lg fa-fw fa-align-justify"></i><span>Tekstveld</span></li>');
        $(document).on('click', '#bg-new-editable-field-' + menu_uuid, function (e) {
            me.new_editable_field();
        });
        var btn_jqgrid = $('<li class="nav-item" id="bg-new-jqgrid-' + menu_uuid + '" disabled><i class="fa fa-lg fa-fw fa-table"></i><span>Tabel</span></li>');
        $(document).on('click', '#bg-new-jqgrid-' + menu_uuid, function (e) {
            me.gridForm.new_grid_wizard(me);
        });
        var btn_acties = $('<li class="nav-item" data-bs-toggle="collapse" data-bs-target="#collapseActies" role="button" aria-expanded="false" aria-controls="collapseActies" disabled><a href="#" class="nav-link disabled" aria-current="page"><i class="fa fa-lg fa-fw fa-cog"></i>Acties</a></li>');
        var div_acties = $('<div class="collapse" id="collapseActies"></div>');
        var btn_contentTable = $('<li class="nav-item" aria-expanded="false" aria-controls="contentTableCollapse" data-bs-target="#contentTableCollapse" data-bs-toggle="collapse" aria-current="page"><a href="#" class="nav-link" aria-current="page"><i class="fa fa-lg fa-fw fa-list"></i>Inhoudsopgave</a></li>');
        var div_contentTable = $('<div class="collapse" id="contentTableCollapse">test2</div>');
        var div_card_acties = $('<div class="card card-body"></div>');
        var btn_importeer_tabel = $('<li class="nav-item"><i class="fa fa-lg fa-fw fa-th"></i><span>Importeer</span> <input id="importTableButton" type="file" style="display: none;"></li>');
        var btn_exporteer = $('<li class="nav-item" id="bg-export-html-' + menu_uuid + '" disabled><i class="fa fa-lg fa-fw fa-download" ></i><span>Download</span></li>');
        $(document).on('click', '#bg-export-html-' + menu_uuid, function (e) {
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
        btn_contentTable.appendTo(edit_menu);
        div_contentTable.appendTo(btn_contentTable);
        btn_importeer_tabel.appendTo(div_card_acties);
        btn_exporteer.appendTo(div_card_acties);
        var div_public_menu = $('<div id="public-menu"></div>');
        var btn_page_history = $('<li class="nav-item" id="bg-page-history" onclick="documentPage.getHistory()"><a href="#" class="nav-link" aria-current="page"><i class="fa fa-lg fa-fw fa-history"></i>Geschiedenis</a></li>');
        var history_table = $('<table id="history-table"></table>');
        var history_pager = $(' <div id="history-pager"></div>');
        div_public_menu.appendTo(div_page_menu);
        btn_page_history.appendTo(div_public_menu);
        history_table.appendTo(div_public_menu);
        history_pager.appendTo(div_public_menu);
    }

}
