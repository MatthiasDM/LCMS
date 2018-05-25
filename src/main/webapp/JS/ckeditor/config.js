/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.stylesSet.add('mdmStijlen', [
    // Block-level styles
    {name: 'Hoofdding 1', element: 'h1', styles: {'color': 'Black'}},
    {name: 'Hoofdding 2', element: 'h2', styles: {'color': 'Black'}},
    {name: 'Hoofdding 3', element: 'h3', styles: {'color': 'Black'}},
    {name: 'Hoofdding 4', element: 'h4', styles: {'color': 'Black'}},
    {name: 'Hoofdding 5', element: 'h5', styles: {'color': 'Black'}},

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


