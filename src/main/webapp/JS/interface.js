$(function () {
    // sessionCountdown();



    $.fn.modal.Constructor.prototype._enforceFocus = function () {
        modal_this = this
        $(document).on('focusin.modal', function (e) {
            if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
                    // add whatever conditions you need here:
                    &&
                    !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                modal_this.$element.focus()
            }
        })
    };


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
    var domData = $.parseHTML(source)
    $(domData).find("."+classname).remove();
    return $(domData).prop('outerHTML');
}