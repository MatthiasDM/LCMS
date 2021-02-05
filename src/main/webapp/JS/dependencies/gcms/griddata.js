/* 
 Matthias De Mey
 www.s-dm.be
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *   * gridData
 * *****************************
 *  var gridData = {
 data: object,
 editAction: "string",
 editUrl: "string",
 tableObject: "string", --> change to tableID
 pagerID: "string",
 wrapperObject: object
 jqGridOptions: { //example options
 grouping: true,
 groupingView: {
 groupField: ['status', 'category'],
 groupColumnShow: [false, false],
 groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
 groupCollapse: true
 },
 onSelectRow: function (rowid) {
 return popupEdit(rowid, tableObject, _parent, "editActionString");
 },
 caption: "this is a caption"
 },
 jqGridParameters: {
 navGridParameters: {add: false}
 }
 gridCONTROLLER
 */

class griddata {

    constructor() {

    }

    set data(_data) {
        this.data = _data;
    }

    set editAction(_editAction) {
        this.editAction = _editAction;
    }
    
    
}

