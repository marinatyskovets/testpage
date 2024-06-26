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


var dropdownManager = (function ($) {
    var defaults = {
        container: '.js-dropdown-container',
        opener: '.js-dropdown-container-open',
        closer: '.js-dropdown-container-close',
        dropdownParent: '.js-dropdown',
        dropdownToggle: '[data-bs-toggle="dropdown"]',
        stateClass: 'is-open'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            container = $(settings.container),
            stateClass = settings.stateClass;

        $(settings.opener).on('click', function (event) {
            event.stopPropagation();

            if (!container.hasClass(stateClass)) {
                container.addClass(stateClass);
            }
        });

        $(settings.closer).on('click', function (event) {
            event.stopPropagation();

            if (container.hasClass(stateClass)) {
                container.removeClass(stateClass);

                var dropdownToggle = $(settings.opener).closest(settings.dropdownParent).find(settings.dropdownToggle);

                if (dropdownToggle.length > 0 && dropdownToggle.attr('aria-expanded') === 'true') {
                    dropdownToggle
                        .removeClass('show')
                        .attr('aria-expanded', 'false')
                        .next().removeClass('show');
                }
            }
        });

        $(document).on('click', function (event) {
            if (container.hasClass(stateClass) && !container.is(event.target) && container.has(event.target).length === 0) {
                container.removeClass(stateClass);
            }
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);


