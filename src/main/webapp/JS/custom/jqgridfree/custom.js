/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function buildHtmlTable(json) {
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

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
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

function jqGridOptionsSimple() {
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
        guiStyle: "bootstrap4",
        //iconSet: "glyph",
        iconSet: "fontAwesome",
        searching: listGridFilterToolbarOptions,
        rowNum: 150,
        mtype: 'POST',
        altRows: true,
        editurl: _editUrl,
        loadonce: true,
        ondblClickRow: editRow,
        pager: _pagerName,
        caption: _caption,
        pgbuttons: false,
        pgtext: "",
        pginput: false

    };
    return jqgridOptions;
}

function popupEdit(_action, _tableObject, _parentObject, _editAction, _afterSubmitFunction) {
    var _tableObject = _tableObject;
    var parent = _parentObject;
    var grid = _tableObject;
    console.log("new item");

    grid.jqGrid('editGridRow', _action, {
        reloadAfterSubmit: false,
        afterShowForm: function (formid) {
            $("div[id^=editmod]").css('position', 'absolute');
            $("div[id^=editmod]").css('top', '5%');
            $("div[id^=editmod]").css('width', '90%');
            $("div[id^=editmod]").css('display', 'inline-block');
            $("div[id^=editmod]").css('margin-left', '5%');
            $("div[id^=editmod]").css('margin-right', '5%');
            $("div[id^=editmod]").css('left', '');

            $("textarea[title=ckedit]").each(function (index) {
                CKEDITOR.replace($(this).attr('id'), {
                    customConfig: ' '
                });


            });


            scrollTo($($("input")[0]));
        },
        beforeSubmit: function (postdata, formid) {
            $("textarea[title=ckedit]").each(function (index) {
                var editorname = $(this).attr('id');
                var editorinstance = CKEDITOR.instances[editorname];
                var text = editorinstance.getData();
                text = removeElements("nosave", text);
                postdata[editorname] = text;
            });
            var colModel = $("#" + this.id).jqGrid("getGridParam").colModel;
            var filteredModel = Object.filter(colModel, function (a) {
                console.log(a.type);
                if (a.type === "datetime") {
                    return true;
                } else {
                    return false;
                }
                ;
            });
            $.each(filteredModel, function (a, b) {
                var value = postdata[b.label];
                if (value === "") {
                    postdata[b.label] = moment().valueOf();
                } else {
                    postdata[b.label] = moment(value).valueOf();
                }

            });
            console.log("Checking post data");
        },
        afterComplete: function (response, postdata, formid) {
            $("#cData").trigger("click");
            bootstrap_alert.warning('Rij toegevoegd', 'info', 1000);
            $(this).trigger("reloadGrid");
            _afterSubmitFunction();

        },
        editData: {action: _editAction, LCMS_session: $.cookie('LCMS_session')}
    }

    );

}

function createDataAndModelFromCSV(val) {
    console.log("createDataAndModelFromCSV()");
    var importCSV = CSVToArray(val, ",");
    var colNames = new Array();
    var colModel = [];

    var data = new Array();
    var c = 0;
    importCSV.forEach(function split(a) {
        var line = a;
        var lineObject = {};
        line.forEach(function split(a, b) {
            var column = {};
            if (c < 1) {
                colNames.push(a);
                column.label = a;
                column.name = a;
                column.type = 'text';
                colModel.push(column);
            } else {
                lineObject[colNames[b]] = a;
            }
        });
        if (c > 0) {
            data.push(lineObject);
        }
        c++;
    });
    return {colModel: colModel, colNames: colNames, table: data};
}

function getValuesOfAttributeInList(_list, _attribute) {
    //console.log("getValuesOfAttributeInList()");
    var distinctAttributes = {};
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _list) {
            var data = new Object();
            $(b).jqGrid("getGridParam").data.forEach(function (a, b) {
                distinctAttributes[a.id] = a[_attribute];
            });
            // distinctAttributes = filterUniqueJson($(b).jqGrid("getGridParam").data, _attribute);
        }
    });
    return distinctAttributes;
}

function getValuesOfAllAttributesInList(_list, _attribute) {
    var distinctAttributes = {};
    $("table[id^=grid]").each(function (a, b) {
        var name = $("#gview_" + $(b).attr("id")).find("span[class=ui-jqgrid-title]")[0].innerText;
        if (name === _list) {
            var data = new Object();
            $(b).jqGrid("getGridParam").data.forEach(function (a, b) {
                distinctAttributes[a.id] = a[_attribute];
            });
            // distinctAttributes = filterUniqueJson($(b).jqGrid("getGridParam").data, _attribute);
        }
    });
    return distinctAttributes;
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

function isEmptyObj(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


function test() {

    var btn1 = addBtn('padding:2px;border-style:solid;border-width:1px;width:auto;min-width:60px;margin-right:5px', 'Hulpmiddelen', "btnHulpmiddelen");
    var parent = $($(".shinytitle")[0]).find("div[class=nowrap]");
    var popup = $("<div class='dijitDialog dijitDialogFocused dijitFocused' role='dialog' aria-labelledby='showIssuerSearchDialog_title' id='showIssuerSearchDialog' widgetid='showIssuerSearchDialog' style='display: none;position: absolute;opacity: 1;width: 80%;left: 10%;top: 10%;height: 80%;z-index: 1001;'><div data-dojo-attach-point='titleBar' class='dijitDialogTitleBar'>        <span data-dojo-attach-point='titleNode' class='dijitDialogTitle' id='showIssuerSearchDialog_title' role='heading' level='1'>Centraal labo AZ Zeno: hulpmiddelen</span><span data-dojo-attach-point='closeButtonNode' class='dijitDialogCloseIcon' data-dojo-attach-event='ondijitclick: onCancel' onclick='togglePopup()' title='Annuleren' role='button' tabindex='-1'>            <span data-dojo-attach-point='closeText' class='closeText' title='Annuleren'>x</span>        </span>    </div>    <div data-dojo-attach-point='containerNode' id='hulpmiddelenPopupContainer' style='height:100%' class='dijitDialogPaneContent'><table></table></div></div>");
    var iframe = $("<iframe name='iframe1' id='iframe1' style='width:100%;height:100%;background: #efefef;border-width: 0px;'></iframe>");
    var hulpmiddelenWrapper = $("<div id='wrapperContent' style='width:100%;margin:5px'></div>");

    $('body').click(function (e) {
        if (!$(e.target).closest('#hulpmiddelenWrapper').length && !$(e.target).closest('#btnHulpmiddelen').length) {
            $("#hulpmiddelenWrapper").hide();
        }
    });

    btn1.on('click', function (e) {
        showLaboPopUp();
        $("#hulpmiddelenWrapper").toggle();
        showMainMenu();
        $("#mainMenu").show();
        $("#manualMenu").hide();
        $("#mailMenu").hide();
    });


    parent.append(btn1);
    $("body").append(popup);

    function showLaboPopUp() {
        if ($("#hulpmiddelenWrapper").length < 1) {
            var wrapper = $("<div id='hulpmiddelenWrapper' style='display:none;position:absolute;width:250px;height:250px;z-index:1000;background: lightgrey;'></div>");
            var menu = $("<div id='menu'style='width:100%;margin-top: 5px;margin-left: 5px;margin-bottom:5px'></div>");
            var btnMain = addBtn('padding:2px;border-style:solid;border-width:1px;width:auto;min-width:60px;margin-right:5px', 'Snelkoppelingen');
            var btnManual = addBtn('padding:2px;border-style:solid;border-width:1px;width:auto;min-width:60px;margin-right:5px', 'Handleiding');
            var btnContact = addBtn('padding:2px;border-style:solid;border-width:1px;width:auto;min-width:60px;margin-right:5px', 'Contact');

            btnMain.on('click', function (e) {
                 showMainMenu();
                $("#manualMenu").hide();
                $("#mailMenu").hide();
                $("#mainMenu").toggle();
            });
            btnManual.on('click', function (e) {
                 showManualMenu();
                $("#mailMenu").hide();
                $("#mainMenu").hide();
                $("#manualMenu").toggle();
            });
//            btnContact.on('click', function (e) {
//                 showMailMenu();
//                $("#mainMenu").hide();
//                $("#manualMenu").hide();
//                $("#mailMenu").toggle();
//
//            });
            menu.append(btnMain);
            menu.append(btnManual);
//            menu.append(btnContact);
            wrapper.append(menu);
            wrapper.append(hulpmiddelenWrapper);
            parent.append(wrapper);
        }
    }

    function addBtn(_style, _value, _id) {
             var btn = $("<input type='button' class='inputbutton' id=" + _id + " value=" + _value + " style=" + _style + ">");
             return btn;
    }

    function togglePopup(link) {
        if (popup.css("display") === "table" && typeof link === "undefined") {
            popup.css("display", "none");
        } else {
            if (!$("#hulpmiddelenPopupContainer").find(iframe).length) {
                $("#hulpmiddelenPopupContainer").append(iframe);
            }
            popup.css("display", "table");
            document.getElementById('iframe1').src = link;//"Customer/Order Entry huisartsen.html";
        }   
            
    }

    function showMainMenu() {
        if (hulpmiddelenWrapper.find("div[id='mainMenu']").length < 1) {
            var wrapper = $("<div id='mainMenu' style='display:none'></div>");
            var span = $("<span>Snelkoppelingen:</span>");
            var ul = $("<ul style='list-style: none;margin-left: 0px;padding: 0;font-size: 1.2em;font-style: normal;'></ul>");
            var li1 = $("<li style='margin: 5px;cursor: pointer;' onclick='togglePopup(\"https://cyberlab.vzwgo.be/labogids/\")' ><a href='#'>Labogids</a></li>");
            var li2 = $("<li style='margin: 5px;cursor: pointer;' onclick='togglePopup(\"https://cyberlab.vzwgo.be/Antibiotica/\")'><a href='#'>Antibioticagids</a></li>");
            var li3 = $("<li style='margin: 5px;cursor: pointer;' onclick='togglePopup(\"https://cyberlab.vzwgo.be/labogids/Contact.aspx\")'><a href='#'>Contactgegevens</a></li>");
            ul.append(li1);
            ul.append(li2);//https://cyberlab.vzwgo.be/labogids/Contact.aspx
            ul.append(li3);
            wrapper.append(span);
            wrapper.append("<br/>");
            wrapper.append(ul);
            hulpmiddelenWrapper.append(wrapper);
        }
    }

    function showManualMenu() {
        if (hulpmiddelenWrapper.find("div[id='manualMenu']").length < 1) {
            var wrapper = $("<div id='manualMenu' style='display:none'></div>");
            var span = $("<span>Handleiding:</span>");
            var ul = $("<ul style='list-style: none;margin-left: 0px;padding: 0;font-size: 1.2em;font-style: normal;'></ul>");
            var li2 = $("<li style='margin: 5px;cursor: pointer;' onclick='togglePopup(\"https://cyberlab.vzwgo.be/cyberlab/Customer/Order%20Entry%20huisartsen.html\")'><a href='#'>Order aanmaken</a></li>");
            var li3 = $("<li style='margin: 5px;cursor: pointer;' onclick='togglePopup(\"https://cyberlab.vzwgo.be/cyberlab/Customer/Order%20Entry%20huisartsen.html#Bijaanvraag\")'><a href='#'>Test(en) bijaanvragen</a></li>");
            var li4 = $("<li style='margin: 5px;cursor: pointer;' onclick='togglePopup(\"https://cyberlab.vzwgo.be/cyberlab/Customer/Order%20Entry%20huisartsen.html#Panels\")'><a href='#'>Profiel aanmaken</a></li>");
            ul.append(li2);
            ul.append(li3);
            ul.append(li4);
            wrapper.append(span);
            wrapper.append("<br/>");
            wrapper.append(ul);
            hulpmiddelenWrapper.append(wrapper);
        }

    }

    function showMailMenu() {
        if (hulpmiddelenWrapper.find("div[id='mailMenu']").length < 1) {
            var wrapper = $("<div id='mailMenu' style='display:none'></div>");
            var mailTitle = $("<span>Stel hier uw vraag</span>");
            var mailContent = $("<textarea style='width:90%' rows='8'></textarea>");
            var btnMail = addBtn('padding:2px;border-style:solid;border-width:1px;width:auto;min-width:60px;margin-right:5px', 'Versturen');
            wrapper.append(mailTitle);
            wrapper.append("<br/>");
            wrapper.append(mailContent);
            wrapper.append("<br/>");
            wrapper.append(btnMail);
            hulpmiddelenWrapper.append(wrapper);
            btnMail.on('click', function (e) {
                var acc = new account();
                var message = mailContent.val();
                var name = acc.loginName;
                window.location.href = 'mailto:centraal.labo@azzeno.be?subject=Cyberlab - Vraag van ' + name + ' op ' + new Date().toISOString().substring(0, 10) + '&body=' + message;
            });
        }
    }






}

