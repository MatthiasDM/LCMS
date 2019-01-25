var colModels = [];
var references = [];

$(function () {
    //ICTtickets_doLoad($("#ICT-ticket-container"));
    console.log("loading CK config1");
    config2();
    loadGrids();
    $("div[id^=editable]").click(function (e) {
        console.log("clicked");
        if (typeof e.target.href != 'undefined' && e.ctrlKey == true) {
            window.open(e.target.href, 'new' + e.screenX);
        }
    });
});

function new_grid(parentID, colModel, extraOptions, importCSV, gridData, gridId, location) {
    console.log("new_grid()");
    if (typeof colModel === 'undefined') {
        new_grid_popup($("#" + parentID));
    } else {
        var editor = $($("div[id^='wrapper']")[0]);
        var data = [];
        var colData = {};
        colData.header = JSON.stringify(colModel);
        colModel = generateView2(colData);
        var colNames = [];
        for (var key in colModel) {
            if (typeof colModel[key].name !== 'undefined') {
                colNames[key] = colModel[key].name;
            }
        }
        importCSV.forEach(function split(a) {
            var line = a;
            var lineObject = {};
            line.forEach(function split(a, b) {
                lineObject[colNames[b]] = a;
            });
            data.push(lineObject);
        });
        console.log(data);
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

        gridData = Object.assign(gridData, data);
        var tableOptions = {
            id: grid.attr('id'),
            data: gridData,
            datatype: "local",
            colModel: colModel,
            colNames: colNames,
            viewrecords: true, // show the current page, data rang and total records on the toolbar        
            autoheight: true,
            autowidth: true,
            responsive: true,
            headertitles: true,
            searching: listGridFilterToolbarOptions,
            iconSet: "fontAwesome",
            guiStyle: "bootstrap4",
            rowNum: 1000,
            rownumbers: true,
            mtype: 'POST',
            altRows: true,
            //editurl: "_editUrl",
            loadonce: true,
            //onSelectRow: popupEdittRow,
            ondblClickRow: inlineEditRow,
            pager: "#" + pager.attr('id'),
            caption: ""
        };
        generate_grid(editor, grid, tableOptions, extraOptions);
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

function generate_grid(_parent, _grid, _tableOptions, _extraOptions) {
    console.log("generate_grid");
    $.each(_extraOptions, function (i, val) {
        _tableOptions[i] = val;
    });
    //_tableOptions.caption += ("<span class='nosave'><button type='button' id='btn_options' style='padding-right: 20px;' class='close' aria-label='Close'><span aria-hidden='true'>info</span></button></span>");
    // _tableOptions.onSelectRow = popupEdittRow;
    _tableOptions.ondblClickRow = popupEdittRow;
    _grid.jqGrid(_tableOptions);
    _grid.jqGrid('filterToolbar');
    _grid.jqGrid('sortableRows', {});
    var lastSelection;
    var addDataOptions = {editData: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}};

    var navGridParameters2 = {
        add: true,
        del: true,
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

    };

    _grid.inlineNav(_tableOptions.pager, navGridParameters2, {}, addDataOptions);

    _grid.navButtonAdd(_tableOptions.pager, {
        caption: "",
        title: "Click here to change columns",
        buttonicon: "fa-cogs",
        onClickButton: function () {
            new_grid_popup(_parent, _tableOptions);
        },
        position: "last"
    });

    _grid.navButtonAdd(_tableOptions.pager, {
        caption: "",
        title: "Export to plain HTML",
        buttonicon: "fa-download",
        onClickButton: function () {
            export_grid(_grid);
        },
        position: "last"
    });

    _grid.click(function (e) {
        gridClickFunctions(e, $(this))
    });
    //_grid.jqGrid('gridDnD',{connectWith:'#'+_grid.attr('id')}); 
    //_grid.inlineNav(_tableOptions.pager, navGridParameters, {}, addDataOptions);

    $(window).bind('resize', function () {
        _grid.setGridWidth(_parent.width());
    }).trigger('resize');

    $("#btn_options").on('click', function (e) {
        new_grid_popup(_parent, _tableOptions);
    });

}

function popupEdittRow(action) {
    console.log("popupEditRow()");

    $(this).jqGrid('editGridRow', action, {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: $(this).offset().left * -1 + $("body").width() * 0.05,
        position: 'relative',
        modal: true,
        top: $("#" + action).parent().parent().parent().parent()[0].getBoundingClientRect().top * -1 + 100,
        afterShowForm: function (formid) {
            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' ',
                    allowedContent: true
                });
            });
            $("textarea[title=ckedit_code]").each(function (index) {
                //$("textarea[title=ckedit_code]")[0].value = "<pre> <code>" + $("textarea[title=ckedit_code]")[0].value + "</code></pre>";
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' ',
                    allowedContent: true,
                    startupMode: 'source'
                });
            });
            $("#created_on").val(moment().format('D-M-YY'));
        },
        beforeSubmit: function (postdata, formid) {
            $("textarea[title=ckedit]").each(function (index) {
                var editorname = $(this).attr('id');
                var editorinstance = CKEDITOR.instances[editorname];
                var text = editorinstance.getData();
                // CKEDITOR.instances[editorname].element.remove()
                postdata[editorname] = text;
            });
        },
        afterComplete: function (response, postdata, formid) {
            // $(this).trigger( 'reloadGrid' );
            $("#cData").trigger("click");
            bootstrap_alert.warning('Rij toegevoegd', 'info', 1000);
            validation_save();
        },
        editData: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}
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

    var form = createForm(modal.find("div[class='modal-body']"), _gridData);
    modal.modal('show');

    modal.find("button[id=btn-save]").on('click', function (e) {
        e.preventDefault();
        modal.modal('hide');
        var colModelWrapper = createColModel(form, _gridData, _parent);
        var gridId = createGridBasedOnModel(_gridData, colModelWrapper, _parent);
        grids.gridId = _gridData;


    });

    modal.on('hidden.bs.modal', function (e) {
        modal.remove();
    });

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

function createColModel(form, _gridData, parent) {
    console.log("createColModel()");
    var modalArray = form.serializeArray();
    var options = new Object();
    var colModel = new Object();
    var c = -1;
    var summaries = [];
    var groups = [];
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

            options[val.name.substring(7)] = val.value;
        }
        if (val.name.match("^import")) {
            if (val.value.length > 0) {
                importCSV = CSVToArray(val.value, ",");
            }
        }
    });
    console.log(colModel);
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
    return {"colModel": colModel, "options": options};
}

function createForm(parent, _griddata) {
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
                if (colModel[key].name !== "rn") {
                    addRow(form,
                            uuidv4(),
                            colModel[key]);
                }
            }
        }
    } else {
        addRow(form, uuidv4());
    }
    addRowButton.on('click', function (e) {
        addRow(form, uuidv4());
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

    var deleteContentButton = $("<button type='button' style='margin-right: 5px;' class='btn btn-warning'>Verwijder inhoud</button>");
    form.append(deleteContentButton);
    deleteContentButton.on('click', function (e) {
        $("#" + _griddata.id).jqGrid("clearGridData", true);
    });
    var deleteTableButton = $("<button type='button' class='btn btn-danger'>Verwijder tabel</button>");
    form.append(deleteTableButton);
    deleteTableButton.on('click', function (e) {
        $("#" + _griddata.id).remove();
        $("#" + _griddata.id).jqGrid('gridDestroy');
        $("#" + _griddata.id).jqGrid('gridUnload');
    });


    parent.append(form);
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
        element2.after(forms_hidden("option_multiple","option_multiple", true));
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

function getValuesOfAttributeInList(_list, _attribute) {
    var distinctAttributes;
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _list) {
            distinctAttributes = filterUniqueJson($(b).jqGrid("getGridParam").data, _attribute);
        }
    });
    return distinctAttributes;
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
    images.each(function (index) {
        htmlData.find("img[fileid=" + $(images[index]).attr('fileid') + "]").replaceWith($(images[index]));
    });
    htmlData.find("[contenteditable]").attr("contenteditable", false);
    openFile("test.html", "<div class='container'><div class='row'><div class='col-sm-1 mx-auto'></div><div class='col-sm-10 mx-auto'>" + htmlData[0].innerHTML + "</div><div class='col-sm-1 mx-auto'></div></div>");

}

function openFile(filename, text) {
    var x = window.open('about:blank', '_blank');
    x.document.write(text);
    x.document.close();
}