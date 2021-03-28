/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
            var jqgridFunctionList = ["beforeRequest", "a", "b", "loadBeforeSend", "beforeProcessing", "searching", "loadComplete", "onSelectRow"];
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
//            if (typeof extraOptions.subgridof !== "undefined") {
//
//                var id = getJQGridParamByCaption(extraOptions.subgridof).id;
//                var params = getJQGridParamByCaption(extraOptions.subgridof);
//                var createSubGrid = (async function () {
//                    let promise = new Promise((res, rej) => {
//                        res(documentGrid.createGridOptions(id + "_subgridTableTemplate", {pager: "#" + id + "_subgridPagerTemplate"}));
//                    });
//                    let subGridTemplate = await promise;
//                    params.subgridTemplate = subGridTemplate;
//                });
//                params.subGridRowExpanded = function (subgridDivId, rowId) {
//                    var subgridTableId = subgridDivId + "_t";
//                    $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table><div id='pager_" + subgridTableId + "'></div>");
//                    var createSubGrid = (async function () {
//                        let promise = new Promise((res, rej) => {
//                            res(documentGrid.createGridOptions(subgridTableId, {pager: "#pager_" + subgridTableId}));
//                        });
//                        let value = await  promise;
//                        $("#" + subgridTableId).jqGrid(value);
//                        params.subgridTemplate = value;
//                        //documentGrid = new LCMSGrid($("#" + subgridTableId).jqGrid("getGridParam"));
//                        gridData.tableObject = subgridTableId;
//                        gridData.pagerID = "pager_" + subgridTableId;
//                        gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
//                        documentGrid.gridData.pagerID = "pager_" + subgridTableId;
//                        documentGrid.gridData.jqGridOptions.pager = "#pager_" + subgridTableId;
//                        documentGrid.gridData.tableObject = subgridTableId;
//                        documentPage.gridController.addLCMSGrid(subgridTableId, documentGrid);
//                        $("#" + subgridTableId).inlineNav("#" + gridData.pagerID, gridData.jqGridParameters.navGridParameters);
//                    })();
//                };
//                //params.subgridof = extraOptions.subgridof;
//                // params.subgridTemplate = $("#" + id).jqGrid("getGridParam");
//                params.subGridHasSubGridValidation = me.checkHasSubGrid;
//                $("#" + id).jqGrid("setGridParam", params);
//                $("#" + id).trigger("reloadGrid");
//            }


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
        var element2 = $("<select class='form-control' name='type' id='type-" + elementID + "'><option value='text'>Tekst</option><option value='number'>Getal</option><option value='boolean'>Ja/Nee</option><option value='euro'>Euro</option><option value='cktext_code'>Code</option><option value='date'>Datum</option><option value='cktext'>Tekst met opmaak</option><option value='select'>Keuzelijst</option><option value='internal_list' multiple='true'>Interne lijst</option><option value='relation'>Externe lijst</option><option value='customformatter'>Aangepast</option></select>");
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
                if (colModelValue.editoptions.title === "relation") {
                    typeVal = "relation";
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

