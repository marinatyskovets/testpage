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


var scrollToTop = (function ($) {
    var defaults = {
        speed: 500,
        classBtn: 'c-scroll-top-button',
        classIcon: 'c-ico c-ico--xl c-ico--inherit'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params || {}),
            $button = $('<button/>', {type: 'button', class: settings.classBtn})
                .append('<svg class="' + settings.classIcon + '"><path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"></path></svg>')
                .on('click', function () {
                    $('body, html').animate({scrollTop: 0}, settings.speed);
                })
                .appendTo('body').hide();

        $(window).scroll(function() {
            $button.toggle($(this).scrollTop() > $(window).height());
        });
    };

    return {
        initialize: initialize
    };
})(jQuery);

var multiSelectManager = (function ($) {
    var defaults = {
        container: '.js-multi-select',
        input: '.js-multi-select-control',
        menu: '.js-multi-select-menu',
        stateClass: 'is-show'
    };

    var initialize = function (params) {
        var settings = $.extend({}, defaults, params);

        $(document).on('click', function (event) {
            var $target = $(event.target);
            var $container = $target.closest(settings.container);
            var $input = $target.closest(settings.input);

            // Закриваємо всі меню
            $(settings.container).removeClass(settings.stateClass);

            // Якщо клік по конкретному multi-select, відкриваємо тільки його
            if ($container.length && $input.length) {
                $container.addClass(settings.stateClass);
            }

            // Обробка кліку по елементу меню
            if ($target.closest('.sc-select-item').length) {
                var $clickedItem = $target.closest('.sc-select-item');
                var itemText = $clickedItem.text();
                var itemValue = $clickedItem.data('value');

                // Додаємо тег у відповідний контейнер
                $container.find(settings.input).before(
                    `<div class="c-tag c-tag--md-short c-tag--close" data-value="${itemValue}">${itemText}
                        <svg class="c-ico c-ico--lg c-ico--dark" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                        </svg>
                    </div>`
                );

                // Видаляємо елемент з меню
                $clickedItem.remove();
            }

            // Обробка кліку по тегу (видалення)
            if ($target.closest('.c-tag').length) {
                var $tag = $target.closest('.c-tag');
                var tagText = $tag.text().trim();
                var tagValue = $tag.data('value');

                // Відновлюємо елемент у відповідному меню
                var $menu = $container.find(settings.menu);
                var $newMenuItem = $(`<div class="sc-select-item" data-value="${tagValue}">${tagText}</div>`);

                // Вставляємо назад у правильному порядку
                var $menuItems = $menu.find('.sc-select-item');
                var insertBeforeItem = $menuItems.filter(function () {
                    return $(this).data('value') > tagValue;
                }).first();

                insertBeforeItem.length ? $newMenuItem.insertBefore(insertBeforeItem) : $menu.append($newMenuItem);

                // Видаляємо тег
                $tag.remove();
            }
        });
    };

    return { initialize: initialize };
})(jQuery);


