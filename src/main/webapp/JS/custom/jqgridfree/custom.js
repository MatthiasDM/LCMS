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
      if (cellValue == null) cellValue = "";
      row$.append($("<td style='word-wrap: break-word;min-width: 50px;max-width: 160px;' />").html(cellValue));
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
  table.append(headerTr$);

  return columnSet;
}

function jqGridOptionsSimple(){
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
