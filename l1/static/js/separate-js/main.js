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


var tooltipVisibilityManager = (function ($) {
    var defaults = {
        container: '.js-tooltip',
        opener: '.js-tooltip-toggle',
        closer: '.js-tooltip-close',
        stateClass: 'is-open'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            container = $(settings.container),
            stateClass = settings.stateClass;

        $(settings.opener).on('click', function (e) {
            e.stopPropagation();
            $(e.currentTarget).closest(settings.container).toggleClass(stateClass);
        });

        $(settings.closer).on('click', function (e) {
            e.stopPropagation();

            var tooltip = $(this).closest(settings.container);

            if (tooltip.hasClass(stateClass)) {
                tooltip.removeClass(stateClass);
            }
        });

        $(document).on('click', function (e) {
            var target = $(e.target);

            if (container.hasClass(stateClass) && !container.is(target) && container.has(target).length === 0) {
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

var updateCounter = (function () {
    var defaults = {
        container: '.js-counter',
        min: 0,
        max: 1000000,
        interval: 3000,
        step: 2
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});
        var container = $(settings.container);
        var counter = container.children().first();
        var currentValue = parseFloat(counter.text()) || settings.min;

        setInterval(function () {
            var change = (Math.random() < 0.9 ? 1 : -1) * Math.random() * (Math.random() < 0.9 ? settings.step : 2);

            currentValue += change;
            currentValue = Math.max(settings.min, Math.min(settings.max, currentValue));
            counter.text(currentValue.toFixed(0));
        }, settings.interval);
    };

    return {
        initialize: initialize
    };
})();


var lazyLoader = (function () {
    var defaults = {
        rootMargin: '300px 0px',
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {});

        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            var script = document.createElement('script');
            script.src = '/static/js/separate-js/lozad.min.js';
            script.onload = () => lozad('.lozad', {rootMargin: settings.rootMargin}).observe();

            document.body.appendChild(script);
        }
    };

    return {
        initialize: initialize
    };
})();


var countDownTimer = (function () {
    var defaults = {
        timer: '.js-countdown',
        deadlineHours: 1,
        updateInterval: 1000
    };

    var timer = (minutes, seconds) => `<span>${minutes}</span><span>:</span><span>${seconds}</span>`;

    var initialize = function (params) {
        var now = new Date(),
            settings = $.extend({}, defaults, params || {}),
            element = $(settings.timer),
            deadlineTime = new Date(now.getTime() + (settings.deadlineHours * 60 * 60000));

        var intervalId = setInterval(function () {
            let now = new Date().getTime();
            let time = deadlineTime - now;

            if (time <= 0) {
                clearInterval(intervalId);

                element.html(timer('00', '00'));

                return;
            }

            let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes.toString().length < 2) minutes = '0' + minutes;

            let seconds = Math.floor((time % (1000 * 60)) / 1000);
            if (seconds.toString().length < 2) seconds = '0' + seconds;

            element.html(timer(minutes, seconds));

        }, settings.updateInterval);
    };

    return {
        initialize: initialize
    };
})();


var circularProgress = (function ($) {
    var defaults = {
        selector: '.js-circular-progress',
        valueAttr: 'data-value',
        statusClassPrefix: 'c-circular-progress--',
        dangerLimit: 40,
        warningLimit: 80,
        maxStrokeDasharray: 351.858
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params);

        $(settings.selector).each(function () {
            renderProgress($(this), settings);
        });

        $(document).on('change', settings.selector, function () {
            renderProgress($(this), settings);
        });
    };

    var renderProgress = function ($element, settings) {
        var progressValue = parseInt($element.attr(settings.valueAttr), 10);
        if (isNaN(progressValue)) return;

        var $progressCircle = $element.find('svg circle').eq(1);
        var classPrefix = settings.statusClassPrefix;

        var statusClass;
        if (progressValue <= settings.dangerLimit) {
            statusClass = classPrefix + 'danger';
        } else if (progressValue <= settings.warningLimit) {
            statusClass = classPrefix + 'warning';
        } else {
            statusClass = classPrefix + 'success';
        }

        $element.removeClass(
            classPrefix + 'danger ' +
            classPrefix + 'warning ' +
            classPrefix + 'success'
        ).addClass(statusClass);

        var strokeOffset = settings.maxStrokeDasharray * (1 - progressValue / 100);
        $progressCircle.css('stroke-dasharray',
            (settings.maxStrokeDasharray - strokeOffset) + ' ' + settings.maxStrokeDasharray
        );
    };

    return {
        initialize: initialize
    };
})(jQuery);


var fixSection = (function ($) {
    var defaults = {
        fixedSelector: '.js-fix-section',
        fixedScreenSelector: '.js-fix-section-screen',
        bottomPageSelector: '.js-page-bottom',
        fixedClass: 'is-top-fixed',
        visibleClass: 'is-visible',
        offsetBottomContainer: 48,
        tabSelector: '[data-bs-toggle="tab"]'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params),
            $fixedElement = $(settings.fixedSelector),
            $fixedScreenElement = $(settings.fixedScreenSelector),
            $bottomPageElement = $(settings.bottomPageSelector);

        var bottomReached = false;

        var isVisibleInViewport = function ($elem) {
            if (!$elem.length) return false;
            var rect = $elem[0].getBoundingClientRect();
            return rect.bottom > 0 && rect.right > 0 &&
                rect.top < window.innerHeight && rect.left < window.innerWidth;
        };

        var getPaddingValues = function ($elem) {
            var style = window.getComputedStyle($elem[0]);
            return {
                top: parseFloat(style.paddingTop) || 0,
                bottom: parseFloat(style.paddingBottom) || 0
            };
        };

        var getSectionScreenHeight = function ($elem) {
            var bottomTop = $bottomPageElement.length ? $bottomPageElement.offset().top : 0,
                scrollBottom = $(window).scrollTop() + $(window).outerHeight(),
                paddings = getPaddingValues($elem),
                baseHeight = $(window).outerHeight() - paddings.top - paddings.bottom;

            if (scrollBottom < bottomTop) return baseHeight;

            return baseHeight - ($bottomPageElement.outerHeight() || 0) - settings.offsetBottomContainer;
        };

        var update = function ($elem, $fixedScreenElem) {
            var scrollTop = $(window).scrollTop(),
                offsetTop = $elem.offset().top,
                height = getSectionScreenHeight($elem);

            $elem.toggleClass(settings.fixedClass, scrollTop > offsetTop)
                .css('minHeight', height);

            $fixedScreenElem.css({
                width: $elem.outerWidth(),
                minHeight: height
            });
        };

        var updateVisibility = function () {
            $fixedElement.removeClass(settings.visibleClass);

            var scrollBottom = $(window).scrollTop() + $(window).outerHeight(),
                bottomTop = $bottomPageElement.length ? $bottomPageElement.offset().top : Infinity,
                newBottomReached = scrollBottom >= bottomTop;

            $fixedElement.each(function (i) {
                var $elem = $(this);
                if (isVisibleInViewport($elem)) {
                    $elem.addClass(settings.visibleClass);

                    var $fixedScreenElem = $elem.find(settings.fixedScreenSelector);
                    if (!$fixedScreenElem.length) $fixedScreenElem = $fixedScreenElement.eq(i);
                    update($elem, $fixedScreenElem);
                }
            });

            if (newBottomReached !== bottomReached) {
                bottomReached = newBottomReached;
                $fixedElement.each(function (i) {
                    var $elem = $(this),
                        $fixedScreenElem = $elem.find(settings.fixedScreenSelector);
                    if (!$fixedScreenElem.length) $fixedScreenElem = $fixedScreenElement.eq(i);
                    update($elem, $fixedScreenElem);
                });
            }
        };

        if ($(settings.tabSelector).length) {
            $(settings.tabSelector).on('click', function () {
                updateVisibility();

                var targetTabId = $(this).attr('data-bs-target'),
                    $targetTab = $(targetTabId);

                if ($targetTab.hasClass('active')) {
                    var $tabFixedElement = $targetTab.find(settings.fixedSelector),
                        $tabFixedScreenElement = $targetTab.find(settings.fixedScreenSelector);

                    $tabFixedElement.each(function (i) {
                        $tabFixedScreenElement.eq(i).css('width', $(this).width());
                    });
                }
            });
        }

        $(window).on('scroll resize', updateVisibility);

        updateVisibility();
    };

    return {
        initialize: initialize
    };
})(jQuery);


