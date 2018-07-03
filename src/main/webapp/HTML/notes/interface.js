/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(function () {

    $('#toc').BootSideMenu({
        // 'left' or 'right'
        side: "left",
        // animation speed
        duration: 500,
        // restore last menu status on page refresh
        remember: true,
        // auto close
        autoClose: false,
        // push the whole page
        pushBody: true,
        
        autoClose: false,
        // close on click
        closeOnClick: true,
        // width
        width: "15%",
        // icons
        icons: {
            left: 'fa fa-angle-left fa-2x',
            right: 'fa fa-angle-right fa-2x',
            down: 'fa fa-angle-down fa-2x'
        },
        // 'dracula', 'darkblue', 'zenburn', 'pinklady', 'somebook'
        theme: '',
    });

    $('#notes-list').BootSideMenu({

        // 'left' or 'right'
        side: "right",

        // animation speed
        duration: 500,

        // restore last menu status on page refresh
        remember: true,

        // auto close
        autoClose: true,

        // push the whole page
        pushBody: true,

        // close on click
        closeOnClick: true,

        // width
        width: "25%",

        // icons
        icons: {
            left: 'fa fa-angle-left fa-2x',
            right: 'fa fa-angle-right fa-2x',
            down: 'fa fa-angle-down fa-2x'
        },

        // 'dracula', 'darkblue', 'zenburn', 'pinklady', 'somebook'
        theme: '',

    });

    notes_doLoad($("#note-container"));
    config0();
    $('#btn-open-notes').on('click', function () {
        if ($(this).hasClass('selected')) {
            deselect($(this));
        } else {
            $(this).addClass('selected');

            $('.pop').slideFadeToggle();
        }
        return false;
    });

    $('.close').on('click', function () {
        deselect($('#contact'));
        return false;
    });

    $(document).mouseup(function (e)
    {
        var container = $("#div-grid-wrapper");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
            container.hide();
        }
    });

});

function deselect(e) {
    $('.pop').slideFadeToggle(function () {
        e.removeClass('selected');
    });
}

$.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, 'fast', easing, callback);
};




