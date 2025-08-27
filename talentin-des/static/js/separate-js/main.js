$(document).ready(function () {

    toggle.initialize();

    // Example autocomplete
    var jobs = [
        {value: 'Программист', data: 'programmer'},
        {value: 'Продавец', data: 'prodavec'},
        {value: 'Дизайнер', data: 'designer'}
    ];

    $('#autocomplete').autocomplete({
        lookup: jobs,
        onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });

    $('.js-form-focus').toggleFocusInput();

    $(document).on('show.bs.modal', '.js-modal-locker', function () {
        blockScroll.block();
    });
    $(document).on('hidden.bs.modal', '.js-modal-locker', function () {
        blockScroll.unblock();
    });

    $('.js-slider').owlCarousel({
        margin: 5,
        loop: false,
        autoWidth: true,
        items: 5,
        dots: false,
        mouseDrag: false,
        nav: true,
    })

    // For dropdowns (Clicks inside do not close the dropdown)
    $(document).on(
        'click.bs.dropdown.data-api',
        '.js-keep-inside-clicks-open',
        function (e) {
            e.stopPropagation();
        }
    );

    $('.js-field-dropdown').on('focus', function () {
        $(this).parents('.js-field-dropdown-container').addClass('is-open');
    });

    $(document).on('click', function(e){
        var parentInput  = $('.js-field-dropdown-container');

        $(parentInput).each(function () {
            var $self = $(this);

            if(!$self.is(e.target) && $self.has(e.target).length === 0) {
                $self.removeClass('is-open');
            }
        });
    });

    $('.js-toggle-btn').on('click', function () {
        var container = $('.js-toggle-container');

        if (container.hasClass('is-open')) {
            container.removeClass('is-open');
        } else {
            container.addClass('is-open');
        }
    });

    $('.js-input-show-modal').on('change', function() {
        if ($(this).is(':not(:checked')) {
            $($(this).attr('data-target')).modal('show');
        }
    });

    $('.js-change-input-group').on('change', function() {
        var container = $(this).parents('.js-input-group');
        var inputs = container.find('input[type=checkbox]');
        inputs.prop('checked', $(this).prop('checked'));

        if (container.find('input[type=checkbox]:checked.js-change-input').length === 0) {
            container.find('.js-change-input').prop({
                disabled: true
            });
        } else {
            container.find('.js-change-input').prop({
                disabled: false
            });
        }
    });

    $('.js-change-input').on('change', function() {
        var checked = $(this).prop('checked');
        var container = $(this).parents('.js-input-group');

        if ($(this).is(':checked')) {
            container.find('.js-change-input-group').prop({
                indeterminate: true,
                checked: container.find('.js-change-input-group').prop('checked', false)
            });
        } else {
            if (container.find('input[type=checkbox]:checked.js-change-input').length === 0) {
                container.find('input[type=checkbox]').prop({
                    indeterminate: false,
                    checked: checked
                });
                container.find('.js-change-input').prop({
                    disabled: true
                });
            }
        }
    });
});

var blockScroll = (function ($) {
    var noScrollClass = 'no-scroll',
        isBlocked = false;

    var block = function () {
        if (isBlocked) {
            return;
        }

        isBlocked = true;
        // if (yii.version.isDesktop) {
        //     $('body').css('paddingRight', window.innerWidth - document.documentElement.clientWidth);
        // }
        $('html').addClass(noScrollClass);
    };

    var unblock = function () {
        $('html').removeClass(noScrollClass);
        // if (yii.version.isDesktop) {
        //     $('body').css('paddingRight', 0);
        // }
        isBlocked = false;
    };

    return {
        block: block,
        unblock: unblock
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
