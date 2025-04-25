$(document).ready(function () {
    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });

    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock();
    });
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

var carouselManager = (function ($) {
    var settings = {
        carouselSelector: '.js-carousel',
        groupSelector: '.js-carousel-group',
        animatedClass: 'is-animated'
    };

    var initialize = function () {
        var carouselContainer = $(settings.carouselSelector);
        var carouselGroup = carouselContainer.find(settings.groupSelector);

        carouselGroup.removeClass(settings.animatedClass);

        var clonedGroup = carouselGroup.clone().removeClass(settings.animatedClass).removeClass('js-carousel-group').addClass('is-clone');

        carouselContainer.append(clonedGroup);

        setTimeout(function() {
            carouselGroup.addClass(settings.animatedClass);
            clonedGroup.addClass(settings.animatedClass);
        }, 50);
    };

    return {
        initialize: initialize
    };
})(jQuery);

var classToggleOnScroll = (function ($) {
    var defaults = {
        selector: '.js-toggle-class',
        beforeClass: '',
        afterClass: '',
        scrollThreshold: 500
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params);
        var $element = $(settings.selector);

        var update = function () {
            var scrolledPast = $(window).scrollTop() >= settings.scrollThreshold;

            if (settings.beforeClass) {
                $element.toggleClass(settings.beforeClass, !scrolledPast);
            }

            if (settings.afterClass) {
                $element.toggleClass(settings.afterClass, scrolledPast);
            }
        };

        $(function () {
            update();
            $(window).on('scroll', update);
        });
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
        interval: 500,
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



