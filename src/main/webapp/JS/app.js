/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require.config({
    baseUrl: './JS/dependencies',
    paths: {
        jquery: 'jquery/jquery',
        popper: ('jquery/popper.min'),
        bootstrap: ('bootstrap/bootstrap.bundle.min'),
        moment: ('moment/moment.min'),
        ckeditor: ('ckeditor/ckeditor'),
        gcms_core: ('gcms/core'),
        gcms_grid: ('gcms/grid'),
        gcms_editablepage: "gcms/editablepage",
        gcms_gridcontroller: ('gcms/gridcontroller'),
        gcms_griddata: ('gcms/griddata'),
        gcms_gridform: ('gcms/gridform'),
        gcms_imagecontroller: ('gcms/imagecontroller'),
        gcms_lang_nl: ('gcms/lang.nl'),
        gcms_ckconfig: "gcms/ckconfig",
        jquerycookie: ('jquery/jquery.cookie'),
        bootside: 'BootSlideMenu/js/BootSideMenu',
        jqgrid: 'jqGridFree/js/jquery.jqgrid.min',
        tinycolor: 'tinycolor/tinycolor.min',
        chartjs: 'chartjs/Chart.bundle',
        mousewheel: 'jquery-mousewheel',
        datetimepicker: 'datetimepicker/jquery.datetimepicker.full.min',
        jqueryui:('jquery/jquery-ui'),
        tether: ('jquery/tether.min')
    },
    shim: {
        popper : ['jquery'],
        bootstrap: ['jquery','popper'],
        gcms_core: ['jquery', 'bootstrap', 'jqgrid'],   
        jqgrid: ['jquery'],
        gcms_editablepage: ['jquery', 'jqgrid','bootstrap']
    }

});
require(['moment'], function (mom) {
    window.moment = mom;
});
require(['tinycolor'], function (tinycolor) {
    window.tinycolor = tinycolor;
});


require([
    "jquery",
    "jquerycookie",
    "tether",
    "popper",
    "chartjs",
    "datetimepicker",
    "gcms_lang_nl",
    "gcms_editablepage",
    "gcms_grid",
    "gcms_gridform",
    "gcms_griddata",
    "gcms_gridcontroller",
    "gcms_imagecontroller",
    "gcms_ckconfig",
    "gcms_lang_nl",
    "gcms_core",
    "bootstrap",        
    "ckeditor",
    "bootside",
    "jqgrid"
], function ($) {
    console.log("all sources required");
    credentials_doUserInfo($("#navbar-toggler"));
    page_doLoadPage(getUrlParam(window.location.href, "p"), $("body"));
});




