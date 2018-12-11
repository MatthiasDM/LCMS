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
    $('<div id="floating_alert" class="alert alert-' + alert + ' alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>' + message + '&nbsp;&nbsp;</div>').appendTo('body');
    setTimeout(function () {
        $(".alert").alert('close');
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
    var modal_dialog = $("<div class='modal-dialog' role='document'></div>");
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
    var form_check = $("<div class=\"form-check\"></div>");
    var checkbox = $("<input class=\"form-check-input\" type=\"checkbox\" name='" + name + "' id='" + id + "'>");
    var label = $("<label class=\"form-check-label\" for='" + title + "'>" + title + "<\/label>");
    form_check.append(checkbox);
    form_check.append(label);
    checkbox.val(val);
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

function dom_div(_class) {
    return $("<div class='" + _class + "'></div>");
}

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
            (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                    ),
            "gi"
            );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                    );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push(strMatchedValue);
    }

    // Return the parsed data.
    return(arrData);
}