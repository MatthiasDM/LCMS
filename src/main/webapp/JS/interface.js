$(function () {
    // sessionCountdown();

    Object.filter = (obj, predicate) =>
        Object.keys(obj)
                .filter(key => predicate(obj[key]))
                .reduce((res, key) => (res[key] = obj[key], res), {});




    $.fn.modal.Constructor.prototype._enforceFocus = function () {
        modal_this = this;
        try {
            $(document).on('focusin.modal', function (e) {

                if (typeof modal_this.$element !== "undefined") {

                    if (modal_this.$element[0] !== e.target
                            &&
                            !modal_this.$element.has(e.target).length
                            &&
                            !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                        modal_this.$element.focus()
                    }

                }


            })
        } catch (e) {

        }


    };

//    Object.prototype.clone = Array.prototype.clone = function ()
//    {
//        if (Object.prototype.toString.call(this) === '[object Array]')
//        {
//            var clone = [];
//            for (var i = 0; i < this.length; i++)
//                clone[i] = this[i].clone();
//
//            return clone;
//        } else if (typeof (this) == "object")
//        {
//            var clone = {};
//            for (var prop in this)
//                if (this.hasOwnProperty(prop))
//                    clone[prop] = this[prop].clone();
//
//            return clone;
//        } else
//            return this;
//    }


});

function loadParameters(jsonData) {
    var webPage = $($.parseHTML(jsonData.webPage, document, true));
    var scripts = jsonData.scripts;
    var parameters = jsonData.parameters;

    $.each(parameters, function (key, value) {
        webPage.find("[LCMS='" + key + "']").append(value);
    });
    jsonData.parent.append(webPage);
    jsonData.parent.append("<script>" + scripts + "</script>");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function setJumbo(page) {

    if (page === null || typeof page === 'undefined') {
        page = "default";
    }
    console.log("generaring breadcrumbs");
    var breadcrumbs = page.split("/");
    var crumblink = "";
    if (breadcrumbs.length > 1) {
        var bcList = $("<ol class='breadcrumb bg-light' style='padding: 0; margin-bottom: 0'></ol>");
        for (var crumb in breadcrumbs) {
            crumblink += breadcrumbs[crumb] + "/";
            var bcItem = $("<li class='breadcrumb-item'><a href='index.html?p=" + crumblink + "'>" + breadcrumbs[crumb] + "</a></li>");
            bcList.append(bcItem);
        }
        $("#text-jumbo-crumbs").append(bcList);
    }

    $("#text-jumbo-heading").text(lang.jumbo[page]);
    $("#text-jumbo-info").text(lang.jumbo_info[page]);


//    <ol class="breadcrumb">
//        <li class="breadcrumb-item"><a href="#">Home</a></li>
//        <li class="breadcrumb-item"><a href="#">Library</a></li>
//        <li class="breadcrumb-item active">Data</li>
//    </ol>

}

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function sessionCountdown() {
    var diffTime = $("#userInfo-session-timout").text();
    if (diffTime === null) {
        diffTime = 0;
    }
    var duration = moment.duration(diffTime * 1000, 'milliseconds');
    var interval = 1000;

    setInterval(function () {
        duration = moment.duration(duration - interval, 'milliseconds');
        $("#userInfo-session-timout").text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds())
    }, interval);
}
bootstrap_alert = function () {};
bootstrap_alert.warning = function (message, alert, timeout) {
    var id = uuidv4();
    $('<div id="floating_alert_' + id + '" class="alert alert-' + alert + ' alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>' + message + '&nbsp;&nbsp;</div>').appendTo($("#alertWrapper"));
    setTimeout(function () {
        $("#floating_alert_" + id).alert('close');
    }, timeout);
};
(function ($, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    $.fn.serializeObject = function () {
        var obj = {};

        $.each(this.serializeArray(), function (i, o) {
            var n = o.name,
                    v = o.value;

            obj[n] = obj[n] === undefined ? v
                    : $.isArray(obj[n]) ? obj[n].concat(v)
                    : [obj[n], v];
        });

        return obj;
    };

})(jQuery);
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class LCMSloading {
    constructor(loaded) {
        this.loaded = loaded;
        this.dialogShown = false;
    }
    loading() {
        if (this.loaded === true) {
            hideLoading();
            return true;                
        } else {
            if(!this.dialogShown){
               showLoading();
               this.dialogShown = true;
            }            
           
        }
    }
    setLoaded(loaded){
        this.loaded = loaded;
        this.loading();
    }
}

function removeElements(classname, source) {
    console.log("removeElements()");
    var $s = $(source).find("." + classname).remove().end();
    return $("<div></div>").append($s).html()
}

$.fn.textWidth = function (text, font) {
    if (!$.fn.textWidth.fakeEl)
        $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

function create_modal(parent, title, text) {

    var modal = $("<div class='modal' tabindex='-1' role='dialog'></div>");
    var modal_dialog = $("<div class='modal-dialog modal-lg' role='document'></div>");
    var modal_content = $("<div class='modal-content'></div>");
    var modal_header = $("<div class='modal-header'></div>");
    var modal_title = $("<h5 class='modal-title'>" + title + "</h5>");
    var modal_title_close = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
    var modal_body = $("<div class='modal-body'>" + text + "</div>");
    var modal_footer = $("<div class='modal-footer'><button type='button' id='btn-save' class='btn btn-primary'>Save changes</button><button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button></div>");

    modal_header.append(modal_title);
    modal_header.append(modal_title_close);
    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);
    modal_dialog.append(modal_content);
    modal.append(modal_dialog);

    parent.append(modal);

    return modal;

}

function showLoading() {
    var m = create_blank_modal($("body"), "loadingModal", "<center><h4>Laden...</h4><img src='./images/loading.gif'/></center>", "top:30%;");
    m.modal({keyboard: false, backdrop: 'static'}, 'show');
}

function hideLoading() {
    $("#loadingModal").modal('hide');
    $("#loadingModal").remove();
}

function create_blank_modal(parent, id, html, style) {

    var modal = $("<div class='modal' id=" + id + " tabindex='-1' role='dialog'></div>");
    var modal_dialog = $("<div class='modal-dialog modal-sm' style=" + style + " role='document'></div>");
    var modal_content = $("<div class='modal-content'></div>");
    var modal_body = $("<div class='modal-body'></div>");
    modal_body.append(html);
    modal_content.append(modal_body);
    modal_dialog.append(modal_content);
    modal.append(modal_dialog);
    parent.append(modal);

    return modal;

}

function forms_textarea(title, id, name, choices) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var textarea = $("<textarea wrap='off' class='form-control' name='" + name + "' id='textarea-" + id + "' rows='4'></textarea>");
    form_group.append(label);
    form_group.append(textarea);

    for (var choiceKey in choices) {
        textarea.append(choices[choiceKey] + "\n");
    }
    return form_group;
}
function forms_checkbox(title, id, name, val) {
    var form_check = $("<div style='text-align:left' id='" + id + "' class=\"form-check\"></div>");
    var checkbox = $("<input class=\"form-check-input\" type=\"checkbox\" name='" + name + "' id='" + id + "'>");
    var label = $("<label class=\"form-check-label\" for='" + title + "'>" + title + "<\/label>");
    form_check.append(checkbox);
    form_check.append(label);
    checkbox.attr("checked", val);
    return form_check;
}
function forms_textbox(title, id, name, val) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var textbox = $("<input class=\"form-control\" type=\"text\" value=\"\" name='" + name + "' id='" + id + "' >");
    form_group.append(label);
    form_group.append(textbox);
    textbox.val(val);
    return form_group;
}
function forms_hidden(id, name, val) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var hidden = $("<input class=\"form-control\" type=\"hidden\" value=\"\" name='" + name + "' id='" + id + "' >");
    form_group.append(hidden);
    hidden.val(val);
    return form_group;
}
function forms_select(title, id, name, valObjects, val) {
    console.log("forms_select()");
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var select = $("<select class='form-control' multiple name='" + name + "' id='select-" + id + "'></select>");
    Object.keys(valObjects).forEach(function (key) {
        select.append($("<option value='" + valObjects[key].name + "'>" + valObjects[key].name + "</option>"));
    });
    form_group.append(label);
    form_group.append(select);
    if (typeof val !== "undefined") {
        select.val(val);
    }
    return form_group;

}
function forms_select_single(title, id, name, valObjects, val) {
    console.log("forms_select()");
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var select = $("<select class='form-control' name='" + id + "' id='select-" + id + "'></select>");
    Object.keys(valObjects).forEach(function (key) {
        select.append($("<option value='" + valObjects[key].id + "'>" + valObjects[key].name + "</option>"));
    });
    form_group.append(label);
    form_group.append(select);
    select.val(val);
    return form_group;

}
function forms_jqgrid(id, data) {
    var form_group = $("<div id='" + id + "' class='form-group'></div>");
    var label = $("<label for='" + title + "'>" + title + "</label>");
    var jqgrid = $("<table id='jqgrid-" + id + "'></table>");
    jqgrid.jqGrid(data);
    form_group.append(label);
    form_group.append(jqgrid);
    return form_group;
}

function dom_progressbar(bars, id) {
    var progress = $("<div class='progress' id='" + id + "'></div>");
    Object.keys(bars).forEach(function (index) {
        progress.append("<div class='progress-bar-striped' role='progressbar' style='background-color:" + bars[index].color + ";width: " + bars[index].value + "%' aria-valuenow='" + bars[index].value + "' aria-valuemin='0' aria-valuemax='100'></div>");
    });
    return progress;
}
function dom_moveUpDownList(id, data) {
    console.log("dom_moveUpDownList()");
    var wrapper = dom_div("", id);

    //-------------------
    var container = dom_div("container");
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col("", 6);
    var col2 = dom_col("", 6);
    col1.attr('align', 'center');
    col2.attr('align', 'center');
    var btn1 = dom_button("up", "arrow-up", "", "outline-secondary");
    var btn2 = dom_button("down", "arrow-down", "", "outline-secondary");
    //-------------------
    var row2 = dom_row();
    var col3 = dom_col("", 12);
    var ul = $("<ul class='list-group' id='element-list'></ul> ");

    data.each(function (index, obj) {
        var type = "";
        if (obj.id.includes("editable")) {
            type = "(tekst) ";
        } else if (obj.id.includes("gbox")) {
            type = "(tabel) ";
        }
        ul.append("<li class='list-group-item' style='padding:0.5rem;font-size: 1rem;' element='" + obj.id + "'>" + "<span>" + type + (index + 1) + "</span>" + ": " + obj.innerText.substring(0, 20).trim() + "</li>");
    });

    //-------------------

    container.append(row1);
    row1.append(col1);
    col1.append(btn1);
    row1.append(col2);
    col2.append(btn2);
    container.append(row2);
    row2.append(col3);
    col3.append(ul);
    wrapper.append(container);

    wrapper.find("#up").on('click', function () {
        var $currentElement = $('#element-list .active');
        moveUp($currentElement);
    });

    wrapper.find("#down").on('click', function () {
        var $currentElement = $('#element-list .active');
        moveDown($currentElement);
    });

    var moveUp = function ($currentElement) {
        var hook = $currentElement.prev('.list-group-item');
        if (hook.length) {
            var elementToMove = $currentElement.detach();
            hook.before(elementToMove);
            var toBeMovedDown = $("#" + hook.attr('element'));
            var toBeMovedUp = $("#" + $currentElement.attr('element'));
            toBeMovedUp.detach().insertBefore(toBeMovedDown);
        }



    };

    var moveDown = function ($currentElement) {
        var hook = $currentElement.next('.list-group-item');
        if (hook.length) {
            var elementToMove = $currentElement.detach();
            hook.after(elementToMove);
            var toBeMovedUp = $("#" + hook.attr('element'));
            var toBeMovedDown = $("#" + $currentElement.attr('element'));
            toBeMovedDown.detach().insertAfter(toBeMovedUp);
        }
    };


    return wrapper;
}
function dom_div(_class, _id) {
    return $("<div class='" + _class + "' id='" + _id + "'></div>");
}
function dom_row(id) {
    return $("<div id='" + id + "' class='row'></div>");
}
function dom_col(id, size) {
    return $("<div id='" + id + "' class='col-sm-" + size + " mx-auto'></div>");
}
function dom_button(id, icon, text, color) {
    return ("<button type='button' id='" + id + "' class='btn btn-" + color + "'><i class='fa fa-lg fa-fw fa-" + icon + "' style='margin-right:5px;width:auto;max-width:200px'>" + text + "</i><span></span></button>");
}
function dom_list(id, items) {
    var ul = $("<ul class='list-group' id='" + id + "'></ul> ");

    if (typeof items !== "undefined") {
        items.forEach(function (index, obj) {
            ul.append("<li class='list-group-item' element='" + obj.id + "'>" + "<span>" + (index + 1) + "</span>" + ": " + obj.name + "</li>");
        });
    }

    return ul;
}
function dom_card(header, body) {
    var card = $("<div class='card'></div>");
    var cardHeader = $("<div class='card-header'></header");
    var cardBody = $("<div class='card-body'></div>");
    //var cardText = $("");
    card.append(cardHeader);
    card.append(cardBody);

    cardHeader.append(header);
    cardBody.append(body);

    return card;
}
function dom_nav(pills, _id) {
    var div = dom_div("", _id);
    var nav = $("<ul class='nav nav-pills mb-3' id='' role='tablist'>");
    $.each(pills, function (id, val) {
        //{'home': 'thuis', 'urgent': 'dringend'};
        nav.append("<li class='nav-item'><a class='nav-link' id='" + id + "-pill' data-toggle='pill' href='#" + id + "-tab' role='tab' aria-controls='" + id + "-tab' aria-selected='true'>" + val + "</a></li>");
    });

    var tab = $("<div class='tab-content' id='pills-tabContent'>");
    $.each(pills, function (id, val) {
        tab.append("<div class='tab-pane fade' id='" + id + "-tab' role='tabpanel' aria-labelledby='" + id + "-pill'>test " + id + "</div>");
    });

    div.append(nav);
    div.append(tab);

    return div;


}
function dom_mainPageContainer(containerID, mainPageContentDivId) {
    var container = dom_div("", containerID);
    var row1 = dom_row();
    row1.css('padding', '5px');
    var col1 = dom_col("", 1);
    var col2 = dom_col(mainPageContentDivId, 10);
    var col3 = dom_col("", 1);

    row1.append(col1);
    row1.append(col2);
    row1.append(col3);
    container.append(row1);

    return container;
}

function loadImages(editor, editorObject) {
    if (editor !== "") {
        var images = $("#" + editor).find('[fileid]');
        if (images.length < 1) {
            images = $("#cke_" + editor).find("iframe").contents().find('[fileid]');
        }
    } else {
        var images = editorObject.find('[fileid]');
    }

    images.each(function (index) {
        downloadToTemp($(this));
    });

    return images;

}

function openFile(filename, text) {
    var blob = new Blob([text], {type: "text/html;charset=utf-8"});
    saveAs(blob, filename);

    var x = window.open('http://localhost:8080/LCMS/index.html?p=temp', '_blank');
    x.document.write(text);
    x.document.close();
}