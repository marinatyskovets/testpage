(function ($) {
    var defaults = {
        parentInput: '.js-form-focus',
        common: '.js-field-focus',
        input: 'input.js-field-focus',
        select: 'select.js-field-focus',
        textarea: 'textarea.js-field-focus',
        classFocus: 'is-focus'
    };

    var methods = {
        init: function (options) {
            var settings = $.extend({}, defaults, options || {}),
                $common = $(this).find(settings.common),
                $input = $(this).find(settings.input),
                $select = $(this).find(settings.select),
                $textarea = $(this).find(settings.textarea);

            $input.on('focus', function () {
                $(this).parents(settings.parentInput).addClass(settings.classFocus);
            });

            $input.on('blur', function () {
                $this = $(this);

                if (!$this.val()) {
                    $this.parents(settings.parentInput).removeClass(settings.classFocus);
                }
            });

            $select.on('change', function () {
                $this = $(this);

                if (!$this.val()) {
                    $this.parents(settings.parentInput).removeClass(settings.classFocus);
                } else {
                    $this.parents(settings.parentInput).addClass(settings.classFocus);
                }
            });

            $textarea.on('focus', function () {
                $(this).parents(settings.parentInput).addClass(settings.classFocus);
            });

            $textarea.on('blur', function () {
                var $this = $(this);

                if (!$this.val()) {
                    $this.parents(settings.parentInput).removeClass(settings.classFocus);
                }
            });

            $common.each(function () {
                var $this = $(this);

                if ($this.val()) {
                    $this.parents(settings.parentInput).addClass(settings.classFocus);
                }
            });
        },
        // other methods
    };

    $.fn.toggleFocusInput = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.toggleFocusInput');
        }
    };

})(jQuery);


