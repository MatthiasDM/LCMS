//
//CKEDITOR.addTemplate('note',
//        {
//
//            imagesPath: CKEDITOR.getUrl(CKEDITOR.plugins.getPath('templates') + 'templates/images/'),
//            templates:
//                    [
//                        {
//                            title: 'Note',
//                            image: 'template1.gif',
//                            description: 'General template for making a note.',
//                            html:
//                                    '<html>' +
//                                    '    <head>' +
//                                    '        <meta charset="UTF-8">' +
//                                    '        <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
//                                    '        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">' +
//                                    '        <script src="https://code.jquery.com/jquery-3.2.1.min.js"  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="  crossorigin="anonymous"></script>' +
//                                    '        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script>' +
//                                    '        <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>' +
//                                    '        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>' +
//                                    '' +
//                                    '    </head>' +
//                                    '    <body>' +
//                                    '        <div>Start here</div>' +
//                                    '    </body>' +
//                                    '</html>'
//                        },
//                        {
//                            title: 'My Template 2',
//                            html:
//                                    '<h3>Template 2</h3>' +
//                                    '<p>Type your text here.</p>'
//                        }
//                    ]
//        });

CKEDITOR.addTemplates('default',
        {
            imagesPath: CKEDITOR.getUrl(CKEDITOR.plugins.getPath('templates') + 'templates/images/'),
            templates:
                    [
                        {
                            title: 'ICT-probleem',
                            image: 'my-template.PNG',
                            description: 'Sjabloon voor het oplossen van een ICT-probleem',
                            html:
                                    '<style type="text/css">.card{' +
                                    '    margin:10px;' +
                                    '  }' +
                                    '  .card-body{' +
                                    '        margin: 10px;' +
                                    '  }' +
                                    '  /*  #container .card-title a{          color: white;             ' +
                                    '                                                                                                          *  }*/' +
                                    '</style>' +
                                    '<div class="card" contenteditable="false">' +
                                    '<div class="card-header" contenteditable="false">Analyse</div>' +
                                    '' +
                                    '<div class="card-body" contenteditable="true">' +
                                    '<p> </p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<p> </p>' +
                                    '<div class="card" contenteditable="false">' +
                                    '<div class="bg-info card-header text-white" contenteditable="false">Implementatie</div>' +
                                    '<div class="card-body" contenteditable="true">' +
                                    '<p> </p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<p> </p>' +
                                    '' +
                                    '<div class="card" contenteditable="false">' +
                                    '<div class="bg-success card-header text-white" contenteditable="false">Validatie</div>' +
                                    '<div class="card-body" contenteditable="true">' +
                                    '<p> </p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<p> </p>' +
                                    '<p> </p>'
                        }, {
                            title: 'checklijst',
                            image: 'my-template.PNG',
                            description: 'Agemene checklijst',
                            html:
                                    '<script crossorigin="anonymous" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" src="./JS/dependencies/jquery/jquery.js"></script>' +
                                    '<style type="text/css">.list-group-item:nth-of-type(odd) {' +
                                    '    background : #f9f9f9;' +
                                    '}' +
                                    '  .list-group-item:hover{' +
                                    '     background : #aeeeee;' +
                                    '    cursor: pointer;' +
                                    '  }' +
                                    '  .list-group-item span{' +
                                    '    margin-left:5px;' +
                                    '  }' +
                                    '  .card{' +
                                    '    max-width:500px;    ' +
                                    '  }' +
                                    '</style>' +
                                    '<div class="card" contenteditable="false">' +
                                    '<div class="bg-success card-header" contenteditable="false">Checklijst titel</div>' +
                                    '' +
                                    '<ul class="list-group list-group-flush">' +
                                    '	<li class="list-group-item" name="check"><input class="default" type="checkbox" /><span>Optie 1</span></li>' +
                                    '	<li class="list-group-item" name="check"><input class="default" type="checkbox" /><span>Optie 2</span></li>' +
                                    '	<li class="list-group-item" name="check"><input class="default" type="checkbox" /><span>Optie 3</span></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '<script>' +
                                    ' console.log($("input"));' +
                                    '$("input").on("click", function(e){    console.log("clicked");    e.stopPropagation(); });' +
                                    '$("li[name=\'check\']").on("click", function(e){  $(this).find("input")[0].click();  e.stopPropagation(); })</script>'
                        }
                    ]
        });