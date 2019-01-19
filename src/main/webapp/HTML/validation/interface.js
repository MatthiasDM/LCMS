/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(function () {

    $('#validations-list').BootSideMenu({

        // 'left' or 'right'
        side: "right",


    });
    $('#validations-list').BootSideMenu.open();

    $('#toc').BootSideMenu({
        // 'left' or 'right'
        side: "left",

    });




    validations_doLoad($("#validations-container"));
    config0();
    


    $('#btn-open-validations').on('click', function () {
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




