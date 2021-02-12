/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class LCMSgridController {
    constructor(parent) {
        console.log("new gridcontroller");
        this.grids = {};
        this.references = [];
        this.views = [];
        this.LCMSGrids = {};
        this.parent = parent;
    }

    addLCMSGrid(_gridId, _grid) {
        this.LCMSGrids[_gridId] = _grid;
    }
    addGrid(_gridId, _grid) {
        this.grids[_gridId] = _grid;
    }

    regenerateGrids() {
        var me = this;
        me.references = [];
        console.log("regenerating grids...");
        documentPage.minimizeGrids(documentPage, $("div[id^='wrapper']"));
        $.each($("div[class=grid-placeholder]"), function (a, b) {
            documentPage.generateGrid($(b).parent(), $(b).attr('name').substring(5), me.grids[$(b).attr('name').substring(5)]);
        });
    }

    checkGrids() {
        var me = this;
        me.references = [];
        var denominator = $("table[id^=grid]");
        var gridsOnPage = {};
        //me.grids = new Array();
        denominator.each(function (a, b) { //remove grids that are not in the denominator array
            try {
                if ($(b).jqGrid('getGridParam') !== null) {
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
                    gridsOnPage[$(b).attr('id')] = me.grids[$(b).attr('id')];
                } else {
                    console.log("Gridparams are null!");
                }
            } catch (err) {
                console.log(err);
            }
        });
        // me.grids = gridsOnPage;

//        $.each(me.grids, function (a, b) {
//
//        });
//        $.each(Object.filter(me.grids, grid => typeof grid.subgridref !== "undefined"), function (a, b) {
//            me.checkSubGridValidity(b.id);
//        });
        //console.log(this.references);

//
//        setTimeout(function () {
//           // me.checkGrids();
//          //  me.updateReferences();
//        }, 10000);
    }

    updateReferences() {
        var me = this;
        $.each(me.references, function (a, b) {
            //console.log(b);
            var column = Object.filter(me.grids[b.list].colModel, model => model.name === b.attr);
            var newValues = getValuesOfAttributeInList(b.refList, b.refAttr);
            var newValuesAllAtrributes = getValuesOfAttributeInList(b.refList, b.refAttr);
            var oldValues = Object.values(column)[0].editoptions.value;
            if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
                console.log("Updating references... ");
                Object.values(column)[0].editoptions.value = newValues;
                $("#" + b.list).jqGrid("getGridParam").colModel[Object.keys(column)[0]].editoptions.value = newValues; //Object.values(column)[0];
                $("#" + b.list).trigger("reloadGrid");
            }







        });
    }

    checkSubGridValidity(gridId) {
        console.log("checkSubGridValidity()");
        var me = this;
        var grid = $("#" + gridId);
        var subGridCells = $("td.sgcollapsed", grid[0]);
        var change = false;
        if (typeof me.grids[grid.attr('id')] !== "undefined" && me.grids[grid.attr('id')].hasOwnProperty("subGridHasSubGridValidation")) {
            $.each(subGridCells, function (i, value) {

                var htmlValue = $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).html();
                if (!me.grids[grid.attr('id')].subGridHasSubGridValidation(value.parentNode.id, me.grids[grid.attr('id')].subgridref, me)) {
                    $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).unbind('click').html('');
                } else {
                    $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).bind('click').html("<div class='sgbutton-div'><a role='button' class='btn btn-xs sgbutton'><span class='fa fa-fw fa-plus'></span></a></div>");
                }
                if (htmlValue !== $("#" + value.parentNode.id + " td.sgcollapsed", grid[0]).html()) {
                    change = true;
                }
            });
        }



    }
}

