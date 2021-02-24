/* 
 Matthias De Mey
 www.s-dm.be
 */

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

            var gridParam = $("#" + gridData.tableObject).jqGrid('getGridParam');
            var selRows = $("#" + gridData.tableObject).jqGrid("getGridParam", "selarrrow");
            var idColumn = typeof (gridParam.idColumn) !== "undefined" ? gridParam.idColumn : "id";
            var selRowsData = Object.filter(gridParam.data, item => selRows.includes(String(item[idColumn])) === true);
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
// openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
        }
        return htmlData[0].innerHTML;
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
                if (typeof gridData.jqGridOptions.selectToInlineEdit !== "undefined") {
                    if (gridData.jqGridOptions.selectToInlineEdit === true) {
                        editRow(rowid);
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
        var parameters = {};
//        var parameters = {
//            navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
//                addParams: {
//                    position: "last",
//                    addRowParams: {
//                        keys: true,
//                        extraparam: {oper: 'add', action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
//                    }
//                },
//                editParams: {
//                    editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
//                        //extraparam: {action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
//                        extraparam: {test: "test"}
//                    }//23045
//                }
//            }
//        };
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
                        //datatype: "local",
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
                        editurl: gridData.editUrl, //me.gridData.jqGridOptions.url,
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
                            if (typeof gridData.jqGridOptions.selectToInlineEdit !== "undefined") {
                                if (gridData.jqGridOptions.selectToInlineEdit === true) {
                                    editRow(rowid);
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
                    //var parameters = {};
                    var parameters = {//is replaced with me.griddata.jqgridparameters if available
                        navGridParameters: {add: true, edit: false, del: false, save: false, cancel: false,
//                            addParams: {
////                                position: "last",
////                                addRowParams: {
////                                    keys: true,
////                                    mtype: "PUT",
////                                    extraparam: {oper: 'add', action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')}
////                                }
//                            },
//                            editParams: {
//                                editRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
////                                    keys: true,
////                                    serializeEditData: function (postdata) {console.log("testje hoelijkl")},
////                                    mtype: "POST",
////                                    extraparam: {action: me.gridData.editAction, LCMS_session: $.cookie('LCMS_session')},
////                                    url: me.gridData.editAction
//                                }
//                            }
                        }
                    };
                    replaceProperties(parameters, me.gridData.jqGridParameters);
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
                    if (jqgridOptions["url"] !== undefined) {
                        console.log("Detected url data, removing data-key");
                        delete jqgridOptions["data"];
                    }

                    if (me.gridData.jqGridOptions.rest === true) {
                        jqgridOptions.dataType = "json";
                        jqgridOptions.contentType = "application/json; charset=utf-8";
                        jqgridOptions.ajaxGridOptions = {contentType: 'application/json; charset=utf-8'};
                        jqgridOptions.editurl = me.gridData.jqGridOptions.url;
                        jqgridOptions.serializeRowData = function (data) {
                            //delete data.id;
                            console.log("serializeRowData");
                            return JSON.stringify(data);
                        };
                        $.extend($.jgrid.defaults, {
                            datatype: 'json',
                            ajaxGridOptions: {contentType: "application/json"},
                            ajaxRowOptions: {contentType: "application/json", type: "POST"}
                        });
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
                    //replaceProperties(parameters, me.gridData.jqGridParameters);
                    $.extend($.jgrid.defaults, {
                        ajaxRowOptions: {
                            beforeSend: function () {
                                alert('Before Row Send');
                            }
                        }
                    });
                    var lastSelection;
                    function editRow(id) {
                        if (id && id !== lastSelection) {
                            console.log("editRow");
                            var grid = $("#" + me.gridData.tableObject);
                            grid.jqGrid('restoreRow', lastSelection);
                            //grid.jqGrid('editRow', id, parameters.navGridParameters.editParams.editRowParams);

                            var editparameters = {
                                keys: true,
                                oneditfunc: function () {
                                    console.log("oneditfunc");
                                },
                                successfunc: function () {
                                    console.log("successfunc");
                                },
                                //url: me.gridData.jqGridOptions.url,
                                //url: me.gridData.editurl,
                                extraparam: {},
                                aftersavefunc: function () {
                                    console.log("aftersavefunc");
                                },
                                mtype: "POST"
                            };
                            grid.jqGrid('editRow', id, editparameters);
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
                    if (typeof gridData.jqGridOptions.bindkeys !== "undefined") {
                        if (gridData.jqGridOptions.bindkeys === true) {
                            $("#" + me.gridData.tableObject).jqGrid('bindKeys', {
                                "onEnter": function (rowid) {
                                    editRow(rowid);
                                }
                            });
                        }
                    }
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
                    $(this).replaceWith("<div contenteditable='true' title=ckedit_code id='" + $(this).attr("id") + "'>" + $(this).val() + "</div>");
                });
                $("div[title=ckedit]").each(function (index) {
                    $(this).addClass("border rounded p-3");
                    CKEDITOR.inline($(this).attr('id'));
                });
                $("div[title=ckedit_code]").each(function (index) {
                    $(this).addClass("border rounded p-3");
                    CKEDITOR.replace($(this).attr('id')).config.startupMode = 'source';

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
                scrollTo($($("input")[0]));
            },
            onclickSubmit: function (params, postdata) {
                console.log("onclickSubmit()");
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
                $("div[title=ckedit_code]").each(function (index) {
                    console.log("getting data from ckeditor source mode instance...");
                    var editorname = $(this).attr('id');
                    var editorinstance = CKEDITOR.instances[editorname];                  
                    var text = editorinstance.getData();
                    //text = removeElements("nosave", text);
                    postdata[editorname] = text;
                });
                var colModel = $("#" + this.id).jqGrid("getGridParam").colModel;
                var filteredModel = Object.filter(colModel, function (a) {
                    console.log(a.type);
                    if (a.formatter === "date" || a.type === "datetime") {
                        postdata[a.name] = moment(postdata[a.name]).valueOf();
                    } else {
                        return false;
                    }
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
                if (typeof _afterSubmitFunction !== "undefined") {
                    _afterSubmitFunction();
                }

            },
            editData: {
                action: gridData.editAction,
                LCMS_session: $.cookie('LCMS_session'),
                // url: me.gridData.editAction
            },
            //url: me.gridData.editAction,
            mtype: "POST"
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
                    $("#tab" + (rowIndex)).append((this));
                }
            } else {
                $("#tab0").append((this));
            }
        });
        console.log("show first tab");
        $("#" + tabId + " a[id='pill0']").tab('show');
        return pills;
    }

}





