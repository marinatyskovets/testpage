$(document).ready(function () {
    $('.js-form-focus').toggleFocusInput();

    toggle.initialize();

    drawer.initialize();

    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });
    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock();
    });

    // Example autocomplete
    var jobs = [
        {value: 'Программист', data: 'programmer'},
        {value: 'Продавец', data: 'prodavec'},
        {value: 'Дизайнер', data: 'designer'}
    ];

    $('#autocomplete').autocomplete({
        lookup: jobs,
        onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });

    $('.js-once-touch-field').on('focus', function () {
        $(this).parents('.js-once-touch-form').addClass('is-active');
    });

    $('.js-field-dropdown').on('focus', function () {
        $(this).parents('.js-field-dropdown-container').addClass('is-open');
    });

    $(document).on('click', function(e){
        var parentInput  = $('.js-field-dropdown-container');

        $(parentInput).each(function () {
            var $self = $(this);

            if(!$self.is(e.target) && $self.has(e.target).length === 0) {
                $self.removeClass('is-open');
            }
        });
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

var drawer = (function ($) {
    var settings = {
        drawer: '.js-drawer',
        toggler: '.js-drawer-toggler',
        stateClass: 'is-open',
    };

    var initialize = function () {
        var toggler = $(settings.toggler),
            drawer = $(settings.drawer),
            stateClass = settings.stateClass;

        toggler.on('click', function () {
            if (drawer.hasClass(stateClass)) {
                drawer.removeClass(stateClass);

                locker.unlock();
            } else {
                drawer.addClass(stateClass);

                locker.lock();
            }
        });
    };

    return {
        initialize: initialize,
    };
})(jQuery);


var locker = (function ($) {
    var settings = {
        element: 'html',
        lockedClass: 'no-scroll'
    };

    var lock = function () {
        var padding = window.innerWidth - document.documentElement.clientWidth;

        $(settings.element)
            .addClass(settings.lockedClass)
            .css('paddingRight', padding);
    };

    var unlock = function () {
        $(settings.element)
            .removeClass(settings.lockedClass)
            .css('paddingRight', 0);
    };

    return {
        lock: lock,
        unlock: unlock
    };
})(jQuery);


var scrollToTop = (function ($) {
    var defaults = {
        speed: 500,
        classList: 'gui-btn-up material-icons',
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});
        var height = $(window).height();

        var $button = $('<button/>', {
            type: 'button',
            class: settings.classList
        });

        $button.on('click', function () {
            $('body, html').animate({
                scrollTop: 0
            }, settings.speed);
        });

        var $appended = $button.appendTo('body').hide();

        $(window).scroll(function(){
            if ($(this).scrollTop() > height) {
                $appended.fadeIn();
            } else {
                $appended.fadeOut();
            }
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);


var floatingHeader = (function ($) {
    var defaults = {
        topCssClass: 'sticky-top',
        topExtendCssClass: 'sticky-top-extend'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        var $header = $('#' + settings.id);
        var $parent = $header.parent();
        var $headerTop = $header.find(':first-child');
        var $extender = $('[data-extend="floating-header"][data-target="#' + settings.id + '"]');

        $(window).on('scroll', function () {
            var fullHeight = 0;
            var headerTopHeight = $headerTop.outerHeight(true);

            $header.children().filter(':visible').each(function() {
                fullHeight += $(this).outerHeight(true);
            });

            $parent.css('height', fullHeight);

            if ($(window).scrollTop() > $parent.offset().top + headerTopHeight) {
                $header
                    .addClass(settings.topCssClass)
                    .removeClass(settings.topExtendCssClass)
                    .css({top: - headerTopHeight});
            } else {
                $header
                    .removeClass(settings.topCssClass)
                    .removeClass(settings.topExtendCssClass)
                    .css({top: 'initial'});
            }
        });

        $extender.on('click', function () {
            if ($header.hasClass(settings.topCssClass)) {
                $header
                    .addClass(settings.topExtendCssClass)
                    .css({top: 0});
            }
        });

        $(window).trigger('scroll');
    };

    return {
        initialize: initialize
    };
})(jQuery);
