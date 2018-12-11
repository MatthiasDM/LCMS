$(function () {
    //ICTtickets_doLoad($("#ICT-ticket-container"));
    console.log("loading CK config1");
    config1();
    loadGrids();
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
            iconSet: "fontAwesome",
            guiStyle: "bootstrap4",
            searching: {
                defaultSearch: "cn"
            },
            rowNum: 20,
            mtype: 'POST',
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
    var lastSelection;
    var addDataOptions = {editData: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}};
    var navGridParameters = {add: true, edit: false, del: false, save: false, cancel: false, addParams: {position: "last", addRowParams: {
                keys: true,

                oneditfunc: function (grid) {
                    if (typeof lastSelection !== 'undefined') {
                        grid.jqGrid('restoreRow', lastSelection)
                    }
                },
                extraparam: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}
            }}};

    var navGridParameters2 = {add: true, addParams: {rowID: "row" + uuidv4(), position: "last", addRowParams: {rowID: "row" + uuidv4(), position: "last", keys: true}}};

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

    //_grid.inlineNav(_tableOptions.pager, navGridParameters, {}, addDataOptions);

    $(window).bind('resize', function () {
        _grid.setGridWidth(_parent.width() - 10);
    }).trigger('resize');

    $("#btn_options").on('click', function (e) {
        new_grid_popup(_parent, _tableOptions);
    });

}

function popupEdittRow(action) {

    $(this).jqGrid('editGridRow', action, {
        reloadAfterSubmit: false,
        width: $("body").width() * 0.9,
        left: $(this).offset().left * -1 + $("body").width() * 0.05,
        top: $(this).offset().top * -1 + 140,
        afterShowForm: function (formid) {
            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' '
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
            console.log("Checking post data");
        },
        afterComplete: function (response, postdata, formid) {
            // $(this).trigger( 'reloadGrid' );
            $("#cData").trigger("click");
            bootstrap_alert.warning('Rij toegevoegd', 'info', 1000);
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
            extraparam: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}
//                oneditfunc: function(id){
//                    $("textarea[title=ckedit]").each(function (index) {
//                        CKEDITOR.replace($(this).attr('id'), {
//                            customConfig: ' '
//                        });
//                    });
//                }
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

        $.each(modalArray, function (i, val) {
            if (val.name === 'name') {
                c++;
                colModel[c] = new Object();
                colModel[c].name = val.value;
            }
            if (val.name === 'type') {
                colModel[c].type = val.value;
//                if (val.value !== 'select') {
//                    c++;
//                    colModel[c] = new Object();
//                }

//                if (colModel[c].type === "datetime") {
//                    colModel[c].formatoptions = {srcformat: "u1000", newformat: "d-m-y h:i"};
//                    colModel[c].formatter = "date";
//                    colModel[c].sorttype = "date";
//                    colModel[c].editoptions = {dataInit: initDateEdit};
//                }

            }
            if (val.name === 'choices') {
                colModel[c].choices = val.value.split(/\r?\n/);
//                c++;
//                colModel[c] = new Object();
            }

            if (val.name.match("^option")) {
                var option = val.name.substring(7);
                if (option === 'hidden') {
                    if (val.value === "on") {
                        colModel[c].hidden = true;
                        colModel[c].visibleOnForm = true;
                    }
                }

                options[val.name.substring(7)] = val.value;
            }
            if (val.name.match("^import")) {
                importCSV = CSVToArray(val.value, ",");
            }

//            colModel[0].name = 
//            $("#" + i).append(document.createTextNode(" - " + val));
        });
        //  delete colModel[c];
        console.log(colModel);

        var data = [];
        if (typeof _gridData !== "undefined") {
            var gridData = A = $.extend(true, [], _gridData);//_gridData.clone();

            //gridData.data = mapGridDataToColumns(gridData.data, gridData.columns);
            //gridData = removeNoSaveCaption(gridData);            
            //$('#' + _gridData.id).jqGrid('gridDestroy');

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
            new_grid(parent.attr('id'), colModel, options, importCSV, data, "grid_" + uuidv4());
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
    form.append(forms_checkbox("Geminimaliseerd starten", "option_hiddengrid", _griddata.hiddengrid));
    form.append(forms_textarea("Importeer CSV", "import"));
    form.append(addRowButton);
    addHeader(form);

    if (typeof _griddata.colModel !== 'undefined') {
        var colModel = _griddata.colModel;
        for (var key in colModel) {
            if (typeof colModel[key].name !== 'undefined') {
                addRow(form, uuidv4(), colModel[key].name, colModel[key].edittype || colModel[key].formatter, colModel[key].editoptions, colModel[key].hidden);
            }
        }
    } else {
        addRow(form, uuidv4());
    }

    addRowButton.on('click', function (e) {
        addRow(form, uuidv4());
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
    var col = $("<div class='col-sm-" + colWidth + " mx-auto' style='text-align:center;'></div>");
    var formGroup = $("<div class='" + clazz + "'></div>");
    formGroup.append(element);
    col.append(formGroup);
    parent.append(col);
    return parent;
}

function addRow(parent, elementID, nameVal, typeVal, choiceList, visibleVal) {
    console.log("addRow()");
    var row = dom_div("row");

    var element1 = $("<input type='text' class='form-control' name='name' id='name-" + elementID + "' placeholder='fieldname'>");
    element1.val(nameVal);
    row = addElement(row, element1, 4, "form-group");

    var element2 = $("<select class='form-control' name='type' id='type-" + elementID + "'><option value='text'>Tekst</option><option value='date'>Datum</option><option value='cktext'>Tekst met opmaak</option><option value='select'>Keuzelijst</option><option value='internal_list'>Interne lijst</option><option value='external_list'>Externe lijst</option></select>");
    if (typeVal === "textarea") {
        typeVal = "cktext";
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