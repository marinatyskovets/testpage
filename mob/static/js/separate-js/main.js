$(document).ready(function () {

    toggle.initialize();

    // Example autocomplete
    var jobs = [
        {value: 'Программист', data: 'programmer'},
        {value: 'Продавец', data: 'prodavec'},
        {value: 'Дизайнер', data: 'designer'}
    ];

    $('.js-form-focus').toggleFocusInput();

    $('#autocomplete').autocomplete({
        lookup: jobs,
        onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });

    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        blockScroll.block();
    });
    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        blockScroll.unblock();
    });

    // For dropdowns (Clicks inside do not close the dropdown)
    $(document).on(
        'click.bs.dropdown.data-api',
        '.js-keep-inside-clicks-open',
        function (e) {
            e.stopPropagation();
        }
    );

    $('.js-toggle-btn').on('click', function () {
        var container = $('.js-toggle-container');

        if (container.hasClass('is-open')) {
            container.removeClass('is-open');
        } else {
            container.addClass('is-open');
        }
    });
});

var blockScroll = (function ($) {
    var noScrollClass = 'no-scroll',
        isBlocked = false;

    var block = function () {
        if (isBlocked) {
            return;
        }

        isBlocked = true;
        // if (yii.version.isDesktop) {
        //     $('body').css('paddingRight', window.innerWidth - document.documentElement.clientWidth);
        // }
        $('html').addClass(noScrollClass);
    };

    var unblock = function () {
        $('html').removeClass(noScrollClass);
        // if (yii.version.isDesktop) {
        //     $('body').css('paddingRight', 0);
        // }
        isBlocked = false;
    };

    return {
        block: block,
        unblock: unblock
    };
})(jQuery);

var toggle = (function ($) {
    var defaults = {
        itemSelector: '[data-toggle-item]',
        handlerSelector: '[data-toggle="item"]',
        hiddenClass: 'u-hidden',
        stateHandler: 'is-hidden'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(document).on('click', settings.handlerSelector, function () {
            var dataTarget = $(this).data('target'),
                handler = $(settings.handlerSelector + '[data-target="' + dataTarget + '"]'),
                toggleItem = $('[data-toggle-item="' + dataTarget + '"]');

            // Item is toggled
            toggleItem.toggleClass(settings.hiddenClass);

            // Handler is toggled
            handler.toggleClass(settings.stateHandler);

            return false;
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);
