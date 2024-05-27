$(document).ready(function () {
    // Example autocomplete
    var jobs = [
        {value: 'Программист', data: 'programmer'},
        {value: 'Продавец', data: 'prodavec'},
        {value: 'Дизайнер', data: 'designer'}
    ];

    var fieldIds = ['#autocomplete'];

    for (var i= 0; i < fieldIds.length; i++) {

        var element = $(fieldIds[i]);

        element.autocomplete({
            lookup: jobs,
            width: 'flex',
            appendTo: element.parent(),
            onSelect: function (suggestion) {
                console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
            }
        });
    }
});

var toggleFixedOnScroll = (function ($) {
    var defaults = {
        containerSelector: '.js-fix-container',
        fixedClass: 'is-fixed',
        hiddenClass: 'u-hidden'
    };

    var isContainerVisible = function($container, className) {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var containerTop = $container.offset().top;
        var containerBottom = containerTop + $container.outerHeight();

        return $container.hasClass(className) || ((containerBottom > scrollTop) && (containerTop < scrollTop + windowHeight));
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});
        var $container = $(settings.containerSelector);

        if (!$container.length) return;

        if (!isContainerVisible($container, settings.hiddenClass)) {
            $container.addClass(settings.fixedClass);
        }

        $(window).on('scroll', function () {
            if (isContainerVisible($container, settings.hiddenClass)) {
                $container.removeClass(settings.fixedClass);
            } else {
                $container.addClass(settings.fixedClass);
            }
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);


