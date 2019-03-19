var colModels = [];
var references = [];


$(function () {
    //ICTtickets_doLoad($("#ICT-ticket-container"));
//    console.log("loading CK config2");
//    config2();
    loadGrids();

    $("div[id^=editable]").click(function (e) {
        console.log("clicked");
        if (typeof e.target.href !== 'undefined' && e.ctrlKey === true) {
            window.open(e.target.href, 'new' + e.screenX);
        }
    });


    var numEditors = $("div[contenteditable]").length;
    var counter = 0;
    $("div[contenteditable]").each(function (a, b) {
        var ck = CKEDITOR.inline($(b).attr('id'));
        ck.on('instanceReady', function (ev) {
            var editor = ev.editor;
            editor.setReadOnly(false);
            counter++;
            if (counter === numEditors) {
                loadSideBarMenu();
            }
        });
        ;
    });

    $("#validation-elements").remove();

});


function loadSideBarMenu() {
    console.log("loadSideBarMenu()");
    $("#sidebar .menu-wrapper").empty();
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
    col2.append($("#div-validation-menu"));
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
    loadTOC($("div[id^=editable]"), col2);
    row2.append(col2);
    sidebarContainer.append(row2);
    //---------------------------------------------------
    var row1 = dom_row("sidebar-row-1");
    var col1 = dom_col("sidebar-col-1", 12);
    var div1 = dom_div("navbar-brand", "sidebar-title");
    col1.css("text-align", "center");
    div1.css("margin-right", "0px");
    div1.css("margin-top", "0.5em");
    div1.append("Structuur");
    col1.append(div1);
    col1.append("<hr>");
    row1.append(col1);
    sidebarContainer.append(row1);
    //---------------------------------------------------
    var row3 = dom_row("sidebar-row-3");
    var col3 = dom_col("sidebar-col-3", 12);
    var div3 = dom_div("", "structure-container");
    div3.append(dom_moveUpDownList("validation-elements", $("div[id^=gbox_grid], div[id^=editable]")));
    col3.append(div3);
    row3.append(col3);
    sidebarContainer.append(row3);
    $("#sidebar .menu-wrapper").append(sidebarContainer);
    //---------------------------------------------------

    //$("#sidebar .menu-wrapper").append($("#div-validation-menu"));
    //$("#sidebar .menu-wrapper").append(dom_moveUpDownList("validation-elements", $("div[id^=gbox_grid], div[id^=editable]")));
    $("#importTableButton").change(function () {

        $.each(this.files, function (index, file) {
            var reader = new FileReader();
            var name = file.name;
            reader.onload = function (e) {
                var text = reader.result;
                console.log(text);
                bootstrap_alert.warning(name, "info", 1000);
                createGridBasedOnImportFile($($("div[id^='wrapper']")[0]), createDataAndModelFromCSV(text), name);
            };
            reader.readAsText(file);

        });

    });
}



function new_grid(parentID, colModel, extraOptions, importCSV, _gridData, gridId, location) {
    console.log("new_grid()");

    if (typeof colModel === 'undefined') {
        new_grid_popup($("#" + parentID));
    } else {

        var editor = $($("div[id^='wrapper']")[0]);
        var uuid = gridId;
        var grid = $("<table id='" + uuid + "'></table>");
        var pager = $("<div id='pager_" + uuid + "'></div>");
        if (typeof location !== "undefined") {
            location.after(grid);
            location.after(pager);
        } else {
            editor.append(grid);
            editor.append(pager);
        }
        var data = [];
        importCSV.forEach(function split(a) {
            var line = a;
            var lineObject = {};
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
                            validation_save();
                        }
                    }
                }
            }
        };
        $.each(extraOptions, function (i, n) {
            gridData.jqGridOptions[i] = n;
        });
        let documentGrid = new LCMSGrid(gridData);
        var gridObject = documentGrid.createGrid();
        addGridButtons(documentGrid, gridObject, gridData, editor);


    }



}

function new_editable_field() {
    console.log("new_editable_field()");
    var editor = $($("div[id^='wrapper']")[0]);
    var editable_field = $("<div id='editable_" + uuidv4() + "' contenteditable='true'><p>Nieuw bewerkbaar veld</p></div>");
    editor.append(editable_field);
    var ck = CKEDITOR.inline(editable_field.attr('id'));

    ck.on('instanceReady', function (ev) {
        var editor = ev.editor;
        editor.setReadOnly(false);
    });
}

function inlineEditRow(id) {
    console.log("inlineEditRow()");
    if (id && id !== lastSelection || $(this).jqGrid('getGridParam', 'records') === 1) {
        var grid = $(this);
        grid.jqGrid('restoreRow', lastSelection);
        var editParameters = {
            keys: true,
            extraparam: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')},
            beforeSubmit: function (postdata, formid) {
                validation_save();
            }
        };
        grid.jqGrid('editRow', id, editParameters);
        lastSelection = id;
    }
}

function new_grid_popup(_parent, _gridData) {
    console.log("new_grid_popup()");
    var modal = create_modal(_parent, "Tabel invoegen of wijzigen", "");

    var form = createForm(modal.find("div[class='modal-body']"), _gridData, modal);
    modal.modal('show');

    modal.find("button[id=btn-save]").on('click', function (e) {
        e.preventDefault();
        modal.modal('hide');

        var colModelWrapper = createColModel(form, _gridData, _parent); //1. create new colModel
        var newColumns = filterUniqueJson(colModelWrapper.colModel, "name"); //2. remove unused rows of data
        if (typeof _gridData !== "undefined") {
            _gridData.data = removeUnusedDataFromJqGrid(newColumns, _gridData.data, colModelWrapper.options.renames);
        }
        var gridId = createGridBasedOnModel(_gridData, colModelWrapper, _parent); //3. create new grid based on colModel




    });

    modal.on('hidden.bs.modal', function (e) {
        modal.remove();
    });

}

function toggle_multiselect(gridId) {
    console.log("toggle_multiselect()");
    $('#' + gridId).jqGrid("setGridParam", {multiselect: true});

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

function createGridBasedOnModel(_gridData, _colModelWrapper, _parent) {
    var data = [];
    var importCSV = [];
    var gridId;
    if (typeof _gridData !== "undefined") {
        var gridData = A = $.extend(true, [], _gridData);//_gridData.clone();
        gridId = gridData.id;
        _parent.find(("div[id^=gbox_" + gridData.id + "]")).each(function (a, b) {
            $(b).after("<div name='" + gridData.id + "'></div>");
            $(b).remove();
        });
        _parent.find(("div[id^=pager_gbox_" + gridData.id + "]")).each(function (a, b) {
            $(b).remove();
        });
        $('#' + _gridData.id).jqGrid('GridUnload');



        new_grid(_parent.attr('id'), _colModelWrapper.colModel, _colModelWrapper.options, importCSV, gridData.data, gridData.id, $("div[name=" + gridData.id + "]"));
        $("div[name=" + gridData.id + "]").remove();
    } else {
        gridId = "grid_" + uuidv4();
        new_grid(_parent.attr('id'), _colModelWrapper.colModel, _colModelWrapper.options, importCSV, data, gridId);
    }

    return gridId;
}

function createGridBasedOnImportFile(_parent, importData, caption) {
    var gridId = "grid_" + uuidv4();
    new_grid(_parent.attr('id'), importData.colModel, {caption: caption}, [], importData.data, gridId);
}

function createColModel(form, _gridData, parent) {
    console.log("createColModel()");
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
        }
        if (val.name === 'internalListName') {
            colModel[c].internalListName = val.value;
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

            if (option === 'summary') {
                summaries.push(val.value);
                Object.keys(colModel).forEach(function (i) {
                    if (colModel[i].name === val.value) {
                        colModel[i].summaryTpl = [
                            "<span style=''>Subtotaal: {0}</span>"
                        ];
                        colModel[i].summaryType = "sum";
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
            options[val.name.substring(7)] = val.value;
        }
        if (val.name.match("^import")) {
            if (val.value.length > 0) {
                importCSV = CSVToArray(val.value, ",");
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
            //groupColumnShow: [false, false],
            groupText: ['<b>{0} - {1} Item(s) </b>', '<b>{0} - {1} Item(s)</b>'],
            groupCollapse: false,
            groupSummaryPos: ["header", "header"],
            groupSummary: [true, true]
        };

    } else {
        options.grouping = false;
    }

    if (typeof subgridref.colNames !== "undefined") {
        options.subgridref = subgridref;
        options = option_subgrid(options, subgridref);


    }

    return {"colModel": colModel, "options": options};
}


function createForm(_parent, _griddata, _modal) {
    console.log("createForm()");
    if (typeof _griddata === 'undefined') {
        _griddata = {};
    }
    var form = $("<form></form>");
    var container = $("<div class='container'></div>");
    var addRowButton = $("<button type='button' class='btn btn-primary'>Add column</button>");
    form.append(container);
    form.append(forms_textbox("Titel", "option_caption", "option_caption", _griddata.caption));
    form.append(forms_checkbox("Geminimaliseerd starten", "option_hiddengrid", "option_hiddengrid", _griddata.hiddengrid));
    form.append(forms_textarea("Importeer CSV", "import", "import"));
    form.append(addRowButton);
    addHeader(form);

    if (typeof _griddata.colModel !== 'undefined') {
        var colModel = _griddata.colModel;
        for (var key in colModel) {
            if (typeof colModel[key].name !== 'undefined') {
                if (colModel[key].name !== "rn" && colModel[key].name !== "cb" && colModel[key].name !== "subgrid") {
                    addRow(form,
                            uuidv4(),
                            colModel[key]);
                }
            }
        }
    } else {
        addRow(form, uuidv4(), {});
    }
    addRowButton.on('click', function (e) {
        addRow(form, uuidv4(), {});
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

    // if (isEmptyObj(Object.filter(gridController.references, reference => reference.list === _griddata.id))) {
    var gridReferences = [];
    gridController.references.forEach(function (item) {
        var id = item.list;
        var name = gridController.grids[id].caption;
        gridReferences.push({id, name});

    });
    form.append(forms_select("Subgrid van: ", "option_subgridref", "option_subgridref", gridReferences, _griddata.subgrid));
    // }



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

function addHeader(parent) {
    var row = $("<div class='row'></div>");
    row = addLabel(row, "Naam", 4);
    row = addLabel(row, "Type", 4);
    row = addLabel(row, "Verborgen", 2);
    row = addLabel(row, "", 2);
    parent.append(row);
    return parent;

}

function addLabel(parent, text, colWidth) {
    var col = $("<div class='col-sm-" + colWidth + " mx-auto'></div>");
    var formGroup = $("<div class='form-group'></div>");
    var label = $("<label><center>" + text + "</center></label>");

    formGroup.append(label);
    col.append(formGroup);

    parent.append(col);

    return parent;


}

function addElement(parent, element, colWidth, clazz) {
    var col = $("<div class='col-sm-" + colWidth + " mx-auto' style='text-align:center;top: 5px;'></div>");
    var formGroup = $("<div class='" + clazz + "'></div>");
    formGroup.append(element);
    col.append(formGroup);
    parent.append(col);
    return parent;
}

function addRow(parent, elementID, colModelValue) {
    console.log("addRow()");

    var nameVal = colModelValue.name;
    var typeVal = colModelValue.edittype || colModelValue.formatter || colModelValue.template;
    var choiceList = colModelValue.editoptions;
    var visibleVal = colModelValue.hidden;



    var row = dom_div("row row-striped");

    var element1 = $("<input type='text' class='form-control' name='name' id='name-" + elementID + "' placeholder='fieldname'>");
    element1.val(nameVal);
    row = addElement(row, element1, 4, "form-group");

    var element2 = $("<select class='form-control' name='type' id='type-" + elementID + "'><option value='text'>Tekst</option><option value='number'>Getal</option><option value='euro'>Euro</option><option value='cktext_code'>Code</option><option value='date'>Datum</option><option value='cktext'>Tekst met opmaak</option><option value='select'>Keuzelijst</option><option value='internal_list' multiple='true'>Interne lijst</option><option value='external_list'>Externe lijst</option></select>");
    if (typeVal === "textarea" && colModelValue.editoptions.title === "ckedit") {
        typeVal = "cktext";
    }
    if (typeVal === "textarea" && colModelValue.editoptions.title === "ckedit_code") {
        typeVal = "cktext_code";
    }
    if (typeVal === "select" && colModelValue.editoptions.title === "internal_list") {
        typeVal = "internal_list";
    }
    if (typeVal === "select" && colModelValue.editoptions.title === "external_list") {
        typeVal = "external_list";
    }

    if (typeof typeVal !== "undefined") {
        if (typeVal.sorttype === "number") {
            typeVal = "number";
        }
    }

    element2.val(typeVal);
    row = addElement(row, element2, 4, "form-group");

    var element3 = $("<input type='checkbox' class='form-check-input' name='option_hidden' id='hidden-" + elementID + "' placeholder='fieldname'>");
    element3.attr("checked", visibleVal);
    row = addElement(row, element3, 2, "form-check");

    var element4 = $("<button type='button' class='btn btn-secondary'>X</button>");
    row = addElement(row, element4, 2, "form-group");

    element1.on('change', function (e) {
        if ($("#option_rename-name-" + elementID).length < 1 && typeof nameVal !== "undefined") {
            if (element1.val !== nameVal) {
                element1.after(forms_hidden("option_rename-name-" + elementID, "option_rename", nameVal));
            }

        }
    });

    element2.on('change', function (e) {
        var val = this.value;
        if (this.value === 'select') {
            element2.after(forms_textarea('Keuzelijst', "choicelist-" + elementID, "choices"));
        } else {
            parent.find("div[id='" + "choicelist-" + elementID + "']").remove();
        }
        if (this.value === 'internal_list') {
            createInternalList(parent, element2, elementID);

        } else {
            parent.find("div[id='" + "select-" + elementID + "']").remove();
            parent.find("div[id='" + "select-attribute-" + elementID + "']").remove();
        }

    });



    if (typeVal === "select") {
        element2.after(forms_textarea('Keuzelijst', "choicelist-" + elementID, "choices", choiceList.value));
    }
    if (typeVal === "internal_list") {
        element2.after(forms_select("Kies attribuut: ", "select-attribute-" + elementID, "internalListAttribute", getAttributesOfGrid(colModelValue.internalListName), colModelValue.internalListAttribute));
        element2.after(forms_select("Kies tabel: ", "select-" + elementID, "internalListName", getGridsInDocument(), colModelValue.internalListName));
        element2.after(forms_hidden("option_multiple", "option_multiple", true));
    }
    if (typeVal === "external_list") {

    }





//    if(choiceList.length){
//                
//    }

    element4.on('click', function (e) {
        row.remove();
    });


    parent.append(row);
    return parent;

}

function createInternalList(parent, insetAfterObject, elementID) {
    var obj = getGridsInDocument();

    var forms_select_internal_list = forms_select("Kies tabel: ", "select-" + elementID, "internalListName", obj, "");
    insetAfterObject.after(forms_select_internal_list);
    $("#select-" + forms_select_internal_list.attr("id")).on('change', function (e) {
        parent.find("div[id='" + "select-attribute-" + elementID + "']").remove();
        var obj = getAttributesOfGrid(this.value);
        var forms_select_attribute = forms_select("Kies attribuut: ", "select-attribute-" + elementID, "internalListAttribute", obj, "");
        forms_select_internal_list.after(forms_select_attribute);
    });

}

function getGridsInDocument() {
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

function gridClickFunctions(e, target) {
    var $groupHeader = $(e.target).closest("tr.jqgroup");
    if ($groupHeader.length > 0) {
        target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
        target.css('cursor', 'pointer');
        var index = gridIds.map(function (e) {
            return e.gridid;
        }).indexOf(target.attr('id'));

        var indexofClickItem = gridIds[index].gridexpandedgroups.find(function (a) {
            return a === $groupHeader.attr("id")
        });
        if (typeof indexofClickItem !== "undefined") {
            gridIds[index].gridexpandedgroups.splice(indexofClickItem, 1);
        } else {
            gridIds[index].gridexpandedgroups.push($groupHeader.attr("id"));
        }
    }

    $groupHeader = $(e.target).closest("span.tree-wrap");
    if ($groupHeader.length > 0) {
        target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
    }

}

function exportToHTML() {
    console.log("exportToHTML()");
    var htmlData = $("<output id='tempOutput'>");
    htmlData.append("<link rel='stylesheet' href='./JS/dependencies/bootstrap/bootstrap_themes/flatly/bootstrap.min.css'>");
    htmlData.append("<link rel='stylesheet' href='./CSS/style.css'>");
    htmlData.append("<link rel='stylesheet' href='./HTML/validation/template/export.css'>");
    var style = $("<style>" + getCSS() + "</style>");
    htmlData.append(style);
    htmlData.append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"))));
    var htmlTables = {};
    $("table[id^=grid]").each(function (a, b) {
        if ($(b).jqGrid('getGridParam') !== null) {
            htmlTables[$(b).attr('id')] = buildHtmlTable($(b).jqGrid('getGridParam').data);
        }
    });
    htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
        var htmlTable = "<table class='table'>" + htmlTables[$(b).attr('id').substring(5)][0].innerHTML + "</table>";
        $(b).after("<div name='" + $(b).attr('id') + "' style='overflow-x:auto'>" + htmlTable + "</div>");
        $(b).remove();
    });
    var images = loadImages("", htmlData);
    var imagesWrapper = $("<div></div>");
    let imageController = new LCMSImageController();
    var allImagesLoaded = false;
    var imagesLoadedCounter = 0;
    images.each(function (index) {
        //htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith($(images[index]));
        imageController.toDataURL($(images[index]).attr('src'), function (dataUrl) {

            htmlData.find("img[fileid=" + $(images[imagesLoadedCounter]).attr('fileid') + "]").replaceWith("<img src='" + dataUrl + "' >");

            bootstrap_alert.warning('Images loaded: ' + imagesLoadedCounter, 'success', 1000);
            if (imagesLoadedCounter === images.length - 1) {
                htmlData.find("div").attr("contenteditable", false);
                openFile("test.html", "<div class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");

            }
            imagesLoadedCounter++;

        });
    });





}

function openFile(filename, text) {
    var blob = new Blob([text], {type: "text/html;charset=utf-8"});
    saveAs(blob, filename);

    var x = window.open('http://localhost:8080/LCMS/index.html?p=temp', '_blank');
    x.document.write(text);
    x.document.close();
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

