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

