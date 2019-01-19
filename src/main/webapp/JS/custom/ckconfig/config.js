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
//    CKEDITOR.scriptLoader.load("./JS/dependencies/iframeresizer/iframeResizer.min.js", function (success)
//    {
//        console.log("iframeResizer js loaded");
//
//    });
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

function config2() { //for inline editing
    console.log("function config2");
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
//    CKEDITOR.scriptLoader.load("./JS/dependencies/iframeresizer/iframeResizer.min.js", function (success)
//    {
//        console.log("iframeResizer js loaded");
//
//    });
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
        config.removeButtons = 'Source,Save,Templates,Cut,Undo,Redo,Copy,MenuButton,Preview,Print,PasteText,Paste,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,NewPage,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,Anchor,Unlink,BidiLtr,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Format,Font,Maximize,ShowBlocks,About,RemoveFormat,CopyFormatting,Subscript,Superscript';
        config.removePlugins = 'liststyle,tabletools,scayt,menubutton,contextmenu,language,tableselection,iframe,forms';

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
           // loadTOC($(this).attr('id'));
            $("#cke_" + $(this).attr('id')).css("border", "1px dotted grey");
            $("#cke_" + $(this).attr('id')).css("padding", "10px");
        });
        $("textarea[title=ckedit]").each(function (index) {
            loadImages($(this).attr('id'));
           // loadTOC($(this).attr('id'));
            $("#cke_" + $(this).attr('id')).css("border", "1px dotted grey");
            $("#cke_" + $(this).attr('id')).css("padding", "10px");
        });

        $('iframe').contents().click(function (e) {
            if (typeof e.target.href != 'undefined' && e.ctrlKey == true) {
                window.open(e.target.href, 'new' + e.screenX);
            }
        });

        $('iframe').contents().bind("paste", function (e) {
            capturePaste(e);
        });

    });
}



function loadImages(editor) {
    var images = $("#" + editor).find('[fileid]');
    if (images.length < 1) {
        images = $("#cke_" + editor).find("iframe").contents().find('[fileid]');
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

function capturePaste(e) {
    var items = e.originalEvent.clipboardData.items;
    var images = Object.filter(items, item => item.type.includes("image"))

    Object.keys(images).forEach(function (i) {
        console.log("Item: " + images[i]);
        var blob = images[i].getAsFile();
        console.log(blob);
    });
}

function loadTOC(editor) {
    console.log("Loading TOC");
    var editorContents = $("#" + editor)
    var editorHeaders = editorContents.find("h1, h2, h3, h4, h5, h6");
    if (editorHeaders.length < 1) {
        editorHeaders = $("#cke_" + editor).find("iframe").contents().find("h1, h2, h3, h4, h5, h6");
    }
    var level1 = 0;
    var level2 = 0;
    var level3 = 0;
    var level4 = 0;
    var level5 = 0;
    var level6 = 0;
    $("#toc-list").empty();
    var headerNumber = "";
    editorHeaders.each(function (index) {
        var currentHeader = this.tagName.substr(1, this.tagName.length);
        if (currentHeader === "1") {
            level1++;
            level2 = 0;
            level3 = 0;
            level4 = 0;
            level5 = 0;
            level6 = 0;
        }
        if (currentHeader === "2") {
            level2++;
            level3 = 0;
            level4 = 0;
            level5 = 0;
            level6 = 0;
        }
        if (currentHeader === "3") {
            level3++;
            level4 = 0;
            level5 = 0;
            level6 = 0;
        }
        if (currentHeader === "4") {
            level4++;
            level5 = 0;
            level6 = 0;
        }
        if (currentHeader === '5') {
            level5++;
            level6 = 0;
        }
        if (currentHeader === '6') {
            level6++;
        }
        var uuid = uuidv4();
        $(this).attr("id", uuid);
        var heading = level1 + "." + level2 + "." + level3 + "." + level4 + "." + level5 + "." + level6;
        while (heading.slice(-1) === "0") {
            heading = heading.substr(0, heading.length - 2);
        }
        heading += ".";
        $("#toc-list").append("<li class='list-group-item' anchor='#" + uuid + "'>" + heading + " " + $(this).text() + "</li>");
        this.innerHTML = "<span class='nosave'>" + heading + " </span>" + this.innerHTML;

        var previousHeader = this.tagName.substr(1, this.tagName.length);
    });
    loadAnchors(editorContents);
}

function loadAnchors(editorContents) {
    console.log("Loading anchors");
    $('#toc-list li').on('click', function (event) {
        var target = editorContents.contents().find(this.getAttribute('anchor'));
        //var target = $(this.getAttribute('anchor'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
}

//    for (var i = 0; i < e.originalEvent.clipboardData.items.length; i++) {
//        var files = e.clipboardData.files;
//        console.log("Item: " + item.type);
////        if (item.type.indexOf("image" - 1) {
////            uploadFile(item.getAsFile());
////        } else {
////            console.log("Discardingimage paste data");
////        }
//    }
