function config3() {


}

function config2() { //for inline editing
    console.log("function config2");
    let imageController = new LCMSImageController();


    if (typeof CKEDITOR.stylesSet.registered["mdmConfig2"] === "undefined") {
        CKEDITOR.stylesSet.add('mdmConfig2', [
            // Block-level styles     
            {name: 'Hoofdding 1', element: 'h1', styles: {'color': 'rgb(79,129,189)'}},
            {name: 'Hoofdding 2', element: 'h2', styles: {'color': 'rgb(79,129,189)'}},
            {name: 'Hoofdding 3', element: 'h3', styles: {'color': 'rgb(79,129,189)'}},
            {name: 'Hoofdding 4', element: 'h4', styles: {'color': 'rgb(79,129,189)', 'font-style': 'italic'}},
            {name: 'Hoofdding 5', element: 'h5', styles: {'color': 'rgb(36,63,96)'}},

            // Inline styles
            {name: 'Normaal', element: 'span', attributes: {'class': 'my_style'}},
            {name: 'Marker: Yellow', element: 'span', styles: {'background-color': 'Yellow'}}
        ]);
    }

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
        config.templates_files = ['./JS/ckeditor/plugins/templates/templates/defaultLCMS.js'];
        config.templates_replaceContent = false;
        config.extraPlugins = 'mdmUploadFiles,codesnippet,pre,codemirror,sourcedialog,widget,dialog,mdmjexcel,templates';
        config.format_tags = 'div';
        config.removeButtons = 'Source,Save,Cut,Undo,Redo,Copy,MenuButton,Preview,Print,PasteText,Paste,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,NewPage,Outdent,Indent,CreateDiv,Blockquote,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,Unlink,BidiLtr,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Format,Font,Maximize,ShowBlocks,About,RemoveFormat,CopyFormatting,Subscript,Superscript';//Anchor
        config.removePlugins = 'liststyle,tabletools,scayt,menubutton,contextmenu,language,tableselection,iframe,forms';
        config.startupShowBorders = false;
        config.height = 500;
        // config.autoGrow_minHeight = 500;
        //config.autoGrow_maxHeight = 3000;
        //config.autoGrow_onStartup = true;
        config.resize_enabled = true;
        config.title = false;
        config.stylesSet = 'mdmConfig2:/styles.js';
        config.allowedContent = true;
        CKEDITOR.dtd.$removeEmpty['span'] = false;
        CKEDITOR.dtd.$removeEmpty['i'] = false;
        CKEDITOR.config.protectedSource.push(/<([\S]+)[^>]*class="preserve"[^>]*>.*<\/\1>/g);

        config.codemirror = {
            theme: 'base16-light'
        };
    };
    CKEDITOR.config.contentsCss = ['./JS/dependencies/bootstrap/bootstrap_themes/flatly/bootstrap.min.css', "./CSS/style.css"];

//    CKEDITOR.on('instanceCreated', function (e) {
//        var editorId = e.editor.name;
//        window.jQuery || CKEDITOR.instances[editorId].insertHtml('<script crossorigin="anonymous" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" name="jquery" src="./JS/dependencies/jquery/jquery.js"></script>');
//    });

    CKEDITOR.on('instanceReady', function (e) {
        ckOnInstanceReady(e, imageController);
    });

}

function ckOnInstanceReady(e, imageController) {

    var editor = $("#" + e.editor.name);
    console.log("loading image & file management for: " + e.editor.name);
    var editorId = e.editor.name;
    if ($("#cke_" + editorId).find("iframe").length > 0) {
        var editor = $("#cke_" + editorId).find("iframe").contents().find("html");
        editor.attr("id", editorId);

    }

    //  if (typeof editor.dropzone === "undefined") {
    console.log("loading dropzone for: " + e.editor.name);
    if (typeof editor.dropzone.destroy !== "undefined") {
        editor.dropzone.destroy();
    }
    editor.dropzone({
        url: "./upload",
        clickable: false,
        createImageThumbnails: false,
        previewsContainer: false,
        init: function () {
            this.on("sending", function (file, xhr, formData) {
                formData.append('action', 'FILE_UPLOAD');
                formData.append('LCMS_session', $.cookie('LCMS_session'));
                console.log(formData);
            });
            this.on("success", function (file, response) {
                response = JSON.parse(response);
                imageController.insertFileInEditor(response.name, response.fileid, editor);
                bootstrap_alert.warning('Adding image succesfull', 'success', 1000);
            });
        }});
    // }

    editor.on('paste', function (e) {
        var pastedImages = capturePaste(e, editorId);
        setTimeout(function () {
            if (pastedImages) {
                var text = CKEDITOR.instances[editorId].getData();
                text = text.replace(/<img (?!fileid).*?>/, "");
                CKEDITOR.instances[editorId].setData(text);
            }
        }, 100);
    });

    loadImages(editorId);
    $("#cke_" + editorId).css("border", "0px dotted grey");
    $("#cke_" + editorId).css("padding", "10px");

    $("textarea[title=ckedit]").each(function (index) {
        loadImages($(this).attr('id'));
        // loadTOC($(this).attr('id'));
        $("#cke_" + $(this).attr('id')).css("border", "0px dotted grey");
        $("#cke_" + $(this).attr('id')).css("padding", "10px");
        $("#cke_" + $(this).attr('id')).css("min-height", "500px");
        $("#cke_" + $(this).attr('id')).css("max-height", "700px");

    });


}







function capturePaste(e, _editable) {

    var items = e.originalEvent.clipboardData.items;
    var images = Object.filter(items, item => item.type.includes("image"));
    Object.keys(images).forEach(function (i) {

        console.log("Item: " + images[i]);
        var blob = images[i].getAsFile();
        blob.name = blob.name + "" + uuidv4();
        Dropzone.forElement("#" + _editable).addFile(blob);

    });

    return (images.length > 0 && images.keys.length > 0);
}

function loadTOC(editors, appendTo) {
    console.log("Loading TOC");
    var level1 = 0;
    var level2 = 0;
    var level3 = 0;
    var level4 = 0;
    var level5 = 0;
    var level6 = 0;
    var headerNumber = "";
    appendTo.empty();

    $.each(editors, function (index, editor) {
        var editorContents = $(editor);
        var editorHeaders = editorContents.find("h1, h2, h3, h4, h5, h6");
//        if (editorHeaders.length < 1) {
//            editorHeaders = $("#cke_" + editor).find("iframe").contents().find("h1, h2, h3, h4, h5, h6");
//        }
//    var level1 = 0;
//    var level2 = 0;
//    var level3 = 0;
//    var level4 = 0;
//    var level5 = 0;
//    var level6 = 0;
        // $("#toc-list").empty();
        //var headerNumber = "";
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
            appendTo.append("<li class='list-group-item' style='font-size:1em' anchor='#" + uuid + "'>" + heading + " " + $(this).text() + "</li>");
            this.innerHTML = "<span class='nosave'>" + heading + " </span>" + this.innerHTML;

            var previousHeader = this.tagName.substr(1, this.tagName.length);
        });
        loadAnchors(editorContents, appendTo);
        //CKEDITOR.instances[$(editor).attr("id")].setData(CKEDITOR.instances[$(editor).attr("id")].getData());
    });


}

function loadAnchors(editorContents, appendTo) {
    console.log("Loading anchors");
    appendTo.find("li").on('click', function (event) {
        var target = editorContents.find(this.getAttribute('anchor'));
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
