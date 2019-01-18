function generateView(data) {
    cols = Object.keys(data[0]);
    console.log("Generating view");
    var view = [];
    for (var i = 0; i < cols.length; i++) {
        var column = {};
        column.label = cols[i];
        column.name = cols[i];
        column.width = 100;
        if (cols[i] !== "id") {
            column.editable = true
        } else {
            column.hidden = true
        }
        ;
        view.push(column);
        //Do something
    }
    return view;
}

function generateView2(data) {
    var cols = new Array();
    $.each(JSON.parse(jsonData.header), function (index, value) {
        cols.push(value.name);
    });
    console.log("Generating view");
    var view = [];
    for (var i = 0; i < cols.length; i++) {
        var column = {};
        column.label = cols[i];
        column.name = cols[i];
        column.width = 100;
        if (cols[i] !== "id") {
            column.editable = true
        } else {
            column.hidden = true
        }
        ;
        view.push(column);
        //Do something
    }
    return view;
}


