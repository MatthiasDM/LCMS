var grids = {};

Object.filter = (obj, predicate) =>
    Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});

function loadGrids() {
    grids = $("table[id^=grid]").each(function (a, b) {
        try {
            gridData[$(b).attr('id')] = $(b).jqGrid('getGridParam');
//            $(b).jqGrid('gridDestroy');
//            $(b).jqGrid('gridUnload');
//            $(b).remove();
        } catch (err) {
        }
    });
}

function getGridNames() {
    var names = {};
    Object.entries(grids).forEach(([key, val]) => {
        names[val.id] = val.caption;// the value of the current key.
    });
    return names;
}

function getGridColumns(gridId) {
//    var filtered = Object.filter(grids, grid => grid.id = gridId);
//    console.log(filtered);
    return grids[gridId].colNames;
}


