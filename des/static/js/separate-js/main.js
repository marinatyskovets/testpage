$(document).ready(function () {
    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        locker.lock();
    });

    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        locker.unlock();
    });

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


var toggleFixedOnScroll = (function ($) {
    var defaults = {
        fixedElement: '.js-fix-element',
        fixedTopClass: 'is-fixed-top',
        fixedBottomClass: 'is-fixed-bottom',
        container: '.js-fix-container',
        header: 'header',
        offsetTop: 0,
        offsetBottomContainer: 0
    };

    var initialize = function(params) {
        var settings = $.extend({}, defaults, params || {}),
            $fixedElement = $(settings.fixedElement),
            fixedElementHeight = $fixedElement.outerHeight(),
            $container = $(settings.container),
            prevScrollTop = 0;

        $(window).on('scroll', function() {
            var scrollTop = $(window).scrollTop();
            var containerTop = $container.offset().top;
            var containerBottom = containerTop + $container.outerHeight() - settings.offsetBottomContainer;
            var positionTop = scrollTop < prevScrollTop ? settings.offsetTop : settings.offsetTop;

            if (scrollTop <= containerTop) {
                $fixedElement
                    .removeClass(settings.fixedTopClass)
                    .css({top: ''});
            } else {
                var isFixedTop = scrollTop + fixedElementHeight + settings.offsetBottomContainer < containerBottom;

                $fixedElement
                    .removeClass(isFixedTop ? settings.fixedBottomClass : settings.fixedTopClass)
                    .addClass(isFixedTop ? settings.fixedTopClass : settings.fixedBottomClass)
                    .css({top: isFixedTop ? positionTop : containerBottom - fixedElementHeight});
            }

            prevScrollTop = scrollTop;
        }).trigger('scroll');
    };

    return {
        initialize: initialize
    };
})(jQuery);


var scrollSpy = (function ($) {
    var defaults = {
        navContainer: '.js-nav-container',
        activeClass: 'active',
        scrollDuration: 1600,
        offset: 10
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            $navContainer = $(settings.navContainer),
            $navItems = $navContainer.find('a'),
            sections = $navItems.map(function() {return $(this).attr('href').replace('#', '');}).get();

        $(window).on('scroll', function () {
            var scrollPosition = $(window).scrollTop();

            sections.forEach(function (id) {
                var $section = $('#' + id);
                if ($section.length) {
                    var offset = $section.offset().top - settings.offset,
                        height = $section.outerHeight(true);

                    if (scrollPosition >= offset && scrollPosition < offset + height) {
                        $navItems.removeClass(settings.activeClass);
                        $navContainer.find('[href="#' + id + '"]').addClass(settings.activeClass);
                    }
                }
            });
        });

        $(window).trigger('scroll');
    };

    return {
        initialize: initialize
    };

})(jQuery);

