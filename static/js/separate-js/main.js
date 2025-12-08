$(document).ready(function () {
    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });

    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock()
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
        element: '.js-drawer-element',
        elementShowClass: 'is-show'
    };

    var initialize = function () {
        var toggler = $(settings.toggler),
            drawer = $(settings.drawer),
            element = $(settings.element),
            stateClass = settings.stateClass,
            elementShowClass = settings.elementShowClass;

        toggler.on('click', function () {

            if (drawer.hasClass(stateClass)) {
                drawer.removeClass(stateClass);

                element.parent().removeClass(elementShowClass);

                locker.unlock();
            } else {
                drawer.addClass(stateClass);
                locker.lock();
            }
        });

        element.on('click', function () {
            $(this).parent().toggleClass(elementShowClass);
        });
    };

    return {
        initialize: initialize,
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

var youtubePlayer = (function ($) {
    var defaults = {
        node: 'span',
        playerSelector: '.js-player',
        modalSelector: '.js-player-container',
        width: null,
        height: null
    };

    function initialize(params) {
        var settings = $.extend({}, defaults, params || {});

        function initPlayer(wrap, isModal) {
            if (wrap.player) return;

            wrap.player = new YT.Player(wrap.querySelector(settings.node), {
                videoId: wrap.dataset.video,
                width: settings.width,
                height: settings.height,
                playerVars: {
                    playsinline: 1,
                    autoplay: isModal ? 1 : 0,
                    mute: 1
                },
                events: {
                    onReady: function(e) {
                        e.target.unMute();
                    }
                }
            });
        }

        document.querySelectorAll(settings.playerSelector + ':not(' + settings.modalSelector + ' ' + settings.playerSelector + ')')
            .forEach(wrap => initPlayer(wrap, false));

        $(document).on('shown.bs.modal', settings.modalSelector, function () {
            this.querySelectorAll(settings.playerSelector).forEach(wrap =>
                initPlayer(wrap, true)
            );
        }).on('hidden.bs.modal', settings.modalSelector, function () {
            this.querySelectorAll(settings.playerSelector).forEach(wrap =>
                wrap.player?.stopVideo()
            );
        });
    }

    return {
        initialize: initialize
    };
})(jQuery);



