/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class gcmscore {

    filterAttributeJson(data, filterBy) {
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

    filterUniqueJson(data, filterBy) {
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

    filterUnique(data, filterBy) {
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

    scrollTo(target) {
//var target = editorContents.contents().find(this.getAttribute('anchor'));
        if (target.length && typeof event !== "undefined") {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 500);
        }
    }

    CSVToArray(strData, strDelimiter) {
        console.log("CSVToArray()");
        strDelimiter = (strDelimiter || ",");
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
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[ 1 ];
            if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                    ) {
                arrData.push([]);
            }
            var strMatchedValue;
            if (arrMatches[ 2 ]) {
                strMatchedValue = arrMatches[ 2 ].replace(
                        new RegExp("\"\"", "g"),
                        "\""
                        );
            } else {
                strMatchedValue = arrMatches[ 3 ];
            }
            arrData[ arrData.length - 1 ].push(strMatchedValue);
        }
        return(arrData);
    }

    getCSSOfHref(href) {
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

    async getJS() {
        var scriptsOnPage = "";
        var scriptTags = Array.prototype.slice.call(document.querySelectorAll("script[src]"));
        $.each(scriptTags, async function (index, script) {
            var result = "";

            var xhr = new XMLHttpRequest();
            xhr.open("GET", script.src, false);
            xhr.onreadystatechange = async function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    //console.log("the script text content is", xhr.responseText);
                    scriptsOnPage += (xhr.responseText);

                }
            };
            xhr.send();




        });
        return scriptsOnPage;
    }

    getCSS() {
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

    async getDocumentByName(_parent, _id) {
        let request = await LCMSRequest("./servlet", {action: "getdocument", k: "title", v: _id});
        let afterRequest = await onDone(request);
        return "done";
        async function onDone(data) {
            return await buildDocumentPage(data, _parent);
        }
    }

    async doCommand(_command, _parameters, _ondone) {
        let request = await LCMSRequest("./servlet", {action: "docommand", k: _command, parameters: _parameters});
        let afterRequest = await onDone(request);
        return "done";
        async function onDone(data) {
            return await _ondone(data);
        }
    }

    getUrlParameter = function getUrlParameter(sParam) {
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

    async LCMSRequest(_url, _data, _onDone, _extraParam, _includeSession) {

        if (typeof _includeSession === "undefined") {
            _includeSession = true;
        }

        if (!_data.__proto__.toString().includes("FormData") && _includeSession) {
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
        let loading = new LCMSloading(false);
        loading.loading();
        return await $.ajax(ajaxParameters).done(function (data) {

            if (typeof _onDone !== "undefined") {
                _onDone(data);
            }
            loading.setLoaded(true);
            return data;

        }).fail(function (jqXHR, textStatus, errorThrown) {
            loading.setLoaded(true);
            console.log(errorThrown);
        }).always(function () {

        });

    }

    getPatches(oldData, newData) {
        console.log("getPatches()");
        // oldData = bytesToHex(stringToUTF8Bytes(oldData));
        // newData = bytesToHex(stringToUTF8Bytes(newData));
        var dmp = new diff_match_patch();
        // var diff = dmp.diff_main((oldData), (newData));
        var diff = dmp.diff_main((oldData), (newData));
        //  dmp.diff_cleanupSemantic(diff);
        var patches = dmp.patch_make(diff);
        var textPatches = dmp.patch_toText(patches);
        return textPatches;
    }

    getPatchesReverse(oldData, newData) {
        console.log("getPatches()");
        var dmp = new diff_match_patch();
        // var diff = dmp.diff_main((oldData), (newData));
        var diff = dmp.diff_main((newData), (oldData));
        //  dmp.diff_cleanupSemantic(diff);
        var patches = dmp.patch_make(diff);
        var textPatches = dmp.patch_toText(patches);
        return (textPatches);
    }

    static async LCMSTableRequest(collection, editAction, editUrl, tableName, pagerName, wrapperName, caption, tableType, jqGridOptions, extraRequestOptions, LCMSEditablePageObject) {
        var me = this;
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
                        LCMSGrid = me.LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                    } else if (tableType === 2) {
                        LCMSGrid = me.LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                    } else if (tableType === 3) {
                        LCMSGrid = me.LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
                    } else {
                        LCMSGrid = me.LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions);
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
        requestOptions.action = "docommand";
        requestOptions.k = "TableStructure";
        requestOptions.collection = collection;
        return LCMSRequest(editUrl, requestOptions, onDone);
    }

    LCMSTableFromData(loadAction, editAction, editUrl, tableName, pagerName, wrapperName, caption, tableType, jqGridOptions, extraRequestOptions, data) {
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
    }

    static async LCMSGridTemplateSimple(_jqGridOptions, _editAction, _editUrl, _tableName, _wrapperObject) {
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

    static async LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableObject, pagerName, wrapperObject, caption, jqGridOptions) {
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
            tableObject: tableObject, //("department-table"),
            pagerID: pagerName, //"department-pager",
            wrapperObject: wrapperObject,
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
        return await lcmsGrid.createGrid();

    }

    static async  LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
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
                navGridParameters: {
                    add: true,
                    cancel: true,
                    save: true,
                    keys: true,
                    editParams: {
                        extraparam: {action: editAction, LCMS_session: $.cookie('LCMS_session')},
                        action: editAction,
                        LCMS_session: $.cookie('LCMS_session'),
                        afterrestorefunc: function () {
                            console.log("afterrestorefunc");
                        }
                    }
                }
            }
        };



        var editparameters = {
            keys: true,
            oneditfunc: function (a, b, c) {
                console.log("oneditfunc");
            },
            successfunc: function (a, b, c) {
                console.log("successfunc");
            },
            afterrestorefunc: function (a, b, c) {
                console.log("afterrestorefunc");
                let filters = $(this).jqGrid("getGridParam").postData.filters;
                if (filters != null) {
                    if (typeof filters !== "string") {
                        filters = $.parseJSON(filters);
                    }
                    $(this).jqGrid('setGridParam', {"postData": {"filters": filters}});

                }
                $(this).trigger("reloadGrid");
            },
            aftersavefunc: function (a, b, c) {
                console.log("aftersavefunc");
            },
            beforeCancelRow: function (a, b, c) {
                console.log("beforeCancelRow");
            },
            action: editAction,
            LCMS_session: $.cookie('LCMS_session'),
            extraparam: {action: editAction,
                LCMS_session: $.cookie('LCMS_session')},
            aftersavefunc: function (rowid, response, options) {
                console.log("aftersavefunc");
            },
            mtype: "POST"
        };

        gridData.jqGridParameters.navGridParameters.editParams = editparameters;
        gridData.jqGridParameters.navGridParameters.addParams = {"position": "last", "addRowParams": editparameters};


        if (typeof jqGridOptions !== "undefined") {
            $.each(jqGridOptions, function (i, n) {
                gridData.jqGridOptions[i] = n;
            });
        }
        //let test = new LCMSGridForm(documentPage);
        //var testArr = new Array();
        //test.new_grid_wizard(documentPage, $.parseJSON(gridData.data.header), gridData.jqGridOptions, testArr, $.parseJSON(gridData.data.table), tableName, $("body"));

        let lcmsGrid = new LCMSGrid(gridData);
        await lcmsGrid.createGrid().then(
                function (result) {
                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus-square", "Nieuw item", "", function () {
                        return lcmsGrid.popupEdit("new", function () {
                            return null;
                        });
                    }));
                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil-square", "Eigenschappen wijzigen", "", function () {
                        var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
                        if (rowid !== null) {
                            return lcmsGrid.popupEdit(rowid, function () {
                                return null;
                            });
                        } else {
                            return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
                        }
                    }));
//                lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-list-alt", "Snelle wijzigingen aan/uit", "", function () {
//                    var tableObj = $("#" + gridData.tableObject);
//                    tableObj.jqGrid('bindKeys', {
//                        "onEnter": function (rowid) {
//                            alert("You enter a row with id:" + rowid);
//                        }
//                    });
//                }));

                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-arrow-down", "Download as CSV", "", function () {
                        return lcmsGrid.download_grid();
                    }));

                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-download", "Download", "", function () {
                        (async () => {
                            var data = (await lcmsGrid.export_as_html());
                            //openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + data + "</div><div class='col-sm-1 mx-auto'></div></div>");
                        })();
                    }));
                    if (gridData.jqGridOptions.postData.filters != null) {
                        gcmscore.jqGridFilter(gridData.jqGridOptions.postData.filters, $("#" + gridData.tableObject));
                    }
                    $(window).bind('resize', function () {
                        //var width = gridData.jqGridOptions.requestingRow != null ? 60 : 2;
                        $("#" + gridData.tableObject).setGridWidth(gridData.wrapperObject.width() - 5);
                    }).trigger('resize');


                }
        );
        return lcmsGrid;
    }

    static async LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
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
                navGridParameters: {add: false, cancel: true, save: true, keys: true, afterrestorefunc: function () {
                        console.log("afterrestorefunc");
                    }}
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
                        (async () => {
                            var data = (await lcmsGrid.export_as_html());
                            // openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + data + "</div><div class='col-sm-1 mx-auto'></div></div>");
                        })();
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

//    async LCMSGridTemplateSimple(_jqGridOptions, _editAction, _editUrl, _tableName, _wrapperObject) {
//        var gridData = {
//            data: {header: _jqGridOptions.colModel, table: _jqGridOptions.data},
//            editAction: _editAction,
//            editUrl: _editUrl,
//            tableObject: _tableName,
//            pagerID: _tableName + "_pager",
//            wrapperObject: _wrapperObject,
//            jqGridOptions: {
//                onSelectRow: function (rowid) {
//                    return popupEdit(rowid, $("#" + _tableName), $("body"), "_editAction");
//                },
//                caption: _jqGridOptions.caption
//            },
//            jqGridParameters: {
//                navGridParameters: {add: false}
//            }
//        };
//        let LcmsGrid = new LCMSGrid(gridData);
//        try {
//            $("#" + _tableName).jqGrid('setGridWidth', 300);
//        } catch (e) {
//
//        }
//
//        return LcmsGrid;
//    }
//
//    async LCMSGridTemplateMinimal(jsonData, editAction, editUrl, tableName, pagerName, wrapperObject, caption, jqGridOptions) {
//        try {
//            if (typeof jsonData.table === "string") {
//                jsonData.table = $.parseJSON(jsonData.table);
//            }
//            if (typeof jsonData.header === "string") {
//                jsonData.header = $.parseJSON(jsonData.header);
//            }
//        } catch (e) {
//
//        }
//
//
//
//        var gridData = {
//            data: jsonData,
//            editAction: editAction, //"LAB_EDITDEPARTMENT",
//            editUrl: editUrl, // "./lab",
//            tableObject: tableName, //("department-table"),
//            pagerID: pagerName, //"department-pager",
//            wrapperObject: wrapperObject,
//            jqGridOptions: {
//                grouping: false,
//                caption: caption, //lang["department"]['title']
//            },
//            jqGridParameters: {
//                navGridParameters: {add: false, cancel: false, save: false, keys: true}
//            }
//        };
//        if (typeof jqGridOptions !== "undefined") {
//            $.each(jqGridOptions, function (i, n) {
//                gridData.jqGridOptions[i] = n;
//            });
//        }
//        let lcmsGrid = new LCMSGrid(gridData);
//        await lcmsGrid.createGrid();
//        return lcmsGrid;
//    }
//
//    async LCMSGridTemplateStandard(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
//        console.log("LCMSGridTemplateStandard()");
//        var gridData = {
//            data: jsonData,
//            editAction: editAction, //"LAB_EDITDEPARTMENT",
//            editUrl: editUrl, // "./lab",
//            tableObject: tableName, //("department-table"),
//            pagerID: pagerName, //"department-pager",
//            wrapperObject: $("#" + wrapperName),
//            jqGridOptions: {
//                grouping: false,
//                caption: caption //lang["department"]['title']
//            },
//            jqGridParameters: {
//                navGridParameters: {add: false, cancel: true, save: true, keys: true, afterrestorefunc: function () {
//                        console.log("afterrestorefunc");
//                    }}
//            }
//        };
//        if (typeof jqGridOptions !== "undefined") {
//            $.each(jqGridOptions, function (i, n) {
//                gridData.jqGridOptions[i] = n;
//            });
//        }
//
//
//
//        let lcmsGrid = new LCMSGrid(gridData);
//
//        var data = await lcmsGrid.createGrid().then(
//                function (result) {
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
//                        return lcmsGrid.popupEdit("new", function () {
//                            return null;
//                        });
//                    }));
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
//                        var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
//                        if (rowid !== null) {
//                            return lcmsGrid.popupEdit(rowid, function () {
//                                return null;
//                            });
//                        } else {
//                            return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
//                        }
//                    }));
//                    $("#" + gridData.tableObject).trigger("reloadGrid");
//                }
//        );
//        return lcmsGrid;
//    }
//
//    async LCMSGridTemplateCustomOptions(jsonData, editAction, editUrl, tableName, pagerName, wrapperName, caption, jqGridOptions) {
//        try {
//            if (typeof jsonData.table === "string") {
//                jsonData.table = $.parseJSON(jsonData.table);
//            }
//            if (typeof jsonData.header === "string") {
//                jsonData.header = $.parseJSON(jsonData.header);
//            }
//        } catch (e) {
//
//        }
//        var gridData = {
//            data: jsonData,
//            editAction: editAction, //"LAB_EDITDEPARTMENT",
//            editUrl: editUrl, // "./lab",
//            tableObject: tableName, //("department-table"),
//            pagerID: pagerName, //"department-pager",
//            wrapperObject: $("#" + wrapperName),
//            jqGridOptions: {
//                caption: caption //lang["department"]['title']
//            },
//            navGridParameters: {add: false, cancel: true, save: true, keys: true, afterrestorefunc: function () {
//                    console.log("afterrestorefunc");
//                }}
//        };
//        $.each(jqGridOptions, function (i, n) {
//            gridData.jqGridOptions[i] = n;
//        });
//        let lcmsGrid = new LCMSGrid(gridData);
//        await lcmsGrid.createGrid().then(
//                function (result) {
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-plus", "Nieuw item", "", function () {
//                        return lcmsGrid.popupEdit("new", function () {
//                            return null;
//                        });
//                    }));
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
//                        var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
//                        if (rowid !== null) {
//                            return lcmsGrid.popupEdit(rowid, function () {
//                                return null;
//                            });
//                        } else {
//                            return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
//                        }
//                    }));
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-download", "Export", "", function () {
//                        (async () => {
//                            var data = (await lcmsGrid.export_as_html());
//                            //openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + data + "</div><div class='col-sm-1 mx-auto'></div></div>");
//                        })();
//                    }));
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-arrow-down", "Download as CSV", "", function () {
//                        return lcmsGrid.download_grid();
//                    }));
//                    lcmsGrid.addGridButton(new LCMSTemplateGridButton("fa-list-ul", "Click here to change columns", "", function () {
//                        return lcmsGrid.toggle_multiselect($("#" + gridData.tableObject).jqGrid('getGridParam', 'id'));
//                    }));
//                }
//        );
//        return lcmsGrid;
//    }




    LCMSTemplateGridButton(icon, title, caption, onClickFunction) {
        this.icon = icon;
        this.title = title;
        this.caption = caption;
        this.onClickFunction = onClickFunction;
    }

    buildEditablePage(data, _parent, _originalDocument, _pageData) {
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

    static async editablePage_getPage(_parent) {
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

    LCMSgetEditablePage(_parent, _k, _v) {
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

    static domTextInput(id, name, placeholder, title, val) {
        var form_group = $("<div id='" + id + "' class='form-group'></div>");
        var label = $("<label for='" + title + "'>" + title + "</label>");
        var input = $("<input type='text' value='" + val + "' name='" + name + "' class='form-control' id='input-text-" + id + "' placeholder='" + placeholder + "'>");
        form_group.append(label);
        form_group.append(input);
        return form_group;
    }

    static domFormSelect(title, id, name, valObjects, val, disabled) {
        console.log("forms_select()");
        if (typeof valObjects === "string") {
            valObjects = $.parseJSON(valObjects);
        }
        var form_group = $("<div id='" + id + "' class='form-group'></div>");
        var label = $("<label for='" + title + "'>" + title + "</label>");
        var select = $("<select class='form-control' name='" + name + "' id='select-" + id + "'></select>");
        $.each(valObjects, function (a, b) {
            select.append($("<option value='" + b.id + "'>" + b.value + "</option>"));
        });
        form_group.append(label);
        form_group.append(select);
        if (typeof val !== "undefined") {
            select.val(val);
        }
        return form_group;

    }

    static async loadExternalGrid(name, parent, extraOptions, id) {

        var me = this;
        var title = typeof lang[baseName] !== "undefined" ? lang[baseName]['title'] : name;
        var baseName = name;
        var fullName = id;//baseName + uuidv4();
        var container = dom_jqGridContainerFullWidth(fullName);
        parent.append(container);
        var lazyOptions = gcmscore.lazyOptions(baseName);
        var tableOptions = gcmscore.replaceProperties(lazyOptions, extraOptions);
        await me.LCMSTableRequest(baseName, "edit" + baseName, "./servlet", fullName + "-table", fullName + "-pager", fullName + "-div-grid-wrapper", title, 1, tableOptions);

        return fullName + "-table";

    }

    static async loadExternalGrid_old(action, command, parent, extraOptions) {

        async function onDone(data) {
            try {
                console.log("Loading external grid...");
                var data = $.parseJSON(data);
                //me.gridData.wrapperObject.parent()
                parent.append("<div style='position:absolute;' name='" + data.id + "'></div>");
                if (typeof extraOptions !== "undefined") {
                    data.extraOptions = extraOptions;

                }

                documentPage.generateGrid($("div[name*=" + data.id + "]").parent(), data.id, data);
            } catch (e) {
                console.log(e);
                return {};
            }


        }
        var requestOptions = {};
        requestOptions.action = action;
        requestOptions.k = command;
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;

    }

    static valuesFromSelect(select) {
        var vals = new Object();
        var valueArray = new Array();
        var values = select.find("option").map(function () {
            return $(this).text();
        }).get();
        var ids = select.find("option").map(function () {
            return $(this).attr("value");
        }).get();
        $(ids).each(function (a, b) {
            vals = {
                id: b,
                value: values[a]
            };
            valueArray.push(vals);
        });
        return JSON.stringify(valueArray);
    }

    static jqGridFilter(filtersparam, grid) {
        console.log("gcmscore.jqGridFilter()");
        if (typeof filtersparam !== "string") {
            filtersparam = JSON.stringify(filtersparam);
        }
        grid.setGridParam({
            postData: {
                filters: filtersparam
            },
            search: true
        });

        grid.trigger("reloadGrid");
    }

    static parseJSONString(jsonString) {
        try {
            jsonString = jsonString.replaceAll("'", "\"");
            return $.parseJSON(jsonString);
        } catch (e) {
            return null;
        }
    }

    //functions for relationsal funciontality

    static valuesFromInputHidden(wrapper) {
        if (typeof wrapper !== "undefined") {
            var vals = new Object();
            var valueArray = new Array();
            var base;

            if (Array.isArray(wrapper)) {
                return JSON.stringify(wrapper);
            } else {
                if (typeof wrapper === 'string') {
                    try {
                        wrapper = $.parseJSON(wrapper);
                        return JSON.stringify(wrapper);
                    } catch (e) {
                        wrapper = $($.parseHTML(wrapper));
                    }
                }
                base = wrapper.find("input[type=hidden]");
                if (base.length === 0) {
                    base = wrapper.filter("input[type=hidden]");
                }
                var values = base.map(function () {
                    return $(this).attr("value");
                }).get();
                var ids = base.map(function () {
                    return $(this).attr("id");
                }).get();
                $(ids).each(function (a, b) {
                    vals = {
                        id: b,
                        value: values[a]
                    };
                    valueArray.push(vals);
                });
            }
            return JSON.stringify(valueArray);
        }


    }

    static idsFromInputHidden(wrapper) {
        var vals = new Object();
        var valueArray = new Array();
        var base;

        if (Array.isArray(wrapper)) {
            return JSON.stringify(wrapper);
        } else {
            if (typeof wrapper === 'string') {
                try {
                    wrapper = $.parseJSON(wrapper);
                    return JSON.stringify(wrapper);
                } catch (e) {
                    wrapper = $($.parseHTML(wrapper));
                }
            }
            base = wrapper.find("input[type=hidden]");
            if (base.length === 0) {
                base = wrapper.filter("input[type=hidden]");
            }
            var ids = base.map(function () {
                return $(this).attr("id");
            }).get();
            $(ids).each(function (a, b) {
                valueArray.push(b);
            });
        }
        return valueArray;
    }

    static domFormInputHidden(title, id, name, valObjects, val) {
        console.log("domFormInputHidden()");
        if (typeof valObjects === "string") {
            valObjects = $.parseJSON(valObjects);
        }
        var vals = new Array();
        $.each(valObjects, function (a, b) {
            vals.push(b.value);
        });
        vals.toString();
        var form_group = $("<div id='" + id + "' class='form-group'></div>");
        var select = $("<input type='text' autocomplete='off' class='form-control' name='" + name + "' value='" + vals + "' id='select-" + id + "'/>");
        form_group.append(select);
        $.each(valObjects, function (a, b) {
            var hidden = $("<input type='hidden' id='" + b.id + "' value='" + b.value + "'/>"); //meta='" + JSON.stringify(b) + "'
            hidden.data("meta", b);
            form_group.append(hidden);
            //
        });
        if (typeof val !== "undefined") {
            select.val(val);
        }
        return form_group;
    }

    static foreignKeyFunction(selRowData, key) {
        console.log("foreignKeyFunction");

        return selRowData[key];
    }

    static lazyOptions(baseName) {
        var lazy = {baseName: baseName, multiple: false, rowList: [20, 50, 100], recordtext: "{0}- {1} ({2})", pagerpos: "right", repeatitems: false, pgbuttons: true, reloadAfterSubmit: true, bindkeys: false, selectToInlineEdit: false, multiselect: false, datatype: "json", page: 1, jsonReader: {id: "2", total: "total", records: "records", page: "page", root: "rows", cell: "", subgrid: {id: "2", total: "total", records: "records", page: "page", root: "rows", cell: ""}}, emptyrecords: "No records", loadonce: false, rowNum: 20, url: "./servlet", mtype: "post", postData: {"LCMS_session": $.cookie('LCMS_session'), action: "data" + baseName, datatype: "json"},
            loadBeforeSend: function (jqXHR) {
                jqXHR.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; charset=UTF-8');
            }
        };
        return lazy;
    }

    static replaceProperties(original, obj) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] === "object" & typeof original[property] === "object")
                    gcmscore.replaceProperties(original[property], obj[property]);
                else
                    original[property] = obj[property];
                //console.log(property + "   " + obj[property]);
            }
        }
        return original;
    }

    static loadLazyTable(_title, _parent, _baseName, _lazyOptions, _extraRequestOptions, _tableType) {
        console.log("Loading " + _title);
        if (_tableType == null) {
            _tableType = 1;
        }
        var me = this;
        var title = typeof lang[_baseName] !== "undefined" ? lang[_baseName]['title'] : _title;
        var baseName = _baseName;// + "-" + uuidv4();
        var containerName = _baseName + "-" + uuidv4();
        var container = dom_jqGridContainer(containerName);
        _parent.append(container);
        me.LazyTableRequest(baseName, containerName, "./servlet", title, _tableType, _lazyOptions, _extraRequestOptions);
    }

    static async LazyTableRequest(baseName, containerName, editUrl, caption, tableType, extraLazyOptions, extraRequestOptions, LCMSEditablePageObject) {
        var me = this;
        let lazyOptions = gcmscore.lazyOptions(baseName);
        if (extraLazyOptions) {
            lazyOptions = gcmscore.replaceProperties(lazyOptions, extraLazyOptions);
        }
        return me.LCMSTableRequest(baseName, "edit" + baseName, editUrl, containerName + "-table", containerName + "-pager", containerName + "-div-grid-wrapper", caption, tableType, lazyOptions, extraRequestOptions, LCMSEditablePageObject);
    }

    static createTableModal(_title, _baseName, _parent, _extraContent, _lazyOptions) {
        var me = this;
        var mod = create_modal(_parent, "", "");
        var modalBody = mod.find("div[class=modal-body]");
        modalBody.css("padding", "0");
        modalBody.css("border-top-right-radius", "calc(0.3rem - 1px)");
        modalBody.css("border-top-left-radius", "calc(0.3rem - 1px)");
        modalBody.css("display", "contents");
        mod.on('hidden.bs.modal', function () {
            $(this).remove();
        });

        me.loadLazyTable(_title, modalBody, _baseName, _lazyOptions);
        modalBody.append(_extraContent);
        var modbs5 = new bootstrap.Modal(mod);
        modbs5.show();
        //mod.modal();
    }

    static createModal(_title, _parent) {
        var me = this;
        var mod = create_modal(_parent, _title, _title);
        var modalBody = mod.find("div[class=modal-body]");
        mod.on('hidden.bs.modal', function () {
            $(this).remove();

        });
        var modbs5 = new bootstrap.Modal(mod);
        modbs5.show();
        return modalBody;
    }

    static async getSnippet(name) {
        async function onDone(data) {
            try {
                console.log(JSON.parse(data).cursor.firstBatch[0].code);
                return JSON.parse(data).cursor.firstBatch[0].code;
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doQuery";
        requestOptions.name = "getSnippet";
        requestOptions.database = "lcms";
        requestOptions.replaces = {};
        requestOptions.replaces.name = name;
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;
    }

    static async doQuery(name, replaces, onDone) {

        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doQuery";
        requestOptions.name = name;
        requestOptions.database = "lcms";
        requestOptions.replaces = {};
        requestOptions.replaces = replaces;
        try {
            let request = await LCMSRequest("./servlet", requestOptions);
            let returnvalue = await onDone(request);
            return returnvalue;
        } catch (e) {
            console.log(e);
            return {};
        }
    }

    static async doQueryPopup(name) {
        async function onDone(data) {
            try {
                console.log(data);
                var data = JSON.stringify(JSON.parse(data), null, 2);
                var modalBody = gcmscore.createModal('Query result', $('#admin-container'));
                var code = JSON.parse(data).cursor.firstBatch[0].code;
                var modalContent = $("<div></div>");
                modalContent.append(code);
                modalBody.html(modalContent);
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doQuery";
        requestOptions.name = name;
        requestOptions.database = "lcms";
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;
    }

    static async doCommand(_command, _parameters, onDone) {
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = _command;
        $.extend(true, requestOptions, _parameters);
        try {
            let request = await LCMSRequest("./servlet", requestOptions);
            let returnvalue = await onDone(request);
            return returnvalue;
        } catch (e) {
            console.log(e);
            return {};
        }

    }

    static async fetchFormatters(mob) {
        var me = this;
        var formatters = {};
        function fetchedFormatters(results) {
            if (results.length > 0) {
                var parsedResults = $.parseJSON(results);
                var index = 0;
                $.each(parsedResults.cursor.firstBatch, function (a, b) {

                    $.each(b.name, function (c, d) {
                        if (formatters[d] == undefined) {
                            formatters[d] = eval("eval(`" + b.function[index] + "`)");
                            index++;
                        }
                    });
                    index = 0;

                });

//                    me.formatters[0].function[me.formatters[0].name.indexOf(value.formatterName)]
//                     
                return formatters;

            }

        }
        return await gcmscore.doQuery("getCalculatedFields", {"name": mob}, fetchedFormatters);
    }

    static async loadFormatters() {

        var templates = [];
        var formatters = {};
        async function onDone(data) {
            try {
                console.log("Adding formatters...");
                var jsonData = JSON.parse(data);
                $.each(jsonData.data, function (a, b) {
                    formatters[b.title] = eval(b.function);
                });
                return formatters;
            } catch (e) {
                console.log(e);
                return {};
            }


        }
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "getFormatters";
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;
    }

    static async getSnippet(name, target) {
        async function onDone(data) {
            try {
                console.log(JSON.parse(data).cursor.firstBatch[0].code);
                return JSON.parse(data).cursor.firstBatch[0].code;
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doQuery";
        requestOptions.name = "getSnippet";
        requestOptions.database = "lcms";
        requestOptions.replaces = {};
        requestOptions.replaces.name = name;
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;
    }

    static async getSnippetPopup(name, target) {
        var code = await this.getSnippet(name);
        var modalBody = gcmscore.createModal('Query result', $('#admin-container'));
        var modalContent = $("<div id='target'></div>");
        modalContent.data('target', target);
        modalContent.append(code);
        modalBody.html(modalContent);
    }

    static async editTable(collection, oper, data) {
        data.oper = oper;
        data.LCMS_session = $.cookie("LCMS_session");
        if (oper == "edit" || oper == "add") {
            data.action = "edit" + collection;
        }
        let result = await LCMSRequest("./servlet", data, onDone);
        function onDone(results) {
            showLoadingSmall("Added document", "success", 2000);
        }
        return result;
    }

    static async classInfo(collection) {
        async function onDone(data) {
            try {
                console.log(data);
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        var requestOptions = {};
        requestOptions.action = "docommand";
        requestOptions.k = "doGetClassInfo";
        requestOptions.collection = "documents";
        let request = await LCMSRequest("./servlet", requestOptions);
        let returnvalue = await onDone(request);
        return returnvalue;
    }

    static async openFile(filename, text) {
        require(['filesaver'], function () {
            var blob = new Blob([text], {type: "text/html;charset=utf-8"});
            saveAs(blob, filename);

            var x = window.open(location.origin + location.pathname + '?p=temp', '_blank');
            x.document.write(text);
            x.document.close();
        });
    }
}

function page_doLoadPage(_page, parent) {
    function onDone(data) {
        var jsonData = JSON.parse(data, parent);
        jsonData.parent = parent;
        loadParameters(jsonData);
        setJumbo(_page);
        setEnviroment(jsonData.parameters['software-version']);
    }
    LCMSRequest("./page", {page: _page}, onDone);

}

async function credentials_doUserInfo(_parent) {
    async function onDone(data) {
        try {
            var jsonData = JSON.parse(data, _parent);
            jsonData.parent = _parent;
            loadParameters(jsonData);
            sessionCountdown();
        } catch (e) {
            console.log(e);
            return {};
        }
    }
    var requestOptions = {};
    requestOptions.action = "docommand";
    requestOptions.k = "doUserInfo";
    let request = await LCMSRequest("./servlet", requestOptions);
    if (request != "") {
        $("nav").show();
    }
    let returnvalue = await onDone(request);
    return returnvalue;
}

function getUrlParam(url_string, param) {
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var p;
    if (isIE || isEdge) {
        p = parse_query_string(url_string);
        p = p[Object.keys(p)[0]]; // "a"
    } else {
        var url = new URL(url_string);
        p = url.searchParams.get(param);
    }
    if (typeof p === "undefined") {
        p = "";
    }
    if (p === "undefined") {
        p = "";
    }
    if (p === null) {
        p = "";
    }
    return p;

}

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

async function getJS() {
    var scriptsOnPage = "";
    var scriptTags = Array.prototype.slice.call(document.querySelectorAll("script[src]"));
    $.each(scriptTags, async function (index, script) {
        var result = "";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", script.src, false);
        xhr.onreadystatechange = async function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                //console.log("the script text content is", xhr.responseText);
                scriptsOnPage += (xhr.responseText);

            }
        };
        xhr.send();




    });
    return scriptsOnPage;
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

function getPostDataFromUrl() {

}

async function LCMSRequest(_url, _data, _onDone, _extraParam, _includeSession) {


    if (typeof _includeSession === "undefined") {
        _includeSession = true;
    }

    if (!_data.__proto__.toString().includes("FormData") && _includeSession) {
        _data['LCMS_session'] = $.cookie('LCMS_session');
    }

    var ajaxParameters = {
        method: "POST",
        url: _url,
        data: _data,
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    };
    $.each(_extraParam, function (key, value) {
        ajaxParameters[key] = value;
    });
    showLoadingSmall("loading", "info", 20000);
    return await $.ajax(ajaxParameters).done(function (data) {
        if (typeof _onDone !== "undefined") {
            _onDone(data);
        }
        hideLoadingSmall();
        return data;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showLoadingSmall(jqXHR.responseText, "danger", 10000);
        console.log(errorThrown);
    });
}

function getPatches(oldData, newData) {
    console.log("getPatches()");
    //oldData = bytesToHex(stringToUTF8Bytes(oldData));
    //newData = bytesToHex(stringToUTF8Bytes(newData));
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
    require(['ckeditor'], function (papa) {
        config2(publicPage);
        documentPage = new LCMSEditablePage(pageData, _parent);
        documentPage.buildPageData(data, _originalDocument);
    });

    // documentPage.setPageId($($("div[id^='wrapper']")[0]).attr("id").substring(8));
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

$(function () {
    Object.filter = (obj, predicate) =>
        Object.keys(obj)
                .filter(key => predicate(obj[key]))
                .reduce((res, key) => (res[key] = obj[key], res), {});

    $.fn.modal.Constructor.prototype._enforceFocus = function () {
        modal_this = this;
        try {
            $(document).on('focusin.modal', function (e) {

                if (typeof modal_this.$element !== "undefined") {

                    if (modal_this.$element[0] !== e.target
                            &&
                            !modal_this.$element.has(e.target).length
                            &&
                            !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                        modal_this.$element.focus()
                    }

                }


            })
        } catch (e) {

        }


    };

    $.fn.toggleAttr = function (attr, val) {
        var test = $(this).attr(attr);
        if (test) {
            // if attrib exists with ANY value, still remove it
            $(this).removeAttr(attr);
        } else {
            $(this).attr(attr, val);
        }
        return this;
    };

    $.fn.appendOrReplace = function (object) {
        if ($("#" + object.attr("id")).length === 1) {
            $("#" + object.attr("id")).replaceWith(object);
        } else {
            $(this).append(object);
        }
    };

    $.fn.afterOrReplace = function (object) {
        if ($("#" + object.attr("id")).length === 1) {
            $("#" + object.attr("id")).replaceWith(object);
        } else {
            $(this).after(object);
        }
    };

    $.extend($.fn.fmatter, {
        reference: function (cellvalue, options, rowObject) {
            console.log("eval reference");
            try {
                var vals = gcmscore.valuesFromInputHidden(cellvalue, options.colModel.fk);
                var uuid = uuidv4();
                var selectWrapper = gcmscore.domFormInputHidden("", uuid, options.colModel.name, vals, "", false);
                var input = selectWrapper.find("input[type=text]");
                input.attr("style", "padding:0;height:auto;border:none;margin-top:0;margin-bottom:0;background:transparent !important;");
                return selectWrapper.html();
            } catch (err) {
                console.log(err);
            }
        }
    });




});

function __delay__(timer) {
    return new Promise(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
}
;

function getAttributesOfGrid(_gridName) {
    var obj = [];
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _gridName) {
            var names = $(b).jqGrid('getGridParam').colNames;
            names.forEach(function (a) {
                if (a !== "") {
                    var name = a;
                    var id = a;
                    obj.push({id, name});
                }
            });
        }
    });
    return obj;
}

function removeUnusedDataFromJqGrid(_columns, _data, _renames) {
    console.log("removeUnusedDataFromJqGrid()");
    var data = _data;
    data.forEach(function (object, index) {
        for (var property in object) {
            if (property !== "id") { //The rowID may never be deleted!
                if (object.hasOwnProperty(property)) {

                    if (typeof _renames !== "undefined") {
                        if (typeof _renames[property] !== "undefined") {
                            object[_renames[property]] = object[property];
                            delete object[property];
                        }
                    }

                    if (_columns.includes(property) === false) {
                        delete object[property];
                    }

                }
            }

        }
    });
    return data;
}

function ifKnownString(value) {
    if (typeof value !== 'undefined' && value) {
        return value;
    } else {
        return "";
    }
}

function loadParameters(jsonData) {
    var webPage = $($.parseHTML(jsonData.webPage, document, true));
    var scripts = jsonData.scripts;
    var parameters = jsonData.parameters;

    $.each(parameters, function (key, value) {
        webPage.find("[LCMS='" + key + "']").append(value);
        webPage.find("[gcms='" + key + "']").append(value);
    });
    jsonData.parent.append(webPage);
    jsonData.parent.append("<script>" + scripts + "</script>");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function setEnviroment(env) {
    $("[LCMS='software-version']").append(env);
}

function setJumbo(page) {

    if (page === null || typeof page === 'undefined') {
        page = "default";
    }
    console.log("generaring breadcrumbs");
    var breadcrumbs = page.split("/");
    var crumblink = "";
    if (breadcrumbs.length > 1) {
        var bcList = $("<ol class='breadcrumb bg-light' style='padding: 0; margin-bottom: 0'></ol>");
        for (var crumb in breadcrumbs) {
            crumblink += breadcrumbs[crumb] + "/";
            var bcItem = $("<li class='breadcrumb-item'><a href='index.html?p=" + crumblink + "'>" + breadcrumbs[crumb] + "</a></li>");
            bcList.append(bcItem);
        }
        $("#text-jumbo-crumbs").append(bcList);
    }

    $("#text-jumbo-heading").text(lang.jumbo[page]);
    $("#text-jumbo-info").text(lang.jumbo_info[page]);


}

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function sessionCountdown() {
    var diffTime = $("#userInfo-session-timout").text();
    if (diffTime === null) {
        diffTime = 0;
    }
    var duration = moment.duration(diffTime * 1000, 'milliseconds');
    var interval = 1000;

    setInterval(function () {
        duration = moment.duration(duration - interval, 'milliseconds');
        $("#userInfo-session-timout").text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds())
    }, interval);
}
bootstrap_alert = function () {};
bootstrap_alert.warning = function (message, alert, timeout) {

    if ($("div[id^=floating_alert]").length === 0) {
        bootstrap_alert.show(message, alert, timeout);
    } else {
        bootstrap_alert.clear();
        bootstrap_alert.show(message, alert, timeout);

    }
};

bootstrap_alert.info = function (message, alert, timeout) {

    if ($("div[id^=floating_alert]").length === 0) {
        bootstrap_alert.info(message, alert, timeout);
    } else {
        bootstrap_alert.clear();
        bootstrap_alert.info(message, alert, timeout);

    }
};

bootstrap_alert.show = function (message, alert, timeout) {
    var id = uuidv4();
    var spinner = '<div class="spinner-border" role="status"><span class="sr-only"></span></div>';
    $('<div id="floating_alert_' + id + '" class="alert alert-' + alert + ' alert-dismissible fade show" role="alert" style="padding: 1em;max-width: 400px;max-height:400px;overflow-y:auto"><center>' + spinner + '&nbsp;&nbsp;<br/>' + message + '</center></div>').appendTo($("#alertWrapper"));
    setTimeout(function () {
        $("#floating_alert_" + id).alert('close');
    }, timeout);
};
bootstrap_alert.info = function (message, alert, timeout) {
    var id = uuidv4();
    $('<div id="floating_alert_' + id + '" class="alert alert-' + alert + ' alert-dismissible fade show" role="alert" style="padding: 1em;max-width: 400px;max-height:400px;overflow-y:auto"><center>&nbsp;&nbsp;' + message + '</center></div>').appendTo($("#alertWrapper"));
    setTimeout(function () {
        $("#floating_alert_" + id).alert('close');
    }, timeout);
};
bootstrap_alert.clear = function () {
    $("div[id^=floating_alert]").remove();
};

(function ($, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    $.fn.serializeObject = function () {
        var obj = {};

        $.each(this.serializeArray(), function (i, o) {
            var n = o.name,
                    v = o.value;

            obj[n] = obj[n] === undefined ? v
                    : $.isArray(obj[n]) ? obj[n].concat(v)
                    : [obj[n], v];
        });

        return obj;
    };

})(jQuery);

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function APIprefix() {
    return 'xxxxxxx.'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class LCMSloading {
    constructor(loaded) {
        this.loaded = loaded;
        this.dialogShown = false;
    }
    loading() {
        if (this.loaded === true) {
            hideLoading();
            return true;
        } else {
            if (!this.dialogShown) {
                showLoading();
                this.dialogShown = true;
            }

        }
    }
    setLoaded(loaded) {
        this.loaded = loaded;
        this.loading();
    }
}

function removeElements(classname, source) {
    console.log("removeElements()");

    var callback = function (a) {
        console.log(a);
    };
    source = minify(source, {
        removeAttributeQuotes: true,
        collapseWhitespace: true
                // other options
    }, callback);
    console.log(source);
    var $s = $(source).find("." + classname).remove().end();

    return $("<div></div>").append($s).html();
}

$.fn.textWidth = function (text, font) {
    if (!$.fn.textWidth.fakeEl)
        $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

function create_modal(parent, title, text) {

    var modal = $("<div class='modal' style='padding:0 !important' tabindex='-1' role='dialog'></div>");
    var modal_dialog = $("<div class='modal-dialog modal-xl modal-fullscreen-xl-down' style='padding:0.1rem' role='document'></div>");
    var modal_content = $("<div class='modal-content'  style='backdrop-filter: blur(6px);'></div>");
    var modal_header = $("<div class='modal-header'></div>");

    var modal_title = $("<h5 class='modal-title'>" + title + "</h5>");
    var modal_title_close = $("<button type='button' class='close' data-bs-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
    var modal_body = $("<div class='modal-body'>" + text + "</div>");
    var modal_footer = $("<div class='modal-footer'><button type='button' style='margin-right:1rem' class='btn bg-secondary' data-bs-dismiss='modal'>Close</button></div>");

    modal_header.append(modal_title);
    modal_header.append(modal_title_close);
    if (title !== "") {
        modal_content.append(modal_header);
    }

    modal_content.append(modal_body);
    modal_content.append(modal_footer);
    modal_dialog.append(modal_content);
    modal.append(modal_dialog);

    parent.append(modal);

    return modal;

}

function showLoading() {
    var m = create_blank_modal($("body"), "loadingModal", "<center><h4>Laden...</h4><img src='./images/loading.gif'/></center>", "top:30%;");
    m.modal({keyboard: false, backdrop: 'static'}, 'show');
}

function hideLoading() {
    $("#loadingModal").modal('hide');
    $("#loadingModal").remove();
}

function showInfoSmall(text, type, timeout) {
    return bootstrap_alert.info(text, type, timeout);
}

function showLoadingSmall(text, type, timeout) {
    return bootstrap_alert.warning(text, type, timeout);
}
function hideLoadingSmall() {
    return bootstrap_alert.clear();
}

function create_blank_modal(parent, id, html, style) {

    var modal = $("<div class='modal' id=" + id + " tabindex='-1' role='dialog'></div>");
    var modal_dialog = $("<div class='modal-dialog modal-sm' style=" + style + " role='document'></div>");
    var modal_content = $("<div class='modal-content'></div>");
    var modal_body = $("<div class='modal-body'></div>");
    modal_body.append(html);
    modal_content.append(modal_body);
    modal_dialog.append(modal_content);
    modal.append(modal_dialog);
    parent.append(modal);

    return modal;

}

function create_modal_normal(parent, id, html, style, type) {
    if ($("#" + id).length < 1) {
        var modal = $("<div class='modal' id=" + id + " tabindex='-1' role='dialog'></div>");
        var modal_dialog = $("<div class='modal-dialog modal-" + type + "' style=" + style + " role='document'></div>");
        var modal_content = $("<div class='modal-content'></div>");
        var modal_body = $("<div id=" + id + "-body class='modal-body'></div>");
        modal_body.append(html);
        modal_content.append(modal_body);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);
        parent.append(modal);
        return modal;
    } else {
        return $("#" + id);
    }




}

function forms_textarea(title, id, name, choices) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var textarea = $("<textarea wrap='off' class='form-control' name='" + name + "' id='textarea-" + id + "' rows='4'></textarea>");
    form_group.append(label);
    form_group.append(textarea);

    for (var choiceKey in choices) {
        textarea.append(choices[choiceKey] + "\n");
    }
    return form_group;
}
function forms_checkbox(title, id, name, val) {
    var form_check = $("<div style='text-align:left' id='" + id + "' class=\"form-check\"></div>");
    var checkbox = $("<input class=\"form-check-input\" type=\"checkbox\" name='" + name + "' id='" + id + "'>");
    var label = $("<label class=\"form-check-label\" for='" + title + "'>" + title + "<\/label>");
    form_check.append(checkbox);
    form_check.append(label);
    checkbox.attr("checked", val);
    return form_check;
}
function forms_textbox(title, id, name, val) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var textbox = $("<input class=\"form-control\" type=\"text\" value=\"\" name='" + name + "' id='" + id + "' >");
    form_group.append(label);
    form_group.append(textbox);
    textbox.val(val);
    return form_group;
}
function forms_hidden(id, name, val) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var hidden = $("<input class=\"form-control\" type=\"hidden\" value=\"\" name='" + name + "' id='" + id + "' >");
    form_group.append(hidden);
    hidden.val(val);
    return form_group;
}
function forms_select(title, id, name, valObjects, val) {
    console.log("forms_select()");
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var select = $("<select class='form-control' multiple name='" + name + "' id='select-" + id + "'></select>");
    Object.keys(valObjects).forEach(function (key) {
        select.append($("<option value='" + valObjects[key].name + "'>" + valObjects[key].name + "</option>"));
    });
    form_group.append(label);
    form_group.append(select);
    if (typeof val !== "undefined") {
        select.val(val);
    }
    return form_group;

}
function forms_select_single(title, id, name, valObjects, val) {
    console.log("forms_select()");
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var select = $("<select class='form-control' name='" + id + "' id='select-" + id + "'></select>");
    Object.keys(valObjects).forEach(function (key) {
        select.append($("<option value='" + valObjects[key].id + "'>" + valObjects[key].name + "</option>"));
    });
    form_group.append(label);
    form_group.append(select);
    select.val(val);
    return form_group;

}
function forms_jqgrid(id, data) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var jqgrid = $("<table id='jqgrid-" + id + "'></table>");
    jqgrid.jqGrid(data);
    form_group.append(label);
    form_group.append(jqgrid);
    return form_group;
}

function dom_link(id, color, href, txt, _click) {
    var link = $('<a href="' + href + '" id="' + id + '" class="badge bg-' + color + '" target="_blank">' + txt + '</a>');
    if (typeof _click !== "undefined") {
        link.on("click", function () {
            _click(href);
        });
    }
    return link
}
function dom_progressbar(bars, id) {
    var progress = $("<div class='progress' id='" + id + "'></div>");
    Object.keys(bars).forEach(function (index) {
        progress.append("<div class='progress-bar-striped' role='progressbar' style='background-color:" + bars[index].color + ";width: " + bars[index].value + "%' aria-valuenow='" + bars[index].value + "' aria-valuemin='0' aria-valuemax='100'></div>");
    });
    return progress;
}
function dom_moveUpDownList(id, data) {
    console.log("dom_moveUpDownList()");
    var wrapper = dom_div("", id);

    //-------------------
    var container = dom_div("container");
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col("", 6);
    var col2 = dom_col("", 6);
    col1.attr('align', 'center');
    col2.attr('align', 'center');
    var btn1 = dom_button("up", "arrow-up", "", "outline-secondary");
    var btn2 = dom_button("down", "arrow-down", "", "outline-secondary");
    //-------------------
    var row2 = dom_row();
    var col3 = dom_col("", 12);
    var ul = $("<ul class='list-group' id='element-list'></ul> ");

    data.each(function (index, obj) {
        var type = "";
        if (obj.id.includes("editable")) {
            type = "(tekst) ";
        } else if (obj.id.includes("gbox")) {
            type = "(tabel) ";
        }
        ul.append("<li class='list-group-item' style='padding:0.5rem;font-size: 1rem;' element='" + obj.id + "'>" + "<span>" + type + (index + 1) + "</span>" + ": " + obj.innerText.substring(0, 20).trim() + "</li>");
    });

    //-------------------

    container.append(row1);
    row1.append(col1);
    col1.append(btn1);
    row1.append(col2);
    col2.append(btn2);
    container.append(row2);
    row2.append(col3);
    col3.append(ul);
    wrapper.append(container);

    wrapper.find("#up").on('click', function () {
        var $currentElement = $('#element-list .active');
        moveUp($currentElement);
    });

    wrapper.find("#down").on('click', function () {
        var $currentElement = $('#element-list .active');
        moveDown($currentElement);
    });

    var moveUp = function ($currentElement) {
        var hook = $currentElement.prev('.list-group-item');
        if (hook.length) {
            var elementToMove = $currentElement.detach();
            hook.before(elementToMove);
            var toBeMovedDown = $("#" + hook.attr('element'));
            var toBeMovedUp = $("#" + $currentElement.attr('element'));
            toBeMovedUp.detach().insertBefore(toBeMovedDown);
        }



    };

    var moveDown = function ($currentElement) {
        var hook = $currentElement.next('.list-group-item');
        if (hook.length) {
            var elementToMove = $currentElement.detach();
            hook.after(elementToMove);
            var toBeMovedUp = $("#" + hook.attr('element'));
            var toBeMovedDown = $("#" + $currentElement.attr('element'));
            toBeMovedDown.detach().insertAfter(toBeMovedUp);
        }
    };


    return wrapper;
}
function dom_div(_class, _id) {
    return $("<div class='" + _class + "' id='" + _id + "'></div>");
}
function dom_row(id) {
    return $("<div id='" + id + "' style='width:100%;margin-left:auto;margin-right:auto' class='row'></div>");
}
function dom_col(id, size) {
    return $("<div id='" + id + "' class='col-sm-" + size + " mx-auto'></div>");
}
function dom_button(id, icon, text, color) {
    return $("<button type='button' id='" + id + "' class='btn bg-" + color + "'><i class='fa fa-lg fa-fw fa-" + icon + "' style='margin-right:5px;width:auto;max-width:200px'></i><span>" + text + "</span></button>");
}
function dom_list(id, items) {
    var ul = $("<ul class='list-group' id='" + id + "'></ul> ");

    if (typeof items !== "undefined") {
        items.forEach(function (index, obj) {
            ul.append("<li class='list-group-item' element='" + obj.id + "'>" + "<span>" + (index + 1) + "</span>" + ": " + obj.name + "</li>");
        });
    }

    return ul;
}
function dom_list_json(id, items) {
    var wrapper = $("<div></div>");
    var ul = $("<ul class='list-group' id='" + id + "'></ul> ");
    if (typeof items !== "undefined") {
        $.each(items, function (a, b) {
            ul.append("<li class='list-group-item' element='" + b.id + "'>" + "<span>" + (a + 1) + "</span>" + ": " + b.value + "</li>");
        });
    }
    wrapper.append(ul);
    return wrapper;
}
function dom_card(header, body) {
    var card = $("<div class='card'></div>");
    var cardHeader = $("<div class='card-header'></header");
    var cardBody = $("<div class='card-body'></div>");
    //var cardText = $("");
    card.append(cardHeader);
    card.append(cardBody);

    cardHeader.append(header);
    cardBody.append(body);

    return card;
}
function dom_nav(pills, _id) {
    var div = dom_div("", _id);
    var nav = $("<ul class='nav nav-pills mb-3' id='' role='tablist'>");
    $.each(pills, function (id, val) {
        //{'home': 'thuis', 'urgent': 'dringend'};
        nav.append("<li class='nav-item'><a class='nav-link' id='pill" + id + "' data-bs-toggle='pill' href='#tab" + id + "' role='tab' aria-controls='tab" + id + "' aria-selected='true'>" + val + "</a></li>");
    });

    var tab = $("<div class='tab-content' id='pills-tabContent'>");
    $.each(pills, function (id, val) {
        tab.append("<div class='tab-pane fade' id='tab" + id + "' role='tabpanel' aria-labelledby='pill" + id + "'></div>");
    });

    div.append(nav);
    div.append(tab);

    return div;


}
function dom_mainPageContainer(containerID, mainPageContentDivId) {
    var container = dom_div("", containerID);
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col("", 1);
    var col2 = dom_col(mainPageContentDivId, 10);
    var col3 = dom_col("", 1);

    row1.append(col1);
    row1.append(col2);
    row1.append(col3);
    container.append(row1);

    return container;
}
function dom_oneColContainer(containerID) {
    var container = dom_div("", containerID);
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col("", 1);
    var col2 = dom_col(containerID + "-center", 10);
    var col3 = dom_col("", 1);

    row1.append(col1);
    row1.append(col2);
    row1.append(col3);
    container.append(row1);

    return container;
}
function dom_twoColContainer(containerID) {
    var container = dom_div("", containerID);
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col(containerID + "-left", 6);
    var col2 = dom_col(containerID + "-right", 6);
    row1.append(col1);
    row1.append(col2);
    container.append(row1);
    return container;
}
function dom_threeColContainer(containerID) {
    var container = dom_div("", containerID);
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col(containerID + "-1", 4);
    var col2 = dom_col(containerID + "-2", 4);
    var col3 = dom_col(containerID + "-3", 4);
    row1.append(col1);
    row1.append(col2);
    row1.append(col3);
    container.append(row1);
    return container;
}
function dom_fourColContainer(containerID) {
    var container = dom_div("", containerID);
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col(containerID + "-1", 3);
    var col2 = dom_col(containerID + "-2", 3);
    var col3 = dom_col(containerID + "-3", 3);
    var col4 = dom_col(containerID + "-3", 3);
    row1.append(col1);
    row1.append(col2);
    row1.append(col3);
    row1.append(col4);
    container.append(row1);
    return container;
}

function dom_jqGridContainer(name) {
    var container = $("<div class='container-lg' id='" + name + "-container' style='padding:0rem;width:100%;'></div>");
    var row = dom_row();
    //var col1 = dom_col("", "0");
    var col2 = dom_col(name + "-div-grid-wrapper", "12");
    col2.css("padding", "0");
    col2.css("margin", "0");
    //var col3 = dom_col("", "0");
    var table = $("<table id='" + name + "-table'></table>");
    var div = $("<div id='" + name + "-pager'></div>");
    col2.append(table);
    col2.append(div);
    //row.append(col1);
    row.append(col2);
    //row.append(col3);
    container.append(row);
    return container;

}

function dom_jqGridContainerFullWidth(name) {
    var container = $("<div class='container' style='padding:0; margin: 0' id='" + name + "-container'></div>");
    var row = dom_row();
    var col2 = dom_col(name + "-div-grid-wrapper", "12");
    var table = $("<table id='" + name + "-table'></table>");
    var div = $("<div id='" + name + "-pager'></div>");
    col2.append(table);
    col2.append(div);
    row.append(col2);
    container.append(row);
    return container;

}

function dom_collapse() {
    var wrapper = $("<div></div>");
    var btn = $('<button aria-controls="collapseExample" aria-expanded="false" class="btn bg-primary" data-target="#collapseExample" data-toggle="collapse" type="button">Titel... <i class="fa fa-lg fa-fw fa-angle-up" style="margin-right:5px;width:auto;max-width:200px"></i></button>');
    var collapse = $('<div class="collapse" id="collapseExample"></div>');
    var content = $('<p style="margin-bottom: 0rem">&nbsp;</p><div class="card card-body">Inklapbare tekst</div>');
    btn.on("click", function () {
        console.log("show collapse");
        collapse.collapse("toggle");
    });
    collapse.append(content);
    wrapper.append(btn);
    wrapper.append(collapse);
    return wrapper;
}

function not_undefined(test, value) {
    try {
        return test === value;
    } catch (e) {
        return false;
    }

}



function exists(obj) {

}

function canvasToString(canvas) {
    var myImage = new Image();
    myImage.src = canvas.toDataURL("image/png");
    myImage.onload = function ()
    {
        // console.log(myImage.src);
        return myImage.src;

    };
}

function convertURIToImageData(URI) {
    return new Promise(function (resolve, reject) {
        if (URI == null)
            return reject();
        var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                image = new Image();
        image.addEventListener('load', function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        }, false);
        image.src = URI;
    });
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))?' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return true;//!!pattern.test(str);
}

async function loadTemplates() {

    var templates = [];
    async function onDone(data) {
        try {
            var jsonData = JSON.parse(data);
            $.each(jsonData.data, function (a, b) {
                templates.push({title: b.title, description: b.description, image: b.image, html: b.html});
            });
            console.log("Adding templates...");
            CKEDITOR.addTemplates('default',
                    {
                        imagesPath: CKEDITOR.getUrl(CKEDITOR.plugins.getPath('templates') + 'templates/images/'),
                        templates: templates
                    });
        } catch (e) {
            console.log(e);
        }
        return true;
    }
    var requestOptions = {};
    requestOptions.action = "docommand";
    requestOptions.k = "getTemplates";
    // requestOptions.title = "Configurationtables";
    //requestOptions.table = "Templates";
    let request = await LCMSRequest("./servlet", requestOptions);
    await onDone(request);

}



function get_url_extension(url) {
    return url.split(/\#|\?/)[0].split('.').pop().trim();
}

function bytesToHex(bytes) {
    return Array.from(
            bytes,
            byte => byte.toString(16).padStart(2, "0")
    ).join("");
}

// You almost certainly want UTF-8, which is
// now natively supported:
function stringToUTF8Bytes(string) {
    return new TextEncoder().encode(string);
}

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i !== bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

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
    searchOperators: true,
    ignoreCase: true,
    defaultSearch: 'cn'

}, timespanTemplate = {
    align: 'center',
    sorttype: function (cellValue, rowObject) {
        return rowObject.State + "_" + cellValue;
    },
    searchoptions: {
        sopt: ['ge', 'gt', 'eq', 'lt', 'le']
    }
};

$(function () {

    initDateEdit = function (elem) {
        $(elem).datetimepicker({
            format: 'Y-m-d H:i'
        });
    };

    initDateTimeEdit = function (elem) {
        $(elem).datetimepicker({
            format: 'Y-m-d H:i'
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

function LcmsJqGrid1(_tableOptions) {
}

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
        // guiStyle: "bootstrap4",
        //iconSet: "glyph",
        iconSet: "fontAwesome",
        searching: listGridFilterToolbarOptions,
        rowNum: 150,
        mtype: 'POST',
        altRows: true,
        editurl: _editUrl,
        loadonce: true,
        //ondblClickRow: editRow,
        pager: _pagerName,
        caption: _caption,
        pgbuttons: false,
        pgtext: "",
        pginput: false

    };
    var parameters = {
        editParameters: {
            keys: true,
            extraparam: {test: "1", oper: 'add', action: _editAction, LCMS_session: $.cookie('LCMS_session')}
        },
        addParameters: {test: "2", editData: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}},
        navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
            addParams: {
                position: "last",
                addRowParams: {
                    keys: true,
                    extraparam: {test: "3", oper: 'add', action: _editAction, LCMS_session: $.cookie('LCMS_session')}
                }
            },
            editParams: {
                editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                    extraparam: {test: "4", action: _editAction, LCMS_session: $.cookie('LCMS_session')}
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
        if (id && id !== -1) {
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
        gridClickFunctions(e, $(this));
    });

    return _tableObject;
}

function cgenerateView2(data) {
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
            if (typeof value.formatter !== "undefined") {
                column.formatter = value.formatter;
            }
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
        if (value.type === "relation") {
            value.type = "select";
            column.editoptions = {title: "relation"};
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
        if (value.type === "password" || value.type === "encrypted") {
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

        if (typeof value.width !== 'undefined') {
            column.width = value.width;
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

function getJQGridParamByCaption(_name) {
    var gridParam = {};
    //console.log("getJQGridParamByCaption()");
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _name) {
            gridParam = $(b).jqGrid("getGridParam");
            return false;
        }
    });
    return gridParam;
}

function buildHtmlTable(json) {
    if (typeof json === "string") {
        json = $.parseJSON(json);
    }
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

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function set_theme(theme) {
    $('link[title="main"]').attr('href', theme);    
    if (supports_storage) {
        localStorage.theme = theme;
    }
}

var supports_storage = supports_html5_storage();

if (supports_storage) {
    var theme = localStorage.theme;
    if (theme) {
        set_theme(theme);
    }
}

