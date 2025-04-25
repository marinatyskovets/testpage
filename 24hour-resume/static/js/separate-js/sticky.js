var stickyElement = (function ($) {
    var elements = [],
        initialized = 0,
        lastPosition;

    var init = function () {
        if (initialized) return;
        initialized = 1;

        $(window).on('scroll', function () {
            var currentPosition = $(window).scrollTop(),
                direction = lastPosition && currentPosition < lastPosition ? 'up' : 'down';
            lastPosition = currentPosition;

            $.each(elements, function (_, item) {
                var $container = item.container,
                    $content = $container.children().first(),
                    offset = typeof item.offset === 'function' ? item.offset() : item.offset,
                    containerOffset = $container.offset().top,
                    contentHeight = $content.outerHeight(true),
                    windowHeight = $(window).outerHeight();

                $container.css('height', contentHeight);
                $content.css('width', $container.outerWidth(true));

                var stickyTop = currentPosition > containerOffset - offset,
                    stickyBottom = currentPosition + windowHeight < containerOffset + contentHeight + offset;

                if (item.type === 'top') {
                    $content.toggleClass(item.stickyClass, stickyTop).css('top', stickyTop ? offset : 'initial');
                } else if (item.type === 'bottom') {
                    $content.toggleClass(item.stickyClass, stickyBottom).css('bottom', stickyBottom ? offset : 'initial');
                }
                if (item.upClass) {
                    $content.toggleClass(item.upClass, direction === 'up');
                }
            });
        });

        $(window).on('resize', function () {
            $.each(elements, function (_, item) {
                item.container.children().first().css('width', item.container.outerWidth(true));
            });
        });
    };

    var register = function (options) {
        init();
        var settings = $.extend({
            container: null,
            type: null,
            offset: 0,
            stickyClass: null,
            upClass: null
        }, options);

        $(settings.container).not('.js-sticky-element-registered').each(function () {
            var $container = $(this).addClass('js-sticky-element-registered');
            elements.push({
                container: $container,
                type: settings.type,
                offset: settings.offset,
                stickyClass: settings.stickyClass,
                upClass: settings.upClass
            });
        });

        $(window).trigger('scroll');
    };

    return { register: register };
})(jQuery);


