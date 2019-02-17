/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
    if (target.length) {
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

class LCMSgridController {
    constructor() {
        this.grids = {};
        this.references = [];
    }
    checkGrids() {
        var me = this;
        me.references = [];
        $("table[id^=grid]").each(function (a, b) {
            try {
                var test = {
                    "gridID": $(b).attr('id'),
                    "gridParams": $(b).jqGrid('getGridParam')
                };
                me.grids[$(b).attr('id')] = test;



                me.grids[$(b).attr('id')] = $(b).jqGrid('getGridParam');
                me.grids[$(b).attr('id')].colModel.forEach(function (column) {
                    if (typeof column.editoptions !== "undefined") {
                        if (column.editoptions.title === "internal_list") {
                            var referenceJson = {
                                "list": $(b).attr('id'),
                                "attr": column.name,
                                "refList": column.internalListName,
                                "refAttr": column.internalListAttribute
                            };
                            me.references.push(referenceJson);
                        }
                    }
                });
            } catch (err) {
            }
        });

        //console.log(this.references);


        setTimeout(function () {
            me.checkGrids();
            me.updateReferences();
        }, 10000);
    }

    updateReferences() {
        var me = this;
        $.each(me.references, function (a, b) {
            console.log(b);
            var column = Object.filter(me.grids[b.list].colModel, model => model.name === b.attr);
            var newValues = getValuesOfAttributeInList(b.refList, b.refAttr);
            var oldValues = Object.values(column)[0].editoptions.value;
            if (newValues !== oldValues) {
                console.log("Updating references... ");
                Object.values(column)[0].editoptions.value = newValues;
                $("#" + b.list).jqGrid("getGridParam").colModel[Object.keys(column)[0]] = Object.values(column)[0];
                $("#" + b.list).trigger("reloadGrid");
            }

        });

    }
}

class LCMSSidebarPage {
    constructor(pageData, gridData) {
        this.pageData = pageData;
        this.gridData = gridData;
    }
    loadFromServer() {
        var gridData = this.gridData;
        console.log(gridData.editUrl + ": getting data from server...");
        function onDone(data) {
            var jsonData = JSON.parse(data);
            gridData.data = jsonData;
            let grid = new LCMSGrid(gridData);
            grid.createGrid();
            grid.addGridButton("fa-plus", "Nieuw item", "", function () {
                return popupEdit('new', $("#" + gridData.tableObject), $(this), gridData.editAction, {});
            });
            grid.addGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
                var rowid = $("#" + gridData.tableObject).jqGrid('getGridParam', 'selrow');
                if (rowid !== null) {
                    return popupEdit(rowid, $("#" + gridData.tableObject), $(this), gridData.editAction);
                } else {
                    return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
                }
            });
        }
        LCMSRequest(gridData.editUrl, {action: gridData.loadAction}, onDone);
    }

    createPage() {
        var _this = this;
        var pageData = _this.pageData;
        var wrapper = $("<div></div>");
        var sidebarLeft = dom_div("", this.pageData.sidebarLeft);
        var sidebarLeftList = dom_list(this.pageData.sidebarLeftList, []);
        var sidebarRight = dom_div("", this.pageData.sidebarRight);
        var sidebarRightTable = $("<table id='" + this.pageData.sidebarRightTable + "'></table>");
        var sidebarRightTablePager = dom_div("", this.pageData.sidebarRightTablePager);
        var mainPageContainer = dom_mainPageContainer(this.pageData.containerID, this.pageData.mainPageContentDivId);

        sidebarLeft.append(sidebarLeftList);
        sidebarRight.append(sidebarRightTable);
        sidebarRight.append(sidebarRightTablePager);

        wrapper.append(sidebarLeft);
        wrapper.append(sidebarRight);
        wrapper.append(mainPageContainer);

        $(function () {
            sidebarLeft.BootSideMenu({side: "left"});
            sidebarRight.BootSideMenu({side: "right"});
            sidebarRight.BootSideMenu.open();
            _this.loadFromServer();
            pageData.ckConfig();
        });
        return wrapper;
    }

}

function LCMSRequest(_url, _data, _onDone) {
    _data['LCMS_session'] = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: _url,
        data: _data, //{action: "VALIDATION_GETVALIDATION", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        _onDone(data);
        bootstrap_alert.warning('Success', 'success', 1000);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        bootstrap_alert.warning('Something went wrong + \n ' + errorThrown, 'error', 5000);
    });
}

function getPatches(oldData, newData) {
    var dmp = new diff_match_patch();
    var diff = dmp.diff_main((oldData), (newData));
    dmp.diff_cleanupSemantic(diff);
    var patches = dmp.patch_make(diff);
    var textPatches = dmp.patch_toText(patches);
    return textPatches;

}