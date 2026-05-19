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

var countDownTimer = (function () {
    var defaults = {
        timer: '.js-countdown',
        hours: 0,
        minutes: 10,
        seconds: 0,
        updateInterval: 1000
    };

    var timer = (hours, minutes, seconds) => {
        let timeStr = '';
        if (hours > 0) timeStr += `<span>${hours}</span><span>:</span>`;
        timeStr += `<span>${minutes}</span><span>:</span><span>${seconds}</span>`;
        return timeStr;
    };

    var initialize = function (params) {
        var now = new Date(),
            settings = $.extend({}, defaults, params || {}),
            element = $(settings.timer),
            // считаем общее количество миллисекунд
            totalMs = ((settings.hours * 60 * 60) + (settings.minutes * 60) + settings.seconds) * 1000,
            deadlineTime = new Date(now.getTime() + totalMs);

        var intervalId = setInterval(function () {
            let now = new Date().getTime();
            let time = deadlineTime - now;

            if (time <= 0) {
                clearInterval(intervalId);
                element.html(timer('00', '00', '00'));
                return;
            }

            let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((time % (1000 * 60)) / 1000);

            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            element.html(timer(hours, minutes, seconds));

        }, settings.updateInterval);
    };

    return {
        initialize: initialize
    };
})();

var slider = (function () {
    var defaults = {
        slider: '.js-slider',
        slide: '.js-slider-slide',
        dot: '.js-slider-dot',
        activeClass: 'is-active',
        delay: 3000
    };

    var setActiveSlide = function (slides, dots, index, activeClass) {
        slides.removeClass(activeClass);
        dots.removeClass(activeClass);

        slides.eq(index).addClass(activeClass);
        dots.eq(index).addClass(activeClass);
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            sliders = $(settings.slider);

        sliders.each(function () {
            var slider = $(this),
                slides = slider.find(settings.slide),
                dots = slider.find(settings.dot),
                activeIndex = Number(slider.data('initial')) || 0,
                delay = Number(slider.data('delay')) || settings.delay,
                intervalId = null;

            var startAutoplay = function () {
                stopAutoplay();

                intervalId = setInterval(function () {
                    activeIndex = (activeIndex + 1) % slides.length;
                    setActiveSlide(slides, dots, activeIndex, settings.activeClass);
                }, delay);
            };

            var stopAutoplay = function () {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };

            dots.on('click', function () {
                activeIndex = $(this).index();
                setActiveSlide(slides, dots, activeIndex, settings.activeClass);
                startAutoplay();
            });

            setActiveSlide(slides, dots, activeIndex, settings.activeClass);
            startAutoplay();
        });
    };

    return {
        initialize: initialize
    };
})();


var textClamp = (function () {
    var defaults = {
        container: '.js-text-clamp',
        content: '.js-text-clamp-content',
        btn: '.js-text-clamp-btn',
        expandedClass: 'is-expanded',
        hiddenClass: 'u-hidden',
        lines: 5
    };

    var truncate = function (textElement, btn, fullText, maxHeight) {
        textElement.innerHTML = '';
        var textNode = document.createTextNode('');
        textElement.appendChild(textNode);
        textElement.appendChild(btn);

        var lo = 0, hi = fullText.length;
        while (lo < hi - 1) {
            var mid = Math.floor((lo + hi) / 2);
            textNode.textContent = fullText.slice(0, mid) + '... ';
            if (textElement.scrollHeight <= maxHeight + 2) lo = mid;
            else hi = mid;
        }
        textNode.textContent = fullText.slice(0, lo) + '... ';
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        $(settings.container).each(function () {
            var container = $(this),
                textElement = container.find(settings.content)[0],
                btn = container.find(settings.btn)[0];

            if (!textElement || !btn) return;

            var fullText = textElement.textContent.trim(),
                lineHeight = parseFloat(getComputedStyle(textElement).lineHeight),
                maxHeight = lineHeight * settings.lines,
                expanded = false;

            if (textElement.scrollHeight <= maxHeight + 2) {
                $(btn).addClass(settings.hiddenClass);
                return;
            }

            truncate(textElement, btn, fullText, maxHeight);

            $(btn).on('click', function () {
                expanded = !expanded;
                container.toggleClass(settings.expandedClass, expanded);
                textElement.innerHTML = '';
                textElement.appendChild(document.createTextNode(expanded ? fullText + ' ' : ''));
                if (!expanded) truncate(textElement, btn, fullText, maxHeight);
                else textElement.appendChild(btn);
            });
        });
    };

    return {
        initialize: initialize
    };
})();

var stickyActivate = (function () {
    var defaults = {
        trigger: '.js-sticky-trigger',
        panel: '.js-sticky',
        hiddenClass: 'u-hidden'
    };

    var check = function (trigger, panel, hiddenClass) {
        var rect = trigger[0].getBoundingClientRect();
        panel.toggleClass(hiddenClass, rect.bottom > window.innerHeight);
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            trigger = $(settings.trigger),
            panel = $(settings.panel);

        if (!trigger.length || !panel.length) return;

        $(window).on('scroll', function () {
            check(trigger, panel, settings.hiddenClass);
        });

        check(trigger, panel, settings.hiddenClass);
    };

    return {
        initialize: initialize
    };
})();
