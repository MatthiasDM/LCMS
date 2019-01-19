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

//function new_sketch() {
//    var editor = $($("div[id^='wrapper']")[0]);
//    var sketch_field = $("<div id='sketch_" + uuidv4() + "'></div>");
//    editor.append(sketch_field);
//    LC.init(sketch_field, {imageSize: {width: 500, height: null}})
//}

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
        caption: "Options",
        title: "Click here to change columns",
        buttonicon: "ui-icon-plusthick",
        onClickButton: function () {
            new_grid_popup(_parent, _tableOptions);
        },
        position: "last"
    });

    _grid.navButtonAdd(_tableOptions.pager, {
        caption: "Export",
        title: "Export to plain HTML",
        buttonicon: "ui-icon-plusthick",
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
        top: $("#" + action).parent().parent().parent().parent()[0].getBoundingClientRect().top * -1 + 200,
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

function new_grid_popup(parent, _gridData) {
    console.log("new_grid_popup()");
    var modal = create_modal(parent, "Tabel invoegen of wijzigen", "");

    var form = createForm(modal.find("div[class='modal-body']"), _gridData);
    modal.modal('show');

    modal.find("button[id=btn-save]").on('click', function (e) {
        e.preventDefault();
        modal.modal('hide');
        var modalArray = form.serializeArray();
        var importCSV = [];
        //importCSV
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
                var
                        choices = val.value.split(/\r?\n/);
                choices.for()
                colModel[c].choices = val.value.split(/\r?\n/);

            }

//            if (val.name === 'summary') {
//                if(val.value === "on"){
//                    colModel[c].summaryType = 'sum';
//                }                
//            }

            if (val.name.match("^option")) {
                var option = val.name.substring(7);
                if (option === 'hidden') {
                    if (val.value === "on") {
                        colModel[c].hidden = true;
                        colModel[c].visibleOnForm = true;
                    }
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

//            colModel[0].name = 
//            $("#" + i).append(document.createTextNode(" - " + val));
        });
        //  delete colModel[c];
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

        var data = [];
        var gridId;
        if (typeof _gridData !== "undefined") {
            var gridData = A = $.extend(true, [], _gridData);//_gridData.clone();
            gridId = gridData.id;
            parent.find(("div[id^=gbox_" + gridData.id + "]")).each(function (a, b) {
                $(b).after("<div name='" + gridData.id + "'></div>");
                $(b).remove();
            });
            parent.find(("div[id^=pager_gbox_" + gridData.id + "]")).each(function (a, b) {
                $(b).remove();
            });
            $('#' + _gridData.id).jqGrid('GridUnload');
            new_grid(parent.attr('id'), colModel, options, importCSV, gridData.data, gridData.id, $("div[name=" + gridData.id + "]"));
            $("div[name=" + gridData.id + "]").remove();
        } else {
            gridId = "grid_" + uuidv4()
            new_grid(parent.attr('id'), colModel, options, importCSV, data, gridId);
        }

        return colModel;
    });

    modal.on('hidden.bs.modal', function (e) {
        modal.remove();
    });

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
                    addRow(form, uuidv4(), colModel[key].name, colModel[key].edittype || colModel[key].formatter || colModel[key].template, colModel[key].editoptions, colModel[key].hidden, colModel[key]);
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

function addRow(parent, elementID, nameVal, typeVal, choiceList, visibleVal, colModel) {
    console.log("addRow()");
    var row = dom_div("row row-striped");

    var element1 = $("<input type='text' class='form-control' name='name' id='name-" + elementID + "' placeholder='fieldname'>");
    element1.val(nameVal);
    row = addElement(row, element1, 4, "form-group");

    var element2 = $("<select class='form-control' name='type' id='type-" + elementID + "'><option value='text'>Tekst</option><option value='number'>Getal</option><option value='euro'>Euro</option><option value='cktext_code'>Code</option><option value='date'>Datum</option><option value='cktext'>Tekst met opmaak</option><option value='select'>Keuzelijst</option><option value='internal_list'>Interne lijst</option><option value='external_list'>Externe lijst</option></select>");
    if (typeVal === "textarea" && colModel.editoptions.title === "ckedit") {
        typeVal = "cktext";
    }
    if (typeVal === "textarea" && colModel.editoptions.title === "ckedit_code") {
        typeVal = "cktext_code";
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
//        if (this.value === 'number') {
//            element2.after(forms_checkbox('Samenvatting', "summary-" + elementID, "option_summary", false));
//        } else {
//            parent.find("div[id='" + "summary-" + elementID + "']").remove();
//        }
    });




    if (typeVal === "select") {
        element2.after(forms_textarea('Keuzelijst', "choicelist-" + elementID, "choices", choiceList.value));
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

function mapGridDataToColumns(data, columns) {

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