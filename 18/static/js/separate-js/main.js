$(document).ready(function () {
    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });

    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock();
    });

    drawer.initialize();
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


var slider = (function ($) {
    var defaults = {
        slider: '.js-slider',
        track: '.js-slider-track',
        prev: '.js-slider-prev',
        next: '.js-slider-next',
        hiddenClass: 'is-hidden'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(settings.slider).each(function () {
            var slider = $(this),
                track = slider.find(settings.track),
                prev = slider.find(settings.prev),
                next = slider.find(settings.next),
                lastIndex = track.children().length - 1,
                index = 0;

            // Each slide is 100% of the track width, so the offset is the index in whole slides
            var update = function () {
                track.css('transform', 'translateX(-' + index * 100 + '%)');
                prev.toggleClass(settings.hiddenClass, index === 0);
                next.toggleClass(settings.hiddenClass, index >= lastIndex);
            };

            prev.on('click', function () {
                index = Math.max(index - 1, 0);
                update();
            });

            next.on('click', function () {
                index = Math.min(index + 1, lastIndex);
                update();
            });

            update();
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);

var contentAnimated = (function ($) {
    var defaults = {
        root: '.js-content-animated',
        container: '.js-content-animated-container',
        items: [],
        interval: 3000
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(settings.root).each(function () {
            var root = $(this),
                items = settings.items,
                index = 0;

            if (items.length < 2) {
                return;
            }

            setInterval(function () {
                var container = root.find(settings.container);

                index = (index + 1) % items.length;

                container.replaceWith(container.clone().html(items[index]));
            }, settings.interval);
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);

var stickyPanel = (function ($) {
    var defaults = {
        panel: '.js-sticky-panel'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            panels = $(settings.panel);

        if (panels.length < 2) {
            return;
        }

        var update = function () {
            var offset = 0;

            panels.each(function () {
                $(this).css('top', offset);
                offset += this.offsetHeight;
            });
        };

        var observer = new ResizeObserver(update);

        panels.each(function () {
            observer.observe(this);
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);

var revealAfter = (function ($) {
    var defaults = {
        element: '.js-reveal-after',
        trigger: '.js-reveal-after-trigger',
        hiddenClass: 'u-hidden'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            element = $(settings.element),
            trigger = document.querySelector(settings.trigger);

        if (!element.length || !trigger) {
            return;
        }

        // Елемент показується лише коли тригер повністю вище viewport,
        // а не коли він ще нижче (на початку сторінки).
        var observer = new IntersectionObserver(function (entries) {
            var entry = entries[0];

            element.toggleClass(settings.hiddenClass, entry.isIntersecting || entry.boundingClientRect.top > 0);
        });

        observer.observe(trigger);
    };

    return {
        initialize: initialize
    };
})(jQuery);

var countdown = (function ($) {
    var defaults = {
        countdown: '.js-countdown'
    };

    var pad = function (value) {
        return (value < 10 ? '0' : '') + value;
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(settings.countdown).each(function () {
            var countdown = $(this),
                parts = countdown.text().split(':'),
                seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

            if (!(seconds > 0)) {
                return;
            }

            var timer = setInterval(function () {
                seconds -= 1;
                countdown.text(pad(Math.floor(seconds / 60)) + ':' + pad(seconds % 60));

                if (seconds === 0) {
                    clearInterval(timer);
                }
            }, 1000);
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);
