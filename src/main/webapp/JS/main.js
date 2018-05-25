
require.config({
    paths: {
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "jquerycookie": "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.3/moment",
        "quill": "//cdn.quilljs.com/1.3.4/quill",
        "langnl": "lang.nl",
        "interface": "interface",
        "servletCalls": "servletCalls"
    },
    shim: {
        'bootstrap': ['jquery'],
        'moment' : ['jquery'],
        'langnl' : ['jquery'],
        'interface' : ['jquery'],
        'servletCalls': ['jquery']
    }
});

require(['tether'], function (Tether) {
    window.Tether = Tether;
});
define(['jquery', 'bootstrap'], function ($) {
    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    });
});


require(['jquerycookie'], function () {});
require(['moment'], function () {});
require(['quill'], function () {});
require(['langnl'], function () {});
require(['interface'], function () {});
require(['servletCalls'], function () {});
