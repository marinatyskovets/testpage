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
        hiddenClass: 'is-hidden',
        // Autoplay interval in ms; 0 turns autoplay off
        autoplay: 0
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(settings.slider).each(function () {
            var slider = $(this),
                track = slider.find(settings.track),
                prev = slider.find(settings.prev),
                next = slider.find(settings.next),
                slides = track.children(),
                step = 0,
                lastIndex = 0,
                index = 0,
                timer = null;

            if (!slides.length) {
                return;
            }

            // Several slides can be in view (desktop), so the step and the last index
            // depend on the current layout and are measured again on resize
            var measure = function () {
                step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth;

                var visible = Math.max(Math.round(track.parent().width() / step), 1);

                lastIndex = Math.max(slides.length - visible, 0);
                index = Math.min(index, lastIndex);
            };

            var update = function () {
                track.css('transform', 'translateX(-' + index * step + 'px)');
                prev.toggleClass(settings.hiddenClass, index === 0);
                next.toggleClass(settings.hiddenClass, index >= lastIndex);
            };

            var stop = function () {
                clearInterval(timer);
                timer = null;
            };

            // After the last slide autoplay starts over from the first one
            var play = function () {
                if (!settings.autoplay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }

                stop();
                timer = setInterval(function () {
                    index = index >= lastIndex ? 0 : index + 1;
                    update();
                }, settings.autoplay);
            };

            // Manual navigation restarts the countdown, so the slide does not change right after a click
            prev.on('click', function () {
                index = Math.max(index - 1, 0);
                update();
                play();
            });

            next.on('click', function () {
                index = Math.min(index + 1, lastIndex);
                update();
                play();
            });

            // Paused while the user reads a slide or uses the buttons from the keyboard
            slider
                .on('mouseenter focusin', stop)
                .on('mouseleave focusout', play);

            $(window).on('resize', function () {
                measure();
                update();
            });

            measure();
            update();
            play();
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

        // rootMargin стискає зону спостереження до лінії по нижньому краю viewport.
        // Елемент показується, коли кінець тригера піднявся над цією лінією (блок дочитано),
        // і прихований, поки тригер перетинає лінію або ще нижче неї (на початку сторінки).
        var observer = new IntersectionObserver(function (entries) {
            var entry = entries[0];

            element.toggleClass(settings.hiddenClass, entry.isIntersecting || entry.boundingClientRect.top > entry.rootBounds.top);
        }, {
            rootMargin: '-100% 0px 0px 0px'
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
