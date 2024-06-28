var stickyElement = (function ($) {
    var elements = [],
        initialized = 0,
        lastPosition;

    var init = function () {
        if (initialized) {
            return;
        }
        initialized = 1;

        $(window).on('scroll', function () {
            var currentPosition = $(window).scrollTop(),
                direction = (lastPosition && currentPosition < lastPosition) ? 'up' : 'down';

            lastPosition = currentPosition;

            $.each(elements, function (idx, item) {
                var $container = item.container,
                    type = item.type,
                    stickyClass = item.stickyClass,
                    upClass = item.upClass,
                    offset = item.offset,
                    $content = $container.children().first();

                // вычисляем и устанавливаем высоту контейнера
                var height = $content.outerHeight(true);

                $container.css('height', height);
                $content.css('width', $container.outerWidth(true));

                // резолвим смещение, если оно в виде функции
                if (offset && {}.toString.call(offset) === '[object Function]') {
                    offset = offset();
                }

                if (type === 'top') {
                    if (currentPosition > $container.offset().top - offset) {
                        $container.addClass(stickyClass).css({top: offset});
                    } else {
                        $container.removeClass(stickyClass).css({top: 'initial'});
                    }
                } else if (type === 'bottom') {
                    if (currentPosition + $(window).outerHeight() < $container.offset().top + height + offset) {
                        $container.addClass(stickyClass).css({bottom: offset});
                    } else {
                        $container.removeClass(stickyClass).css({bottom: 'initial'});
                    }
                }

                if (upClass) {
                    if (direction === 'down') {
                        $container.removeClass(upClass);
                    } else {
                        $container.addClass(upClass)
                    }
                }
            });
        });

        $(window).on('resize', function () {
            $.each(elements, function (idx, item) {
                var $container = item.container,
                    $content = $container.children().first();

                $content.css('width', $container.outerWidth(true));
            });

            $(window).trigger('scroll');
        });
    };

    var registered = 'js-sticky-element-registered';
    var register = function (options) {
        init();

        var settings = $.extend({
            container: null,
            type: null,
            offset: null,
            stickyClass: null,
            upClass: null
        }, options || {});

        $(settings.container).each(function () {
            var $container = $(this);

            if ($container.hasClass(registered)) {
                return;
            }
            $container.addClass(registered);

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

    return {
        register: register
    };
})(jQuery);
