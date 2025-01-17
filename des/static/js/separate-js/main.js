$(document).ready(function () {
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

    var fieldIds = ['#autocomplete'];

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
});

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

var dropdownManager = (function ($) {
    var defaults = {
        container: '.js-dropdown-container',
        opener: '.js-dropdown-container-open',
        closer: '.js-dropdown-container-close',
        dropdownParent: '.js-dropdown',
        dropdownToggle: '[data-bs-toggle="dropdown"]',
        stateClass: 'is-open'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            container = $(settings.container),
            stateClass = settings.stateClass;

        $(settings.opener).on('click', function (event) {
            event.stopPropagation();

            if (!container.hasClass(stateClass)) {
                container.addClass(stateClass);
            }
        });

        $(settings.closer).on('click', function (event) {
            event.stopPropagation();

            if (container.hasClass(stateClass)) {
                container.removeClass(stateClass);

                var dropdownToggle = $(settings.opener).closest(settings.dropdownParent).find(settings.dropdownToggle);

                if (dropdownToggle.length > 0 && dropdownToggle.attr('aria-expanded') === 'true') {
                    dropdownToggle
                        .removeClass('show')
                        .attr('aria-expanded', 'false')
                        .next().removeClass('show');
                }
            }
        });

        $(document).on('click', function (event) {
            if (container.hasClass(stateClass) && !container.is(event.target) && container.has(event.target).length === 0) {
                container.removeClass(stateClass);
            }
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);


var tooltipVisibilityManager = (function ($) {
    var defaults = {
        container: '.js-tooltip',
        opener: '.js-tooltip-toggle',
        closer: '.js-tooltip-close',
        stateClass: 'is-open'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            container = $(settings.container),
            stateClass = settings.stateClass;

        $(settings.opener).on('click', function (e) {
            e.stopPropagation();
            $(e.currentTarget).closest(settings.container).toggleClass(stateClass);
        });

        $(settings.closer).on('click', function (e) {
            e.stopPropagation();

            var tooltip = $(this).closest(settings.container);

            if (tooltip.hasClass(stateClass)) {
                tooltip.removeClass(stateClass);
            }
        });

        $(document).on('click', function (e) {
            var target = $(e.target);

            if (container.hasClass(stateClass) && !container.is(target) && container.has(target).length === 0) {
                container.removeClass(stateClass);
            }
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);


var toggleFixedOnScroll = (function ($) {
    var defaults = {
        fixedElement: '.js-fix-element',
        fixedTopClass: 'is-fixed-top',
        fixedBottomClass: 'is-fixed-bottom',
        container: '.js-fix-container',
        header: 'header',
        offsetTop: 0,
        offsetBottomContainer: 0
    };

    var initialize = function(params) {
        var settings = $.extend({}, defaults, params || {}),
            $fixedElement = $(settings.fixedElement),
            fixedElementHeight = $fixedElement.outerHeight(),
            $container = $(settings.container),
            prevScrollTop = 0;

        $(window).on('scroll', function() {
            var scrollTop = $(window).scrollTop();
            var containerTop = $container.offset().top;
            var containerBottom = containerTop + $container.outerHeight() - settings.offsetBottomContainer;
            var positionTop = scrollTop < prevScrollTop ? settings.offsetTop : settings.offsetTop;

            if (scrollTop <= containerTop) {
                $fixedElement
                    .removeClass(settings.fixedTopClass)
                    .css({top: ''});
            } else {
                var isFixedTop = scrollTop + fixedElementHeight + settings.offsetBottomContainer < containerBottom;

                $fixedElement
                    .removeClass(isFixedTop ? settings.fixedBottomClass : settings.fixedTopClass)
                    .addClass(isFixedTop ? settings.fixedTopClass : settings.fixedBottomClass)
                    .css({top: isFixedTop ? positionTop : containerBottom - fixedElementHeight});
            }

            prevScrollTop = scrollTop;
        }).trigger('scroll');
    };

    return {
        initialize: initialize
    };
})(jQuery);


var scrollSpy = (function ($) {
    var defaults = {
        navContainer: '.js-nav-container',
        activeClass: 'active',
        scrollDuration: 1600,
        offset: 10
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            $navContainer = $(settings.navContainer),
            $navItems = $navContainer.find('a'),
            sections = $navItems.map(function() {return $(this).attr('href').replace('#', '');}).get();

        $(window).on('scroll', function () {
            var scrollPosition = $(window).scrollTop();

            sections.forEach(function (id) {
                var $section = $('#' + id);
                if ($section.length) {
                    var offset = $section.offset().top - settings.offset,
                        height = $section.outerHeight(true);

                    if (scrollPosition >= offset && scrollPosition < offset + height) {
                        $navItems.removeClass(settings.activeClass);
                        $navContainer.find('[href="#' + id + '"]').addClass(settings.activeClass);
                    }
                }
            });
        });

        $(window).trigger('scroll');
    };

    return {
        initialize: initialize
    };

})(jQuery);

var updateCounter = (function () {
    var defaults = {
        container: '.js-counter',
        min: 0,
        max: 1000000,
        interval: 3000,
        step: 2
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});
        var container = $(settings.container);
        var counter = container.children().first();
        var currentValue = parseFloat(counter.text()) || settings.min;

        setInterval(function () {
            var change = (Math.random() < 0.9 ? 1 : -1) * Math.random() * (Math.random() < 0.9 ? settings.step : 2);

            currentValue += change;
            currentValue = Math.max(settings.min, Math.min(settings.max, currentValue));
            counter.text(currentValue.toFixed(0));
        }, settings.interval);
    };

    return {
        initialize: initialize
    };
})();


var lazyLoader = (function () {
    var defaults = {
        rootMargin: '300px 0px',
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            var script = document.createElement('script');
            script.src = '/static/js/separate-js/lozad.min.js';
            script.onload = () => lozad('.lozad', {rootMargin: settings.rootMargin}).observe();

            document.body.appendChild(script);
        }
    };

    return {
        initialize: initialize
    };
})();


var countDownTimer = (function () {
    var defaults = {
        timer: '.js-countdown',
        deadline: 'Jan 17, 2025 18:00:00',
        updateInterval: 1000
    };

    var timer = function (hours, minutes, seconds) {
        if (hours === '00') {
            return `<span>${minutes}</span><span>:</span><span>${seconds}</span>`;
        }
        return `<span>${hours}</span><span>:</span><span>${minutes}</span><span>:</span><span>${seconds}</span>`;
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            element = $(settings.timer),
            elementDataDeadline = settings.deadline,
            deadlineTime = new Date(elementDataDeadline).getTime();

        var intervalId = setInterval(function () {
            let now = new Date().getTime();
            let t = deadlineTime - now;

            let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (hours.toString().length < 2) hours = '0' + hours;
            let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes.toString().length < 2) minutes = '0' + minutes;
            let seconds = Math.floor((t % (1000 * 60)) / 1000);
            if (seconds.toString().length < 2) seconds = '0' + seconds;

            element.html(timer(hours, minutes, seconds));

            if (t < 0) {
                clearInterval(x);

                element.html(timer('00', '00', '00'));
            }
        }, settings.updateInterval);
    };

    return {
        initialize: initialize
    };
})();


