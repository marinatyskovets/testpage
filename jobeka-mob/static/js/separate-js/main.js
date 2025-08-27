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

    $(document).on('show.bs.collapse', '.js-collapse-locker', function () {
        $(this).addClass('is-open');
        locker.lock();
    });
    $(document).on('hide.bs.collapse', '.js-collapse-locker', function () {
        $(this).removeClass('is-open');
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

    collapseContentHeight.initialize();

    if (document.getElementById('header')) {
        floatingHeader.initialize({id: 'header'});
    }

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


var collapseContentHeight = (function ($) {
    var defaults = {
        container: '.js-collapse-content-height',
        initializedCssClass: 'initialized',
        collapsedCssClass: 'collapsed'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(window).on('resize', function () {
            $(settings.container).each(function () {
                var $container = $(this);
                var totalHeight = 0;
                var maxHeight = $container.data('max-height');
                var $trigger = $('[data-toggle="collapse-content-height"]', $container);

                $container.children().filter(':visible').each(function () {
                    totalHeight += $(this).outerHeight(true);
                });

                if (totalHeight > maxHeight) {
                    $container.css('maxHeight', maxHeight).addClass(settings.collapsedCssClass);
                } else {
                    $container.removeClass(settings.collapsedCssClass);
                }

                $trigger.on('click', function () {
                    $container.toggleClass(settings.collapsedCssClass);
                });
            });
        });

        $(window).trigger('resize');
    };

    return {
        initialize: initialize
    };
})(jQuery);


var floatingHeader = (function ($) {
    var defaults = {
        topCssClass: 'sticky-top',
        floatingCssClass: 'floating'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});
        var previousScroll = 0;
        var $header = $('#' + settings.id);
        var $child = $header.find('>:first-child');

        $(window).on('scroll', function () {
            var currentScroll = $(this).scrollTop();
            var fullHeight = 0;

            $header.children().filter(':visible').each(function () {
                fullHeight += $(this).outerHeight(true);
            });

            $header.css('height', fullHeight);

            if ($(window).scrollTop() > $header.offset().top) {
                $child
                    .addClass(settings.topCssClass);

                if (currentScroll > previousScroll) {
                    $child.removeClass(settings.floatingCssClass);
                } else {
                    $child.addClass(settings.floatingCssClass);
                }
            } else {
                $child
                    .removeClass(settings.topCssClass)
                    .removeClass(settings.floatingCssClass);
            }

            previousScroll = currentScroll;
        });

        $(window).trigger('scroll');
    };

    return {
        initialize: initialize
    };
})(jQuery);


var bottomPanel = (function ($) {
    var defaults = {
        visibleCssClass: 'is-visible',
        timeOut: 1000,
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});
        var previousScroll = 0;
        var $panel = $('#' + settings.id);
        var timer;

        $(window).on('scroll', function () {
            var currentScroll = $(this).scrollTop();

            if (currentScroll > previousScroll) {
                $panel.removeClass(settings.visibleCssClass);
            } else {
                $panel.addClass(settings.visibleCssClass);
            }

            if (timer) clearTimeout(timer);

            timer = setTimeout(function () {
                $panel.addClass(settings.visibleCssClass);
            }, settings.timeOut);

            previousScroll = currentScroll;
        });

        $(window).trigger('scroll');
    };

    return {
        initialize: initialize
    };
})(jQuery);
