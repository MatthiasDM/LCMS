/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function laboratory_doLoad() {
    console.log("department load");
    LCMSTableRequest("loadlaboratory", "editlaboratory", "./servlet", "laboratory-table", "laboratory-pager", "div-grid-wrapper", lang["laboratory"]['title']);
}