/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function config0() { //used in de notes-module
    CKEDITOR.stylesSet.add('mdmConfig0', [
        // Block-level styles
        {name: 'Hoofdding 1', element: 'h1', styles: {'color': 'rgb(54,95,145)'}},
        {name: 'Hoofdding 2', element: 'h2', styles: {'color': 'rgb(79,129,189)'}},
        {name: 'Hoofdding 3', element: 'h3', styles: {'color': 'rgb(79,129,189)'}},
        {name: 'Hoofdding 4', element: 'h4', styles: {'color': 'rgb(79,129,189)', 'font-style': 'italic'}},
        {name: 'Hoofdding 5', element: 'h5', styles: {'color': 'rgb(36,63,96)'}},

        // Inline styles
        {name: 'Normaal', element: 'span', attributes: {'class': 'my_style'}},
        {name: 'Marker: Yellow', element: 'span', styles: {'background-color': 'Yellow'}}
    ]);

    CKEDITOR.editorConfig = function (config) {
        config.toolbarGroups = [
            {name: 'document', groups: ['mode', 'document', 'doctools']},
            {name: 'clipboard', groups: ['clipboard', 'undo']},
            {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
            {name: 'insert', groups: ['insert']},
            {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
            {name: 'colors', groups: ['colors']},
            {name: 'forms', groups: ['forms']},
            {name: 'tools', groups: ['tools']},
            //'/',
            {name: 'styles', groups: ['styles']},
            {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
            {name: 'links', groups: ['links', 'mdmUploadFiles', 'mdmInsertFileReference']},
            //'/',
            {name: 'others', groups: ['others']},
            {name: 'about', groups: ['about']}
        ];
        //"http://localhost:8080/LCMS/JS/ckeditor/plugins/templates/templates/default.js?t=HBDD"

        config.extraPlugins = 'forms,codesnippet,codemirror,widget,dialog,pre,resize,autogrow,notificationaggregator,notification,mdmUploadFiles,mdmjexcel';

        config.format_tags = 'div';
        config.removeButtons = 'Table,New,Radio,Save,Source,New,TextField,Textarea,Select,Button,ImageButton,HiddenField,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,Unlink,Language,BidiRtl,BidiLtr,Blockquote,CreateDiv,ShowBlocks,About,Scayt,PasteFromWord,PasteText,Paste,Copy,Cut';
        config.removePlugins = 'liststyle,tabletools,scayt,menubutton,contextmenu,language,tableselection,iframe,forms';
        //CKEDITOR.config.removePlugins = 'liststyle,tabletools,scayt,menubutton,contextmenu';
        config.stylesSet = 'mdmConfig0:/styles.js';
        config.allowedContent = {
            script: true,
            $1: {
                // This will set the default set of elements
                elements: CKEDITOR.dtd,
                attributes: true,
                styles: true,
                classes: true
            }
        };
    };



}

function config1() {  //used in jqgrid textarea fields in non inline pages
    console.log("function config1");
    CKEDITOR.stylesSet.add('mdmConfig1', [
        // Block-level styles
        {name: 'Hoofdding 1', element: 'h1', styles: {'color': 'rgb(54,95,145)'}},
        {name: 'Hoofdding 2', element: 'h2', styles: {'color': 'rgb(79,129,189)'}},
        {name: 'Hoofdding 3', element: 'h3', styles: {'color': 'rgb(79,129,189)'}},
        {name: 'Hoofdding 4', element: 'h4', styles: {'color': 'rgb(79,129,189)', 'font-style': 'italic'}},
        {name: 'Hoofdding 5', element: 'h5', styles: {'color': 'rgb(36,63,96)'}},

        // Inline styles
        {name: 'Normaal', element: 'span', attributes: {'class': 'my_style'}},
        {name: 'Marker: Yellow', element: 'span', styles: {'background-color': 'Yellow'}}
    ]);
    
    CKEDITOR.editorConfig = function (config) {
        config.toolbarGroups = [
            {name: 'document', groups: ['mode', 'document', 'doctools']},
            {name: 'clipboard', groups: ['clipboard', 'undo']},
            {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
            {name: 'forms', groups: ['forms']},
            {name: 'colors', groups: ['colors']},
            {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
            {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph', 'mdmUploadFiles']},
            {name: 'links', groups: ['links']},
            {name: 'insert', groups: ['insert']},
            {name: 'styles', groups: ['styles']},
            {name: 'tools', groups: ['tools']},
            {name: 'others', groups: ['others']},
            {name: 'about', groups: ['about']}
        ];
        config.extraPlugins = 'mdmUploadFiles,codesnippet,pre,codemirror,sourcedialog,widget,dialog,mdmjexcel';
        config.removeButtons = 'Source,Save,Templates,Cut,Undo,Redo,Copy,Preview,Print,PasteText,Paste,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,NewPage,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,Anchor,Unlink,BidiLtr,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Format,Font,Maximize,ShowBlocks,About,RemoveFormat,CopyFormatting,Subscript,Superscript';
        config.height = 500;
        config.stylesSet = 'mdmConfig1:/styles.js';
    };
    CKEDITOR.config.allowedContent = {
        script: true,
        $1: {
            // This will set the default set of elements
            elements: CKEDITOR.dtd,
            attributes: true,
            styles: true,
            classes: true
        }
    };
    CKEDITOR.config.contentsCss = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css';
    CKEDITOR.scriptLoader.load("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js", function (success)
    {
        console.log("bootstrap js loaded");
    });
    CKEDITOR.on('instanceReady', function () {
        console.log("loading images");
        $("textarea[title=ckedit]").each(function (index) {
            loadImages($(this).attr('id'));
            $("#cke_" + $(this).attr('id')).css("border", "1px dotted grey");
            $("#cke_" + $(this).attr('id')).css("padding", "10px");
        });
        $('iframe').contents().click(function (e) {
            if (typeof e.target.href != 'undefined' && e.ctrlKey == true) {
                window.open(e.target.href, 'new' + e.screenX);
            }
        });


    });

    function loadImages(editor) {

        var images = $("#cke_" + editor).find("iframe").contents().find('[fileid]')

        images.each(function (index) {
            downloadToTemp($(this));

        });

    }

    function downloadToTemp(file) {
        var formData = new FormData();
        formData.append('action', 'FILE_DOWNLOADTEMP');
        formData.append('LCMS_session', $.cookie('LCMS_session'));
        formData.append('filename', file.attr("name"));
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var jsonData = JSON.parse(request.responseText);
                var filePath = jsonData.filePath;
                console.log("Changing filepath from " + file.attr("src") + " to " + filePath);
                file.attr("src", filePath);

            }
        }
        request.open('POST', "./upload", /* async = */ false);
        request.send(formData);
    }

}


function config2() { //for inline editing
    console.log("function config1");
    CKEDITOR.stylesSet.add('mdmConfig2', [
        // Block-level styles
        {name: 'Hoofdding 1', element: 'h1', styles: {'color': 'rgb(54,95,145)'}},
        {name: 'Hoofdding 2', element: 'h2', styles: {'color': 'rgb(79,129,189)'}},
        {name: 'Hoofdding 3', element: 'h3', styles: {'color': 'rgb(79,129,189)'}},
        {name: 'Hoofdding 4', element: 'h4', styles: {'color': 'rgb(79,129,189)', 'font-style': 'italic'}},
        {name: 'Hoofdding 5', element: 'h5', styles: {'color': 'rgb(36,63,96)'}},

        // Inline styles
        {name: 'Normaal', element: 'span', attributes: {'class': 'my_style'}},
        {name: 'Marker: Yellow', element: 'span', styles: {'background-color': 'Yellow'}}
    ]);
    
    CKEDITOR.editorConfig = function (config) {
        config.toolbarGroups = [
            {name: 'document', groups: ['mode', 'document', 'doctools']},
            {name: 'clipboard', groups: ['clipboard', 'undo']},
            {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
            {name: 'forms', groups: ['forms']},
            {name: 'colors', groups: ['colors']},
            {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
            {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph', 'mdmUploadFiles']},
            {name: 'links', groups: ['links']},
            {name: 'insert', groups: ['insert']},
            {name: 'styles', groups: ['styles']},
            {name: 'tools', groups: ['tools']},
            {name: 'others', groups: ['others']},
            {name: 'about', groups: ['about']}
        ];
        config.extraPlugins = 'mdmUploadFiles,codesnippet,pre,codemirror,sourcedialog,widget,dialog,mdmjexcel';
        config.removeButtons = 'Source,Save,Templates,Cut,Undo,Redo,Copy,Preview,Print,PasteText,Paste,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,NewPage,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,Anchor,Unlink,BidiLtr,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Format,Font,Maximize,ShowBlocks,About,RemoveFormat,CopyFormatting,Subscript,Superscript';
        config.height = 500;
        config.stylesSet = 'mdmConfig2:/styles.js';
    };
    CKEDITOR.config.allowedContent = {
        script: true,
        $1: {
            // This will set the default set of elements
            elements: CKEDITOR.dtd,
            attributes: true,
            styles: true,
            classes: true
        }
    };
    CKEDITOR.config.contentsCss = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css';
    CKEDITOR.scriptLoader.load("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js", function (success)
    {
        console.log("bootstrap js loaded");
    });
    CKEDITOR.on('instanceReady', function () {
        console.log("loading images");
        $("div[id^=editable]").each(function (index) {
            loadImages($(this).attr('id'));
            $("#cke_" + $(this).attr('id')).css("border", "1px dotted grey");
            $("#cke_" + $(this).attr('id')).css("padding", "10px");
        });
        $("textarea[title=ckedit]").each(function (index) {
            loadImages($(this).attr('id'));
            $("#cke_" + $(this).attr('id')).css("border", "1px dotted grey");
            $("#cke_" + $(this).attr('id')).css("padding", "10px");
        });
        $('iframe').contents().click(function (e) {
            if (typeof e.target.href != 'undefined' && e.ctrlKey == true) {
                window.open(e.target.href, 'new' + e.screenX);
            }
        });


    });

    function loadImages(editor) {

        var images = $("#" + editor).find('[fileid]');
        if(images.length < 1){
           images = $("#cke_" + editor).find("iframe").contents().find('[fileid]') ;           
        }
        images.each(function (index) {
            downloadToTemp($(this));

        });

    }

    function downloadToTemp(file) {
        var formData = new FormData();
        formData.append('action', 'FILE_DOWNLOADTEMP');
        formData.append('LCMS_session', $.cookie('LCMS_session'));
        formData.append('filename', file.attr("name"));
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var jsonData = JSON.parse(request.responseText);
                var filePath = jsonData.filePath;
                console.log("Changing filepath from " + file.attr("src") + " to " + filePath);
                file.attr("src", filePath);

            }
        }
        request.open('POST', "./upload", /* async = */ false);
        request.send(formData);
    }

}




//function editRowPopup(id) {
//    var _tableObject = $("#validations-table");
//   
//    var grid = _tableObject;
//    // var id = grid.getGridParam("selrow");
//    console.log(id);
//    //$('#validations-list').BootSideMenu.close();
//
//    if (id && id !== lastSelection) {
//        var rowData = grid.jqGrid('getRowData', id);
//        var previousRowData = grid.jqGrid('getRowData', lastSelection);
//        console.log(rowData);
//        if (typeof CKEDITOR.instances["editor-" + previousRowData.validationid] !== "undefined") {
//            CKEDITOR.instances["editor-" + previousRowData.validationid].destroy();            
//        }
//        validations_getValidation($("#div-validations"), rowData.validationid);
//        lastSelection = id;
//    }
//
//
//
//
//
//};