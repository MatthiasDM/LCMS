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
                                    '<div class="card" contenteditable="true">' +
                                    '<div class="card-header" contenteditable="false">Analyse</div>' +
                                    '' +
                                    '<div class="card-body" contenteditable="true">' +
                                    '<p> </p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<p> </p>' +
                                    '<div class="card" contenteditable="true">' +
                                    '<div class="bg-info card-header text-white" contenteditable="false">Implementatie</div>' +
                                    '<div class="card-body" contenteditable="true">' +
                                    '<p> </p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<p> </p>' +
                                    '' +
                                    '<div class="card" contenteditable="true">' +
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
                            html: '<p> </p><p>' +
                                    '   <style type="text/css">.list-group-item:nth-of-type(odd) {    background : #f9f9f9;}  .list-group-item:hover{     background : #aeeeee;    cursor: pointer;  }  .list-group-item span{    margin-left:5px;  }  #card-check{    max-width:500px;      }</style>' +
                                    '</p>' +
                                    '<div class="card" id="card-check" contenteditable="false">' +
                                    '   <div class="bg-success card-header" contenteditable="false"><span contenteditable="true">Checklijst overschakeling BN-nummering folaat en VB12</span></div>' +
                                    '   <ul class="list-group list-group-flush"></ul>' +
                                    '   <button class="btn btn-info" id="btn-new-line" type="button">nieuwe lijn</button>' +
                                    '</div>' +
                                    '<p>' +
                                    '   <script>' +
                                    '      console.log($("input"));' +
                                    '      $("input").on("click", function(e){ ' +
                                    '          console.log("clicked");' +
                                    '          e.stopPropagation(); ' +
                                    '      });' +
                                    '      $("#btn-new-line").on("click", function(e){       ' +
                                    '          console.log("clicked");' +
                                    '          var list_item = $("<li class=\'list-group-item\' name=\'check\'><div class=\'container\'><div class=\'row\'><div class=\'col-sm-1\'><input checked=\'checked\' class=\'default\' type=\'checkbox\' /></div><div class=\'col-sm-10\'><span contenteditable=\'true\'>Nieuw item</span></div><div class=\'col-sm-1\'><span class=\'badge badge-secondary\' name=\'span-delete\'>X</span></div></div></div></li>");' +
                                    '          list_item.on("click", function(e){' +
                                    '          $(this).find("input")[0].click();' +
                                    '          $(this).find("input").attr("checked", "checked");' +
                                    '          e.stopPropagation(); ' +
                                    '        });' +
                                    '           list_item.find("span[name=\'span-delete\']").on("click", function(e){' +
                                    '            $(this).closest("li").remove();' +
                                    '          });' +
                                    '           $("#btn-new-line").closest("div").find("ul").append(list_item);' +
                                    '          e.stopPropagation(); ' +
                                    '        });        ' +
                                    '        $("li[name=\'check\']").on("click", function(e){' +
                                    '          $(this).find("input")[0].click();' +
                                    '          $(this).find("input").attr("checked", "checked");' +
                                    '          e.stopPropagation(); ' +
                                    '        });' +
                                    '          $("span[name=\'span-delete\']").on("click", function(e){' +
                                    '            $(this).closest("li").remove();' +
                                    '          });' +
                                    '   </script>' +
                                    '</p><p> </p>'
                        }, {
                            title: 'Nieuwe bepaling GLIMS',
                            image: 'my-template.PNG',
                            description: 'Checklijst bij het aanmaken van een nieuwe bepaling',
                            html: '<ol class="customCheckList">' +
                                    '	<li><strong>Bepaling aanmaken</strong>' +
                                    '	<ol>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch1" style="">Mnemonic</label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch2">Beschrijving</label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch3">Korte naam</label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch4">Code</label></div>' +
                                    '		</li>' +
                                    '		<li>Hoofdpagina' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch5">Datatype</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch6">Eenheid (ivt)</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch7"><b disabled="disabled">Op telefoonlijst</b></label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>Toegelaten waarden (ivt)' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch8">Keuzelijst</label></div>' +
                                    '			</li>' +
                                    '			<li>Welke resultaatcodes mogen toegelaten worden? ' +
                                    '			<ol>' +
                                    '				<li>Resultaatcodes aanmaken (ivt)' +
                                    '				<ol>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch9">Code</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch10">Bepaling</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch11">Expansie (is een "tekst")</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch12">Aanrekenen?</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch13">Alarmniveau</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch14">Actie</label></div>' +
                                    '					</li>' +
                                    '				</ol>' +
                                    '				</li>' +
                                    '			</ol>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>Rapport' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch15">Gerapporteerde decimalen</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch16">Layout (ivt)</label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>Triggers' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch17">"Doorbelwaarde" bij "Bij Confirmatie" (ivt)</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch18">Een commentaartrigger bij "Bij resultaatinvoer" (ivt)</label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>Actieve normen' +
                                    '		<ol>' +
                                    '			<li>Indien geen doorbelwaarde' +
                                    '			<ol>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch19">Invoer van grenzen</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch20">Rapporttekst: "tekst" voor een aangepaste weergave van de ref.waarde (ivt)</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch21">Andere velden indien daar nood aan is.</label></div>' +
                                    '				</li>' +
                                    '			</ol>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li><strong>Meetmethoden</strong>' +
                                    '	<ol>' +
                                    '		<li>Instellingen' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch22">Station</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch23">Kanaalnr in: onder welke code de test naar buiten wordt verstuurd.</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch24">Kanaalnr uit: onder welke code het resultaat binnenkomt. </label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch25">Conversie (ivt): een MISPL die het ruwe resultaat kan omzetten in iets anders. </label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch26">Eenheid (ivt) indien de inkomende eenheid niet hetzelfde is als de gerapporteerde eenheid</label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>Status' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch27">Status: aan of uit.</label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>Grenzen' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch28"><strong disabled="disabled">Telefoon alarmniveau</strong>: op 50 zetten indien dit doorbelwaarde is. </label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch29"><strong disabled="disabled">Alarmnivuea confirmatie & autorisatie:</strong> op 99 zetten indien dit resultaat automatisch geautoriseerd moet worden. </label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li>Bepalingsoutput: op welke procedures  de meetmethode(n) komt te staan. ' +
                                    '	<ol>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch30"><strong disabled="disabled">Verbruik</strong>: bij verzendingen zeker van belang voor berekening aantal tubes.</label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch31"><strong disabled="disabled">Waarde </strong>(ivt): bij berekende velden die niet op een toestel moeten. </label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch32"><strong disabled="disabled">Procedure</strong>: de procedure van het station waaronder de output valt.</label></div>' +
                                    '		</li>' +
                                    '		<li><strong>(indien geen procedure geschikt is)</strong>' +
                                    '		<ol>' +
                                    '			<li>Aanmaak nieuwe procedure' +
                                    '			<ol>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch33">Hoofdpagina</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch34">Naam: behoudt in de naam een referentie naar de naam of code van het station)</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch35">Code: idem als naam qua structuur</label></div>' +
                                    '				</li>' +
                                    '				<li>Hoofdpagina' +
                                    '				<ol>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch36">Departement : knokke of blank, bij verzendingen is dit het uitvoerend labo.</label></div>' +
                                    '					</li>' +
                                    '				</ol>' +
                                    '				</li>' +
                                    '				<li>Selectie' +
                                    '				<ol>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch37">Geldigheid: <strong disabled="disabled">Knokke_departement</strong> of <strong disabled="disabled">Blank_departement </strong>of andere. De acties zijn geldig op deze procedure indien aan de opgegeven MISPL wordt voldaan.</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch38">Inputs: meestal een materiaal, maar kan bij berekeningen ook een of meerdere meetmethoden zijn.</label></div>' +
                                    '					</li>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch39">Output: de meetmethoden die "uit" de procedure komen.  (bv. de procedure voor serum of de vitros, heeft als input het materiaal "klonter" (serum) en als outputs de testen die op de vitros, op het materiaal gebeuren.)</label></div>' +
                                    '					</li>' +
                                    '				</ol>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch40"><strong disabled="disabled">Werklijstsjabloon regels </strong>(nodig om de testen op een werklijst te kunnen tonen) </label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch41"><strong disabled="disabled">Actief zetten: </strong>aan of uit</label></div>' +
                                    '				</li>' +
                                    '			</ol>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li>Codeersystemen' +
                                    '	<ol>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch42"><strong disabled="disabled">Medidoc</strong>: code toevoegen. De medidoc code kan opgezocht worden via de <a disabled="disabled" href="https://www.vas.ehealth.fgov.be/webretam/retam/home.htm?eventName=MENU_SEARCH">RETAM</a>-toepassing. Indien geen toepasbare MEDIDOC-code te vinden is mag men zelf één maken met de prefix <strong disabled="disabled">W831.</strong></label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch43"><strong disabled="disabled">LOINC codes van bepaling</strong>: LOINC doe opzoeken in subset van Belgische coders: <a disabled="disabled" href="https://www.vas.ehealth.fgov.be/webretam/retam/home.htm?eventName=MENU_SEARCH">RETAM</a></label></div>' +
                                    '		</li>' +
                                    '		<li>Indien lab-lab' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch44">De relevante "Property", "RequestCode" en "Material" opvragen in het externe labo, en al dan niet toevoegen aan ons codeersysteem. </label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li>Bepalingsordeningen' +
                                    '	<ol>' +
                                    '		<li>In de meeste gevallen:' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch45">Scherm</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch46">Cyberlab</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch47">Medidoc</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch48">Scheikunde of Bacterio</label></div>' +
                                    '			</li>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch49">(Lab-lab...) indien een verzending naar lab-lab</label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li>Aanvraagcode en definitie' +
                                    '	<ol>' +
                                    '		<li>De automatisch aangemaakt aanvraagcode aanpassen in een relevante nummering. ' +
                                    '		<ol>' +
                                    '			<li>Aanvraagcode' +
                                    '			<ol>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch50">Mnemonic: de code</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch51">Naam: de naam</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch52">Actief</label></div>' +
                                    '				</li>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch53">Expliciet aanvraagbaar: kan de aanvraagcode rechtstreeks aangevraagd worden</label></div>' +
                                    '				</li>' +
                                    '			</ol>' +
                                    '			</li>' +
                                    '			<li>Aanvraagdefinitie' +
                                    '			<ol>' +
                                    '				<li>' +
                                    '				<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch54">In de meeste gevallen geen extra aanpassingen</label></div>' +
                                    '				</li>' +
                                    '				<li>Verrekening' +
                                    '				<ol>' +
                                    '					<li>' +
                                    '					<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch55">Aanrekenen aan of uit zetten</label></div>' +
                                    '					</li>' +
                                    '					<li>Verrekencodes' +
                                    '					<ol>' +
                                    '						<li>' +
                                    '						<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch56">Geldig van</label></div>' +
                                    '						</li>' +
                                    '						<li>' +
                                    '						<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch57">Verrekencode</label></div>' +
                                    '						</li>' +
                                    '						<li>' +
                                    '						<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch58">Uitvoeringsklasse: het labo waarin de analyse wordt uitgevoerd. Deze uitvoeringsklassen zijn gekoppeld aan de "beschikbaarheid" van een verantwoordelijk bioloog die gekoppeld is aan een bepaald labo, waarin bepaalde departementen zijn gedefinieerd. <strong disabled="disabled">Er moet dus een rechtstreeks verband zijn tussen het departement (vb knokke, blank) en de uitvoeringsklasse. </strong>Zoniet zal de facturatie mislukken. </label></div>' +
                                    '						</li>' +
                                    '					</ol>' +
                                    '					</li>' +
                                    '				</ol>' +
                                    '				</li>' +
                                    '			</ol>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch59">Afhankelijk van het soort test een panel aanmaken waar medere aanvraagdefenities geproepeerd in zitten.</label></div>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li>Cyberlab' +
                                    '	<ol>' +
                                    '		<li>Toehankelijkheid test in de aanvraagsjablonen. : test al dan niet toevoegen' +
                                    '		<ol>' +
                                    '			<li>' +
                                    '			<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch60">(ivt) extra info</label></div>' +
                                    '			</li>' +
                                    '		</ol>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch61">Resultaat onder het juiste hoofdstuk zetten. </label></div>' +
                                    '		</li>' +
                                    '		<li>' +
                                    '		<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch62">(ivt) variabelen definieren. </label></div>' +
                                    '		</li>' +
                                    '	</ol>' +
                                    '	</li>' +
                                    '	<li>' +
                                    '	<div class="custom-control custom-switch" disabled="disabled" onclick="changeCheck(this)"><input class="custom-control-input" disabled="disabled" type="checkbox" /> <label class="custom-control-label" disabled="disabled" for="customSwitch63">CPD controleren of het resultaat juist wordt weergegeven.</label></div>' +
                                    '	</li>' +
                                    '</ol>' +
                                    '<script>' +
                                    '' +
                                    '  function changeCheck(id){' +
                                    '     console.log("loading check function...");    ' +
                                    '  ' +
                                    '    var enabled =     $(id).find("*").prop("disabled");' +
                                    '    var checked =  $(id).find("input").prop(\'checked\');' +
                                    '    if(!checked){' +
                                    '     $(id).find("input").attr("checked", "checked");' +
                                    '    }else{' +
                                    '      $(id).find("input").removeAttr("checked");' +
                                    '    }' +
                                    '    if(!enabled){' +
                                    '        $(id).find("*").attr("disabled", "disabled");' +
                                    '    }else{' +
                                    '        $(id).find("*").removeAttr("disabled");' +
                                    '    }' +
                                    '' +
                                    '  }</script>' +
                                    '<style type="text/css">.customCheckList{' +
                                    '    width: 600px; ' +
                                    '    max-width: 700px;' +
                                    '  }' +
                                    '' +
                                    '  ' +
                                    '' +
                                    '.switch {' +
                                    '  position: relative;' +
                                    '  display: inline-block;' +
                                    '  width: 60px;' +
                                    '  height: 34px;' +
                                    '    margin-right: 20px;' +
                                    '}' +
                                    '' +
                                    '/* Hide default HTML checkbox */' +
                                    '.switch input {' +
                                    '  opacity: 0;' +
                                    '  width: 0;' +
                                    '  height: 0;' +
                                    '}' +
                                    '' +
                                    '/* The slider */' +
                                    '.slider {' +
                                    '  position: absolute;' +
                                    '  cursor: pointer;' +
                                    '  top: 0;' +
                                    '  left: 0;' +
                                    '  right: 0;' +
                                    '  bottom: 0;' +
                                    '  background-color: #ccc;' +
                                    '  -webkit-transition: .4s;' +
                                    '  transition: .4s;' +
                                    '}' +
                                    '' +
                                    '.slider:before {' +
                                    '  position: absolute;' +
                                    '  content: "";' +
                                    '  height: 26px;' +
                                    '  width: 26px;' +
                                    '  left: 4px;' +
                                    '  bottom: 4px;' +
                                    '  background-color: white;' +
                                    '  -webkit-transition: .4s;' +
                                    '  transition: .4s;' +
                                    '}' +
                                    '' +
                                    'input:checked + .slider {' +
                                    '  background-color: #2196F3;' +
                                    '}' +
                                    '' +
                                    'input:focus + .slider {' +
                                    '  box-shadow: 0 0 1px #2196F3;' +
                                    '}' +
                                    '' +
                                    'input:checked + .slider:before {' +
                                    '  -webkit-transform: translateX(26px);' +
                                    '  -ms-transform: translateX(26px);' +
                                    '  transform: translateX(26px);' +
                                    '}' +
                                    '' +
                                    '/* Rounded sliders */' +
                                    '.slider.round {' +
                                    '  border-radius: 34px;' +
                                    '}' +
                                    '' +
                                    '.slider.round:before {' +
                                    '  border-radius: 50%;' +
                                    '}' +
                                    '  ' +
                                    '  .list-group-item:nth-of-type(even){' +
                                    '    background-color: #hhhhhh;' +
                                    '}' +
                                    '  ' +
                                    '  .custom-switch:hover{' +
                                    '    background-color: lightblue;    ' +
                                    '  }' +
                                    '</style>' +
                                    '<p> </p>'
                        }

                    ]
        });