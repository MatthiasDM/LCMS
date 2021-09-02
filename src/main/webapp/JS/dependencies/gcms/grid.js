/* 
 Matthias De Mey
 www.s-dm.be
 */

class LCMSGrid {

    constructor(gridData) {
        this.gridData = gridData;
        this.colModel = [];
        this.lastSelection = 0;
        this.selRowData = {};
        var me = this;
    }

    addGridButton(LCMSTemplateGridButton) {
        var gridData = this.gridData;
        if ($("#" + gridData.pagerID).find("div[title='" + LCMSTemplateGridButton.title + "']").length < 1) {
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

    async download_grid() {
        console.log("Download as CSV");
        var me = this;
        var gridData = this.gridData;
        var callFullRowDataRequest = this.callFullRowDataRequest;
        var selRowsData = {};
        if ($('#' + gridData.tableObject + ' .cbox:visible').length > 0) {
            var gridParam = $("#" + gridData.tableObject).jqGrid('getGridParam');
            var selRows = $("#" + gridData.tableObject).jqGrid("getGridParam", "selarrrow");
            var idColumn = typeof (gridParam.idColumn) !== "undefined" ? gridParam.idColumn : "id";
            var selRowsData = Object.filter(gridParam.data, item => selRows.includes(String(item[idColumn])) === true);
        } else {
            selRowsData = $("#" + gridData.tableObject).jqGrid('getGridParam').data;

        }
        await callFullRowDataRequest(selRowsData, me).then(async function (gridData) {
            var tableData = $.parseJSON(gridData.data.table)
            console.log(tableData);
            var selRowsData = tableData;//Object.filter(data, item => tableData.includes(String(item.id)) === true);
            var arr = [];
            $.each(selRowsData, function (key, value) {
                arr.push(value);
            });
            var csv = Papa.unparse(JSON.stringify(arr));
            let csvContent = "data:text/csv;charset=utf-8," + csv;
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", gridData.jqGridOptions.caption + ".csv");
            document.body.appendChild(link); // Required for FF
            link.click();
            document.body.removeChild(link);
        });




    }

    async callFullRowDataRequest(selRowsData, me) {
        var arr = new Array();
        console.log("start");

        var keys = Object.keys(selRowsData);
        let rowData = new Array();
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                rowData = selRowsData[keys[i]];
                arr.push(rowData);
                console.log("pushing data to export...");
            }
        } else {
            async function onDataFetched(results) {
                arr = $.parseJSON(results).rows;
            }
            if (me.gridData.jqGridOptions.postData != null) {
                var postData = {};
                postData = {
                    "LCMS_session": $.cookie('LCMS_session'),
                    "action": me.gridData.jqGridOptions.postData.action, //"data" + options.relation.collection,
                    "datatype": "json",
                    "include_large_files": "true",
                    "page": 1,
                    "rows": 1000
                };

                let request = await LCMSRequest("./servlet", postData);
                let returnvalue = await onDataFetched(request);

            }

        }

        console.log("end");

        var exportGridData = $.extend(true, {}, me.gridData);
//        delete exportGridData.jqGridOptions.postData;
//        delete exportGridData.jqGridOptions.datatype;
//        delete exportGridData.jqGridOptions.jsonReader;
//        delete exportGridData.jqGridOptions.mtype;
//        delete exportGridData.jqGridOptions.url;
        exportGridData.data.table = JSON.stringify(arr);
        return exportGridData;
    }

    async export_as_html() {
        var me = this;
        var gridData = this.gridData;
        var getFullRowData = this.getFullRowData;
        var callFullRowDataRequest = this.callFullRowDataRequest;
        console.log("exportToHTML()");
        var htmlData = $("<output id='tempOutput'>");
        var style = $("<style>" + getCSSOfHref("./CSS/export.css") + getCSSOfHref("./CSS/style.css") + getCSS() + "</style>");
        htmlData.append(style);
        var htmlTableObject = {};
        var tableData = {};
        var selRowsData = {};
        if ($('#' + gridData.tableObject + ' .cbox:visible').length > 0) {
            var gridParam = $("#" + gridData.tableObject).jqGrid('getGridParam');
            var selRows = $("#" + gridData.tableObject).jqGrid("getGridParam", "selarrrow");
            var idColumn = typeof (gridParam.idColumn) !== "undefined" ? gridParam.idColumn : "id";
            var selRowsData = Object.filter(gridParam.data, item => selRows.includes(String(item[idColumn])) === true);
        } else {
            selRowsData = $("#" + gridData.tableObject).jqGrid('getGridParam').data;

        }

        await callFullRowDataRequest(selRowsData, me).then(async function (gridData) {

            var wrapperDiv = $("<div></div>");
            var gridName = "export";
            var container = dom_jqGridContainerFullWidth(gridName);
            wrapperDiv.append(container);
            var tableObject = container.find("table[id='" + gridName + "-table']");
            htmlData.append(buildHtmlTable(gridData.data.table));
            let imageController = new LCMSImageController();
            var images = imageController.loadImages("", htmlData);
            var imagesLoadedCounter = 0;
            if (images.length > 0) {
                images.each(async function (index) {
                    let src = await imageController.downloadToTemp($(images[index]));
                    if (src.attr) {
                        $(images[index]).attr('src', src.attr("src"));
                    }
                    imageController.toDataURL($(images[index]).attr('src'), function (dataUrl) {
                        htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith("<img src='" + dataUrl + "' >");
                        bootstrap_alert.warning('Images loaded: ' + imagesLoadedCounter, 'success', 1000);
                        if (imagesLoadedCounter === images.length - 1) {
                            htmlData.find("div").attr("contenteditable", false);
                            gcmscore.openFile("test.html", "<div id='export' class='container-lg'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
                        }
                        imagesLoadedCounter++;
                    });
                });
            } else {
                gcmscore.openFile("test.html", "<div id='export' class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");
            }
            return htmlData[0].innerHTML;

        });



    }

    datetimeformatter(cellvalue, options, rowObject) {
        return moment(cellvalue).utcOffset(60).format("Y-MM-DD H:mm");
    }

//    async loadFormatters() {
//        return loadFormatters();
//    }

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

                column.formatoptions = {srcformat: "u1000"};
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
                if (value.formatterName !== "string" && typeof me.formatters !== "undefined") {
                    column.type = "text";
                    column.formatterName = value.formatterName;
                    column.formatterFunction = Object.filter(me.formatters, f => f.name === value.formatterName);
                    column.unformatterFunction = Object.filter(me.formatters, f => f.name === "un" + value.formatterName)
                    column.formatter = column.formatterFunction[value.formatterName];
                    if (typeof column.unformatterFunction !== "undefined") {
                        column.unformatter = column.unformatterFunction["un" + value.formatterName];
                    }

                }
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

            if (type === "pk") {
                console.log("detected Primary key");
                column.type = "pk";
                column.editoptions = {
                    relation: gcmscore.parseJSONString(value.pk)
                };
                me.gridData.jqGridOptions.idColumn = column.name;
            }

            if (type === "fk") {
                value.type = "select";
                column.type = "fk";
                // column.type = "select";
                var fk = gcmscore.parseJSONString(value.fk);
                column.editoptions = {
                    title: "fk",
                    multiple: false,
                    relation: fk,
                    custom_value: function (elem, operation, value) {
                        console.log("setting custom value");
                        return gcmscore.idsFromInputHidden($($(elem)[0]), fk);
                    },
                    custom_element: function (value, options, row) {
                        console.log("relation datainit");
                        if (value === undefined || value === "" || value === "undefined") {
                            value = gcmscore.domFormInputHidden("", uuidv4(), options.cm.name, {}, "").html();
                        }
                        return me.loadExternalList(value, options);
                    },
                    defaultValue: function () {
                        var requestingRow = $(this).jqGrid("getGridParam").requestingRow;
                        if (requestingRow) {
                            if (requestingRow[fk.pk]) {
                                var val = [{"id": ($(this).jqGrid("getGridParam").requestingRow[fk.pk]), "value": ($(this).jqGrid("getGridParam").requestingRow[fk.display])}];
                                return gcmscore.domFormInputHidden("", uuidv4(), fk.pk, val, "").html();
                            }
                        }

                    }
                };
                column.hidden = me.gridData.jqGridOptions.requestingRow ? (me.gridData.jqGridOptions.requestingRow[fk.pk] ? true : false) : false;
                column.edittype = "custom";
                column.relation = fk;

                console.log("foreign key editoptions");

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
            if (typeof value.sorttype !== "undefined") {
                column.sorttype = value.sorttype;
            }
            if (typeof value.foreignKey !== "undefined") {
                if (value.foreignKey !== "") {
                    var foreignKey = value.foreignKey;
                    if (typeof column.editoptions !== "undefined") {
                        column.editoptions.defaultValue = function () {
                            return gcmscore.foreignKeyFunction($(this).jqGrid("getGridParam").requestingGrid.selRowData, foreignKey);
                        };
                    } else {
                        column.editoptions = {defaultValue: function () {
                                return gcmscore.foreignKeyFunction($(this).jqGrid("getGridParam").requestingGrid.selRowData, foreignKey);
                            }};
                    }
                    column.foreignKey = value.foreignKey;
                }
            }

            if (typeof value.width !== 'undefined' && typeof value.lso === "undefined") {
                column.width = value.width;
            }
            column.autoResizable = true;
            view.push(column);
        });
        console.log("Generating view");
        me.colModel = view;
        return view;
    }

    loadExternalList(_value, options) {
        var me = this;
        console.log("loading list");
        var position = "inherit";
        if (options.mode === "edit" || options.mode === "add") {
            position = "absolute";
        }
        var datatarget = "external-list-" + options.relation.collection;
        var datatargetcontent = "external-list-content-" + options.relation.collection;
        var list = $("<div style='' data-bs-target='#" + datatarget + "'>" + _value + "</div><div class='collapse' id='" + datatarget + "' style='position: " + position + ";width: 100%;z-index:100;left:0px;display:block'><div class='card border-secondary mb-6'><div id='" + datatargetcontent + "' style='padding:0' class='card-body text-secondary'></div></div></div>");
        list.find("input[type='text']").attr("style", "");
        $(list).find("input").click(async function (e) {
            e.preventDefault();
            $($(list)[1]).show();
            var tableID = "#" + this.id + "-table";
            if ($(tableID).jqGrid("getGridParam") === null) {
                let LCMSTable = await me.loadExternalList2($($(list)[1]).find("div[id='" + datatargetcontent + "']"), options, this.id);
                var tableID = "#" + this.id + "-table";
                var valueAttr = options.relation.display;
                if ($(tableID).jqGrid().length > 0) {
                    var filters = {"groupOp": "AND", "rules": [{"field": valueAttr, "op": "cn", "data": this.value}]};
                    gcmscore.jqGridFilter(filters, $(tableID));
                }
            }
        });
        $(list).find("input").bind("paste keyup", function (e) {
            var tableID = "#" + this.id + "-table";
            var valueAttr = options.relation.display;
            if ($(tableID).jqGrid().length > 0) {
                var filters = {"groupOp": "AND", "rules": [{"field": valueAttr, "op": "cn", "data": this.value}]};
                gcmscore.jqGridFilter(filters, $(tableID));
            }
        });
        return list;
    }

    async loadExternalList2(me, options, inputId) {
        console.log("loadExternalList2()");
        var content = me;
        var requestingGrid = this;


        content.empty();
        if (!content.is(':empty')) {
            content.empty();
        } else {
            var selectedValues = gcmscore.valuesFromInputHidden($("#" + inputId).parent());
            var filters = {"groupOp": "AND", "rules": []};
            if (options.relation.pk !== "" && options.relation.type === "ManyToOne") {
                var data = "";
                if (typeof this.selRowData[options.name] !== "undefined") {
                    data = this.selRowData[options.name];
                }
                var fieldName = options.relation.pk;
                filters = {"groupOp": "AND", "rules": [{"field": fieldName, "op": "cn", "data": data}]};
            }
            var extraOptionsJSON = {
                onSelectRow: function (rowid) {
                    requestingGrid.onSelectRelationalRow(rowid, options.relation, $('#' + this.id), options.name);
                },
                requestingGrid: requestingGrid,
                //bindkeys: false,
                //selectToInlineEdit: false,
                multiselect: options.relation.type === "ManyToMany",
                //datatype: "json",

                //repeatitems: false,
                //jsonReader: {"id": 2, "root": "rows"},
                //emptyrecords: "Scroll to bottom to load records",
                //scroll: 1,
                //loadonce: false,
                //rowNum: 50,
                //page: 1,
                //url: "./servlet",
                //mtype: "post",
                postData: {
                    "LCMS_session": $.cookie('LCMS_session'),
                    "action": "data" + options.relation.collection
                            // "filters": JSON.stringify(filters)
                },
                //loadBeforeSend: function (jqXHR) {
                //    jqXHR.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; charset=UTF-8');
                //},
                preSelectData: function (grid) {
//                    console.log("preSelectData");
//                    grid.jqGrid('setSelection', 1);
//                    try {
//                        selectedValues = JSON.parse(selectedValues);
//                        $.each(selectedValues, function (a, b) {
//
//                            grid.jqGrid('setSelection', 1);
//                        });
//                    } catch (e) {

                    // }

                }
            };
            if (filters !== null) {
                console.log("adding post filters 1");
                if (typeof filters !== "string") {
                    filters = JSON.stringify(filters);
                }
                extraOptionsJSON.postData.filters = filters;
            }

            let tableName = await gcmscore.loadExternalGrid(options.relation.collection, content, extraOptionsJSON, inputId);
            //gcmscore.jqGridFilter(filters, $("#" + tableName));

            //if ($("#" + tableName).jqGrid().length > 0) {         
            gcmscore.jqGridFilter(filters, $("#" + tableName));
            //}

        }
    }

    async createGrid() {

        console.log("createGrid()");
        var me = this;
        var gridObject;

        //function (result) {
        me.formatters = await gcmscore.fetchFormatters(me.gridData.tableObject.split("-")[0]);
        if (typeof me.formatters !== "undefined") {
            if (me.formatters.reference == null) {
                me.formatters.reference = $.fn.fmatter.reference;
            }
        }

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
            if (typeof value.tablename !== 'undefined' && typeof lang[value.tablename] !== "undefined") {
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
            rowNum: 20,
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
        var parameters = {};
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


        $.each(me.gridData.jqGridOptions, function (i, n) {
            if (i !== "colModel") {
                jqgridOptions[i] = n;
            }

        });
        if (jqgridOptions["url"] !== undefined) {
            console.log("Detected url data, removing data-key");
            delete jqgridOptions["data"];
            jqgridOptions["loadonce"] = false;
            jqgridOptions["reloadAfterSubmit"] = true;


            $.each(me.colModel, function (a, b) {
                if (b.type === "pk" && b.editoptions.relation !== null) {
                    jqgridOptions["subGrid"] = true;
                }
                if (b.type === "fk_zz" && b.editoptions.relation !== null) {
                    jqgridOptions["subGrid"] = true;
                }
            });

            if (jqgridOptions["subGrid"] === true) {
                jqgridOptions["subGridRowExpanded"] = function (subgrid_id, row_id) {
                    var subgrid_table_id;
                    subgrid_table_id = subgrid_id + "_t";
                    var selectedRowData = $(this).jqGrid("getRowData", row_id);
                    $("#" + subgrid_id).closest("td").siblings().remove();
                    $("#" + subgrid_id).closest("td").attr("colspan", "50");
                   // $("#" + subgrid_id).css("width", "max-content");
                    $.each(me.colModel, function (index, column) {
                        if (column.type === "pk" && column.editoptions.relation) {
                            var pk = column.editoptions.relation;
                            if (pk.relations !== null) {
                                $.each(pk.relations, function (index, relation) {

                                    var filters = {"groupOp": "AND", "rules": []};
                                    if (relation.type === "OneToMany") {
                                        var data = "";
                                        if (typeof selectedRowData[column.name] !== "undefined") {
                                            data = selectedRowData[column.name];
                                        }
                                        var fieldName = column.name;
                                        filters = {"groupOp": "AND", "rules": [{"field": relation.fk, "op": "cn", "data": data}]};
                                    }
                                    if (filters !== null) {
                                        var lazyOptions = gcmscore.lazyOptions(relation.collection);
                                        console.log("adding post filters 2");
                                        if (typeof filters !== "string") {
                                            filters = JSON.stringify(filters);
                                        }
                                        lazyOptions.postData.filters = filters;
                                    }
                                    lazyOptions.requestingRow = selectedRowData;
                                    lazyOptions.hiddengrid = true;
                                    lazyOptions.onSelectRow = function (rowid) {
                                        me.onSelectRelationalRow(rowid, pk, $('#' + this.id));
                                    };
                                    console.log("loading relational table...");
                                    gcmscore.loadLazyTable(relation.collection, $("#" + subgrid_id), relation.collection, lazyOptions);


                                });
                            }
                        }
                        if (column.type === "fk_zz") {
                            var fk = column.editoptions.relation;

                            var filters = {"groupOp": "AND", "rules": []};
                            if (fk.type === "ManyToOne") {
                                var data = "";
                                if (typeof selectedRowData[column.name] !== "undefined") {
                                    data = selectedRowData[column.name];
                                    var ids = gcmscore.idsFromInputHidden(data);
                                    if (Array.isArray(ids)) {
                                        data = ids.join("|");
                                    }
                                }
                                var fieldName = fk.pk;
                                filters = {"groupOp": "AND", "rules": [{"field": fieldName, "op": "cn", "data": data}]};
                            }
                            if (filters !== null) {
                                var lazyOptions = gcmscore.lazyOptions(fk.collection);
                                console.log("adding post filters 3");
                                lazyOptions.postData.filters = JSON.stringify(filters);
                            }
                            gcmscore.loadLazyTable(fk.collection, $("#" + subgrid_id), fk.collection, lazyOptions);


                        }
                    });


                };
            }



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
            if (typeof gridData.jqGridOptions.preSelectData !== "undefined") {
                gridData.jqGridOptions.preSelectData(grid);
            }
            if (typeof gridData.jqGridOptions.afterLoadComplete !== "undefined") {
                gridData.jqGridOptions.afterLoadComplete(grid, me);
            }

        };


        jqgridOptions.serializeRowData = function (postdata) {
            console.log(postdata);
            var colModel = $("#" + this.id).jqGrid("getGridParam").colModel;
            var filteredModel = Object.filter(colModel, function (a) {
                console.log(a.type);
                if (a.formatter === "date" || a.type === "datetime") {
                    postdata[a.name] = moment(postdata[a.name]).valueOf();
                } else {
                    return false;
                }
            });
            return postdata;
        };
        jqgridOptions.colModel = jqgridOptions.colModel.filter(function (el) {
            return el !== null;
        });

        var tableObject = typeof me.gridData.tableObject === "object" ? me.gridData.tableObject.jqGrid(jqgridOptions) : $("#" + me.gridData.tableObject).jqGrid(jqgridOptions);
        tableObject.jqGrid(jqgridOptions);


        //replaceProperties(parameters, me.gridData.jqGridParameters);
        $.extend($.jgrid.defaults, {
            ajaxRowOptions: {
                beforeSend: function (jqXHR, settings) {
                    jqXHR.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; charset=UTF-8');
                }
            }
        });
        // var lastSelection;
        function editRow(id) {

            if (id && id !== -1) {
                console.log("editRow");
                me.selRowData = $(this).jqGrid("getRowData", id);
                var grid = $("#" + me.gridData.tableObject);

                $.each(grid.jqGrid("getGridParam").colModelData, function (a, b) {
                    if (b.fk !== "") {
                        var original = $.parseJSON(gcmscore.valuesFromInputHidden(me.selRowData[b.name]));
                        if (Array.isArray(original) && original.length > 0) {
                            me.selRowData[b.name] = original[0].id;
                            console.log(original[0].id);
                        } else {
                            me.selRowData[b.name] = "";
                        }
                    }
                });

                grid.jqGrid('restoreRow', me.lastSelection);
                grid.jqGrid('editRow', id, me.gridData.jqGridParameters.navGridParameters.editParams);
                me.lastSelection = id;
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

        tableObject.inlineNav("#" + me.gridData.pagerID, parameters.navGridParameters);
        tableObject.jqGrid("filterToolbar");
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

            var container = $("#" + gridData.tableObject.slice(0, gridData.tableObject.length - 5) + "container");
            if (typeof container !== "undefined") {
                if (container.parent().width() > 100) {
                    tableObject.setGridWidth(container.width() - 5);
                }
            }

        }).trigger('resize');

        tableObject.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {
            $(".ui-jqgrid-titlebar-close", this).click();
        });
        tableObject.click(function (e) {
            me.gridClickFunctions(e, $(this));
        });
        gridObject = tableObject;
        //}
        //);
        return gridObject;
    }

    onSelectRelationalRow(rowid, relation, gridObject, colName) {
        console.log("setting value");
        var valueArray = new Array();
        var valueIdArray = new Array();
        var datatarget = "external-list-" + relation.collection;

        if (relation.type === "ManyToMany") {
            $.each(gridObject.jqGrid('getGridParam', 'selarrrow'), function (a, b) {
                var vals = new Object();
                vals = {
                    id: gridObject.jqGrid('getRowData', b)[relation.pk],
                    value: gridObject.jqGrid('getRowData', b)[relation.display]
                };
                valueArray.push(vals);
            });
        } else {
            var selRowId = gridObject.jqGrid("getGridParam", "selrow");
            var rowData = gridObject.jqGrid("getRowData", selRowId);
            var vals = new Object();
            vals = {
                id: rowData[relation.pk],
                value: rowData[relation.display],
                meta: rowData
            };
            valueArray.push(vals);
        }


        //var value = $('#' + this.id).jqGrid('getRowData', rowid)[options.relation.pk];

        var target = $("div[data-bs-target='#" + datatarget + "']").find("input[name=" + colName + "]");
        if (target.length > 0) {
            target = target.parent();
            target.find("input[type=hidden]").remove();
            $.each(valueArray, function (a, b) {
                var hiddeninput = $("<input type='hidden'/>");
                hiddeninput.attr("id", b.id);
                hiddeninput.attr("value", b.value);
                hiddeninput.data("meta", JSON.stringify(b.value));
                target.find("input[type=text]").parent().append(hiddeninput);
            });
            var vals = new Array();
            $.each(valueArray, function (a, b) {
                vals.push(b.value);
            });
            target.find("input[type=text]").val(vals);
            target.closest("td").attr("title", vals);
        }
    }

    gridClickFunctions(e, target) {
        var $groupHeader = $(e.target).closest("tr.jqgroup");
        if ($groupHeader.length > 0) {
            target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
            target.css('cursor', 'pointer');
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
        console.log("popupEdit row");
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
                    $(this).css("display", "grid");
                    if (CKEDITOR.instances[$(this).attr('id')] !== undefined) {
                        delete CKEDITOR.instances[$(this).attr('id')];
                    }
                    CKEDITOR.inline($(this).attr('id'));
                });
                $("div[title=ckedit_code]").each(function (index) {
                    $(this).addClass("border rounded p-3");
                    $(this).css("display", "grid");
                    CKEDITOR.replace($(this).attr('id'), {
                        startupMode: 'source',
                        codemirror: {mode: {name: "javascript", json: true, statementIndent: 2}}
                    });


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


                $.each($("#FrmGrid_" + this.id).find("div[data-bs-target*=external-list]"), function (a, b) {
                    postdata[$(b).attr("name")] = gcmscore.idsFromInputHidden($(b));
                });



//                $("#FrmGrid_" + this.id).find("input[data-bs-target*=external]").each(function(index){
//                    var elementName = $(this).attr('id');
//                    postdata[elementName] = $(this).attr('external-values');
//                });


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
                var tableAttr = lang[tableName] === undefined ? rowId : (lang[tableName][rowId] === undefined ? rowId : lang[tableName][rowId]);
                pills.push(tableAttr);
            }
//            if ($(this).find("td.DataTD").find("div[data-bs-target^='#external-list']").length > 0) {
//                var rowId = ($($(this).find("td.DataTD").find("div[data-bs-target^='#external-list']")).attr("id"));
//                var headerItem = Object.filter(me.gridData.data.header, obj => obj.name === rowId);
//                var tableName = headerItem[Object.keys(headerItem)[0]].tablename;
//                var tableAttr = lang[tableName] === undefined ? rowId : (lang[tableName][rowId] === undefined ? rowId : lang[tableName][rowId]);
//                pills.push(tableAttr);
//            }
            ;
        });
        $(form).append(dom_nav(pills, tabId));
        $(form).find("tr[data-rowpos]").each(function () {
            if ($(this).find("td.DataTD").find("div[title='ckedit']").length > 0) {
                console.log(header);
                var rowId = ($($(this).find("td.DataTD").find("div[title='ckedit']")).attr("id"));
                var headerItem = Object.filter(me.gridData.data.header, obj => obj.name === rowId);
                var tableName = headerItem[Object.keys(headerItem)[0]].tablename;
                var tableAttr = lang[tableName] === undefined ? rowId : (lang[tableName][rowId] === undefined ? rowId : lang[tableName][rowId]);
                var rowIndex = pills.indexOf(tableAttr);
                if (rowIndex > 0) {
                    $("#tab" + (rowIndex)).append((this));
                }
            } else {
                $("#tab0").append((this));
//                if ($(this).find("td.DataTD").find("div[data-bs-target^='#external-list']").length > 0) {
//                    console.log(header);
//                    var rowId = ($($(this).find("td.DataTD").find("div[data-bs-target^='#external-list']")).attr("id"));
//                    var headerItem = Object.filter(me.gridData.data.header, obj => obj.name === rowId);
//                    var tableName = headerItem[Object.keys(headerItem)[0]].tablename;
//                    var tableAttr = lang[tableName] === undefined ? rowId : (lang[tableName][rowId] === undefined ? rowId : lang[tableName][rowId]);
//                    var rowIndex = pills.indexOf(tableAttr);
//                    if (rowIndex > 0) {
//                        $("#tab" + (rowIndex)).append((this));
//                    }
//                } else {
//                    $("#tab0").append((this));
//                }

            }
        });
        console.log("show first tab");
        $("#" + tabId + " a[id='pill0']").tab('show');
        return pills;
    }

}





