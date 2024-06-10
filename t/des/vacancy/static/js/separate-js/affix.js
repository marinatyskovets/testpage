var affix = (function ($) {
    var register = function (options) {
        var settings = $.extend({
            element: null
        }, options || {});

        if (!settings.element) {
            return;
        }

        var $element = $(settings.element);
        if (!$element.length) {
            return;
        }

        var process = function () {
            var $parent = $element.parent(),
                affixOffsetTop = $element.offset().top - 20,
                affixOffsetBottom = $(document).height() - ($parent.offset().top + $parent.outerHeight(true));

            $element.innerWidth($parent.width());

            $element.affix({
                offset: {
                    top: function () { return affixOffsetTop; },
                    bottom: function () { return affixOffsetBottom; }
                }
            });
        };

        process();
        $(window).resize(process);
    };

    return {
        register: register,
    };
})(jQuery);
