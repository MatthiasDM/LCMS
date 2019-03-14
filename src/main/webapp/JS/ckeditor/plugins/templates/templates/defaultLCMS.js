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
                            title: 'My template',
                            image: 'my-template.PNG',
                            description: 'Your custom template.',
                            html:
                                    '<style>' +
                                    '    #container .row .col-sm-3{' +
                                    '        min-width: 300px; ' +
                                    '        margin: 10px;' +
                                    '    }' +
                                    '    /*  #container .card-title a{' +
                                    '          color: white;        ' +
                                    '      }*/' +
                                    '</style>' +
                                    '<div class="container" style="width:100%" id="container">' +
                                    '    <div class="row">' +
                                    '        <div class="col-sm-12 mx-auto">' +
                                    '            <div class="card text-center" style="border: 0px">' +
                                    '                <div class="card-header">' +
                                    '                    <h4 class="card-title"><a href="index.html?p=lab">Analyse</a></h4>' +
                                    '                </div>' +
                                    '                <div class="card-body" style="padding: 10px">                            ' +
                                    '                    <p class="card-text">Analyseer het probleem hier.</p>                                              ' +
                                    '                </div>' +
                                    '            </div> ' +
                                    '        </div>' +
                                    '    </div>' +
                                    '' +
                                    '    <div class="row">' +
                                    '        <div class="col-sm-12 mx-auto">' +
                                    '            <div class="card text-center" style="border: 0px">' +
                                    '                <div class="card-header">' +
                                    '                    <h4 class="card-title"><a href="index.html?p=lab">Oplossing</a></h4>' +
                                    '                </div>' +
                                    '                <div class="card-body" style="padding: 10px">                            ' +
                                    '                    <p class="card-text">Hoe wordt het probleem opgelost?</p>                                              ' +
                                    '                </div>' +
                                    '            </div> ' +
                                    '        </div>' +
                                    '    </div>' +
                                    '' +
                                    '    <div class="row">' +
                                    '        <div class="col-sm-12 mx-auto">' +
                                    '            <div class="card text-center" style="border: 0px">' +
                                    '                <div class="card-header">' +
                                    '                    <h4 class="card-title"><a href="index.html?p=lab">Validatie</a></h4>' +
                                    '                </div>' +
                                    '                <div class="card-body" style="padding: 10px">                            ' +
                                    '                    <p class="card-text">Documenteer hier hoe de oplossing is gevalideerd.</p>                                              ' +
                                    '                </div>' +
                                    '            </div> ' +
                                    '        </div>' +
                                    '    </div>' +
                                    '' +
                                    '</div>'
                        },
                    ]
        });