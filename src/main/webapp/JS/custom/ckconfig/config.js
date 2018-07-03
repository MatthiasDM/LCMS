/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function config0() {
    CKEDITOR.stylesSet.add('mdmStijlen', [
        // Block-level styles
        {name: 'Hoofdding 1', element: 'h1', styles: {'color': 'Black'}},
        {name: 'Hoofdding 2', element: 'h2', styles: {'color': 'Black', 'font-style': 'italic'}},
        {name: 'Hoofdding 3', element: 'h3', styles: {'color': 'Blue'}},
        {name: 'Hoofdding 4', element: 'h4', styles: {'color': 'Blue', 'font-style': 'italic'}},
        {name: 'Hoofdding 5', element: 'h5', styles: {'color': 'Grey'}},

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

        config.extraPlugins = 'forms,codesnippet,widget,dialog,pre,resize,autogrow,notificationaggregator,filetools,notification,clipboard,mdmUploadFiles';

        config.format_tags = 'div';
        config.removeButtons = 'New,Radio,Save,Source,New,TextField,Textarea,Select,Button,ImageButton,HiddenField,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,Unlink,Language,BidiRtl,BidiLtr,Blockquote,CreateDiv,ShowBlocks,About,Scayt,PasteFromWord,PasteText,Paste,Copy,Cut';
        config.stylesSet = 'mdmStijlen:/styles.js';
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

function config1() {
    console.log("Loading Ckeditor config");
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
        config.extraPlugins = 'mdmUploadFiles,codesnippet,widget,dialog';
        config.removeButtons = 'Source,Save,Templates,Cut,Undo,Redo,Copy,Preview,Print,PasteText,Paste,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,NewPage,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,Anchor,Unlink,BidiLtr,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Format,Styles,Font,Maximize,ShowBlocks,About,RemoveFormat,CopyFormatting,Subscript,Superscript';
        config.height = 500;
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