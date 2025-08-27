var countInput = (function ($) {
    var _checkDisabledDecButton = function (decButton, value) {
        if (value < 1) {
            decButton.prop("disabled", true);
        } else {
            decButton.prop("disabled", false);
        }
    };

    var _checkDisabledIncButton = function (incButton, value, maxCount) {
        if (maxCount != null) {
            if (value >= maxCount) {
                incButton.prop("disabled", true);
            } else {
                incButton.prop("disabled", false);
            }
        }
    };

    var register = function (options) {
        var settings = $.extend({
            element: '.js-count-input',
            maxCount: null,
        }, options || {});

        if (!settings.element) {
            return;
        }

        var $element = $(settings.element);
        if (!$element.length) {
            return;
        }

        $element.each(function () {
            var $container = $(this),
                decButton = $('.js-dec', $container),
                incButton = $('.js-inc', $container),
                input = $('.js-input', $container),
                value = Number(input.val());

            _checkDisabledDecButton(decButton, value);

            _checkDisabledIncButton(incButton, value, settings.maxCount);

            decButton.on('click', function () {
                incButton.prop("disabled", false);

                value = value - 1;

                input.val(value);

                _checkDisabledDecButton(decButton, value);
            });

            incButton.on('click', function () {
                decButton.prop("disabled", false);

                value = value + 1;

                input.val(value);

                _checkDisabledIncButton(incButton, value, settings.maxCount);
            });

            input.on('change', function (e) {
                value = Number(e.target.value);

                if (settings.maxCount != null) {
                    if (value >= settings.maxCount) {
                        value = settings.maxCount;
                    }
                }

                input.val(value);

                _checkDisabledDecButton(decButton, value);

                _checkDisabledIncButton(incButton, value, settings.maxCount);
            });

            input.on('input', function () {
                this.value = this.value.replace(/\D/g,'');
            });
        });
    };

    return {
        register: register,
    };
})(jQuery);
