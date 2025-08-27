$(document).ready(function () {

    $(document).on('focus', '.js-head-search-toggler', function () {
        $(this).parents('.js-head-search').addClass('is-extended');
    });

    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });
    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock();
    });

    toggle.initialize();

    drawer.initialize();

    // Example autocomplete
    var jobs = [
        {value: 'Программист', data: 'programmer'},
        {value: 'Продавец', data: 'prodavec'},
        {value: 'Дизайнер', data: 'designer'}
    ];

    var fieldIds = ['#query', '#location'];

    for (var i= 0; i < fieldIds.length; i++) {

        var element = $(fieldIds[i]);

        element.autocomplete({
            lookup: jobs,
            width: 'flex',
            appendTo: element.parent(),
            onSelect: function (suggestion) {
                console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
            }
        });
    }

    $('.js-form-focus').toggleFocusInput();

    $('.js-once-touch-field').on('focus', function () {
        $(this).parents('.js-once-touch-form').addClass('is-touched');
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

    (function ($) {
        var $collapse = $('.js-toggle-collapse-parent');

        $collapse.on('show.bs.collapse', function () {
            $(this).parent().addClass('is-open');
        });
        $collapse.on('hide.bs.collapse', function () {
            $(this).parent().removeClass('is-open');
        });
    })(jQuery);

    // For dropdowns (Clicks inside do not close the dropdown)
    $(document).on(
        'click.bs.dropdown.data-api',
        '.js-keep-inside-clicks-open',
        function (e) {
            e.stopPropagation();
        }
    );

    $('.js-scroll-tab-into-view').on('shown.bs.tab', function () {
        var element = $($(this).data('target'))[0];
        element.scrollIntoView({behavior: "smooth"});
    });

    $('.js-tab-has-tooltip').on('shown.bs.tab', function () {
        var element = $($(this).data('target'))[0];
        var id = $(element).attr('id');
        var tab = $("[data-target='#" + id + "']").parent();
        tab.find('.js-tab-tooltip').addClass('u-hidden');
    });

    $('.js-toggle-btn').on('click', function () {
        var container = $('.js-toggle-container');

        if (container.hasClass('is-open')) {
            container.removeClass('is-open');
        } else {
            container.addClass('is-open');
        }
    });

    $('.js-input-show-modal').on('change', function() {
        if ($(this).is(':not(:checked')) {
            $($(this).attr('data-target')).modal('show');
        }
    });

    $('.js-change-input-group').on('change', function() {
        var container = $(this).parents('.js-input-group');
        var inputs = container.find('input[type=checkbox]');
        inputs.prop('checked', $(this).prop('checked'));

        if (container.find('input[type=checkbox]:checked.js-change-input').length === 0) {
            container.find('.js-change-input').prop({
                disabled: true
            });
        } else {
            container.find('.js-change-input').prop({
                disabled: false
            });
        }
    });

    $('.js-change-input').on('change', function() {
        var checked = $(this).prop('checked');
        var container = $(this).parents('.js-input-group');

        if ($(this).is(':checked')) {
            container.find('.js-change-input-group').prop({
                indeterminate: true,
                checked: container.find('.js-change-input-group').prop('checked', false)
            });
        } else {
            if (container.find('input[type=checkbox]:checked.js-change-input').length === 0) {
                container.find('input[type=checkbox]').prop({
                    indeterminate: false,
                    checked: checked
                });
                container.find('.js-change-input').prop({
                    disabled: true
                });
            }
        }
    });

    $('.js-carousel').owlCarousel({
        margin: 30,
        nav:true,
        loop: false,
        autoWidth: true,
        items: 1,
        dots: false,
        mouseDrag: false,
    });

    $('.js-click-anchor').on('click', function() {
        var input = $($(this).data('anchor'));

        if (input.length > 0) {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            input.focus();
        }
    });
});

var fixSection = (function ($) {
    var defaults = {
        fixedSelector: '.js-fix-section',
        placeholderBlockSelector: '.js-height-placeholder',
        fixedClass: 'is-top-fixed',
        scrolledClass: 'is-scrolled',
        endingScrollClass: 'is-ending-scroll'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            offsetTop = $(settings.fixedSelector).offset().top,
            placeholderBlock = $(settings.fixedSelector).find(settings.placeholderBlockSelector),
            scrolled = false;

        $(window).on('scroll', function () {
            var scrollTop = $(window).scrollTop();
            var height = $(settings.fixedSelector).height() + offsetTop;

            if (offsetTop < scrollTop) {
                $(settings.fixedSelector).addClass(settings.fixedClass);
            } else {
                $(settings.fixedSelector).removeClass(settings.fixedClass);
            }

            if (scrollTop > height) {
                $(settings.fixedSelector)
                    .addClass(settings.scrolledClass)
                    .removeClass(settings.endingScrollClass);

                placeholderBlock.css('minHeight', placeholderBlock.children().outerHeight());

                scrolled = true;
            } else {
                $(settings.fixedSelector).removeClass(settings.scrolledClass);

                if ((height - scrollTop) <= 50) {
                    if (scrolled) $(settings.fixedSelector).addClass(settings.endingScrollClass);
                } else {
                    $(settings.fixedSelector).removeClass(settings.endingScrollClass);

                    placeholderBlock.css('minHeight', '');
                }

                scrolled = false;
            }
        }).trigger('scroll');
    };

    return {
        initialize: initialize
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

        $(window).scroll(function () {
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
