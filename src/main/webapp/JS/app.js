/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require.config({
    waitSeconds: 30,
    baseUrl: './JS/dependencies',
    paths: {
        jquery: 'jquery/jquery',
        popper: ('jquery/popper.min'),
        //bootstrap: ('bootstrap/bootstrap.bundle.min'),
        bootstrap: ('bootstrap/5.0.0/bootstrap.bundle.min'),
        moment: ('moment/moment.min'),
        ckeditor: ('ckeditor/ckeditor'),
        codemirror: ('codemirror/codemirror'),
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
        //jqgrid_nl: ('https://cdnjs.cloudflare.com/ajax/libs/free-jqgrid/4.8.0/js/i18n/grid.locale-nl'),
        tinycolor: 'tinycolor/tinycolor.min',
        chartjs: 'chartjs/Chart.bundle',
        mousewheel: 'jquery-mousewheel',
        datetimepicker: 'datetimepicker/jquery.datetimepicker.full.min',
        jqueryui: ('jquery/jquery-ui'),
        tether: ('jquery/tether.min'),
        dmp: ('diffMatchPatch/diff_match_patch'),
        iframeresizer: ('iframeresizer/iframeResizer.min'),
        dropzone: ('dropzone/dropzone.min'),
        pivottable: ('pivottable/pivot'),
        pivottablemulti: ('pivottable/multifact-pivottable'),
        plotly: ('pivottable/plotly-latest.min'),
        plotly_renderers: ('pivottable/plotly_renderers'),
        papaparse: ('PapaParse/papaparse.min'),
        filesaver: ('filesaver/filesaver.min'),
        htmlminifier: ('htmlminifier/htmlminifier.min'),
        zxing: ('zxing/zxing.min'),
        lz: ('lz/lz-string.min')

    },
    map: {
        'jQuery': {jquery: 'jquery/jquery'}

    },
    shim: {
        popper: ['jquery'],
        bootside: ['jquery'],
        bootstrap: ['jquery', 'popper'],
        gcms_core: ['jquery', 'bootstrap', 'jqgrid'],
        jqgrid: ['jquery'],
        gcms_editablepage: ['jquery', 'jqgrid', 'bootstrap'],
        pivottable: ['jqueryui'],
        pivottablemulti: ['pivottable'],
        plotly_renderers: ['plotly', 'pivottable']

    }
});


require(['moment'], function (mom) {
    window.moment = mom;
});

require(['bootstrap'], function (bootstrap) {
    window.bootstrap = bootstrap;
});

require([
    "jquery",
    "jquerycookie",
    "bootside",
    "tether",
    "popper",
    "datetimepicker",
    "gcms_editablepage",
    "gcms_grid",
    "gcms_gridform",
    "gcms_griddata",
    "gcms_gridcontroller",
    "gcms_imagecontroller",
    "gcms_ckconfig",
    "gcms_lang_nl",
    "gcms_core",
    "jqgrid",
    "dmp",
    "dropzone",
    "iframeresizer",
    "htmlminifier",
    "lz"
], function ($) {
    console.log("all sources required");
    $("body").css({"background-image": "linear-gradient(rgba(var(--bs-body-bg-rgb), var(--alpha)),rgba(var(--bs-body-bg-rgb), var(--alpha))) , url('./files/background.jpg')", "background-attachment": "fixed", "background-repeat": "no-repeat", "background-size": "cover", "background-position": "center", "-webkit-mask-size": "cover"});
    credentials_doUserInfo($("#user-menu"));
    page_doLoadPage(getUrlParam(window.location.href, "p"), $("body"));

    require(['tinycolor'], function (tinycolor) {
        window.tinycolor = tinycolor;
    });
    require(['papaparse'], function (papa) {
        window.Papa = papa;
    });

    require(['htmlminifier'], function (htmlminifier) {
        window.minify = req('html-minifier').minify;
    });

});




