$(document).ready(function () {
    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });

    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock()
        mediaController.initialize($(this));
    });

    drawer.initialize();

    $('.js-toggle').on('click', function () {
        $(this).parent().toggleClass('is-show');
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

var mediaController = (function ($) {
    var settings = {
        selector: '.js-media-element'
    };

    var initialize = function ($container) {
        var $parent = $container.find(settings.selector);

        $parent.each(function () {
            var $iframe = $(this).find('iframe');

            if (!$iframe.length) return;

            var src = $iframe.attr('src');

            if (!src) return;

            $iframe.attr('src', '');
            $iframe.attr('src', src);
        });
    };

    return {
        initialize: initialize
    };

})(jQuery);
