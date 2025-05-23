document.addEventListener('DOMContentLoaded', function () {
    navManager.initialize();

    document.addEventListener('click', event => {
        if (event.target.classList.contains('js-collapse')) {
            var targetElement = document.querySelector(`#${event.target.getAttribute('data-toggle')}`);
            if (targetElement) {
                const isExpanded = event.target.getAttribute('aria-expanded') === 'true';
                event.target.setAttribute('aria-expanded', String(!isExpanded));
                targetElement.classList.toggle('is-open');
            }
        }
    });

    document.querySelectorAll('.js-scroll-container').forEach(container => {
        const content = container.querySelector('.js-scroll-content');
        if (!content) return;
        content.onscroll = () =>
            container.classList.toggle('is-scroll', content.scrollTop > 0);
    });
});

var navManager = (function () {
    var settings = {
        nav: '.js-nav-container',
        toggler: '.js-nav-toggler',
        stateClass: 'is-open',
    };

    var initialize = function () {
        var togglers = document.querySelectorAll(settings.toggler);
        var nav = document.querySelector(settings.nav);
        var stateClass = settings.stateClass;

        togglers.forEach(toggler => {
            toggler.addEventListener('click', function () {
                if (nav.classList.contains(stateClass)) {
                    nav.classList.remove(stateClass);
                    locker.unlock();
                } else {
                    nav.classList.add(stateClass);
                    locker.lock();
                }
            });
        });
    };

    return {
        initialize: initialize,
    };
})();

var locker = (function () {
    const settings = {
        element: 'html',
        lockedClass: 'no-scroll'
    };

    var lock = function () {
        var padding = window.innerWidth - document.documentElement.clientWidth;
        var el = document.querySelector(settings.element);

        el.classList.add(settings.lockedClass);
        el.style.paddingRight = padding + 'px';
    };

    var unlock = function () {
        var el = document.querySelector(settings.element);

        el.classList.remove(settings.lockedClass);
        el.style.paddingRight = '0';
    };

    return {
        lock: lock,
        unlock: unlock
    };
})();


var fixOnScroll = (function () {
    var defaults = {
        fixedSelector: '.js-fix',
        fixedScreenSelector: '.js-fix-container',
        bottomPageSelector: '.js-footer',
        fixedClass: 'is-fixed'
    };

    // Функція для обʼєднання обʼєктів (копіює властивості з source у target)
    var extend = function (target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    };

    var initialize = function (params) {
        var settings = extend({}, defaults);
        extend(settings, params);

        var fixedElements = Array.from(document.querySelectorAll(settings.fixedSelector));
        var fixedScreenElements = Array.from(document.querySelectorAll(settings.fixedScreenSelector));
        var bottomPageElement = document.querySelector(settings.bottomPageSelector);

        var bottomReached = false; // Прапорець, чи досягнуто нижньої частини сторінки

        // Отримання відступів (padding) для елемента
        var getPaddingValues = function (elem) {
            if (!elem) return { top: 0, bottom: 0 };
            var style = window.getComputedStyle(elem);
            return {
                top: parseFloat(style.paddingTop) || 0,
                bottom: parseFloat(style.paddingBottom) || 0
            };
        };

        // Визначення висоти екранної частини фіксованого блоку
        var getSectionScreenHeight = function (elem) {
            if (!elem) return 0;

            var bottomTop = bottomPageElement ? bottomPageElement.getBoundingClientRect().top + window.pageYOffset : 0;
            var scrollBottom = window.pageYOffset + window.innerHeight;

            var paddings = getPaddingValues(fixedScreenElements[0]);
            var baseHeight = window.innerHeight;

            // Якщо елемент ще не прокручений у зону фіксації
            if (window.pageYOffset < elem.offsetTop) {
                var availableHeight = window.innerHeight - elem.getBoundingClientRect().top - paddings.bottom;
                return availableHeight > 0 ? availableHeight : 0;
            }

            // Якщо нижня межа сторінки ще не досягнута
            if (scrollBottom < bottomTop) return baseHeight;

            // Якщо нижня межа вже досягнута — зменшуємо висоту, щоб не перекривати футер
            var bottomHeight = bottomPageElement ? bottomPageElement.offsetHeight : 0;
            return baseHeight - bottomHeight - paddings.bottom;
        };

        // Оновлення стану конкретного фіксованого елемента
        var update = function (elem, fixedScreenElem) {
            var scrollTop = window.pageYOffset;
            var offsetTop = elem.offsetTop;
            var height = getSectionScreenHeight(elem);

            // Додаємо/видаляємо клас фіксації залежно від прокрутки
            if (scrollTop > offsetTop) {
                elem.classList.add(settings.fixedClass);
            } else {
                elem.classList.remove(settings.fixedClass);
            }

            // Задаємо мінімальну висоту блоку
            elem.style.minHeight = height + 'px';

            // Оновлюємо розміри внутрішнього фіксованого елемента (якщо є)
            if (fixedScreenElem) {
                fixedScreenElem.style.width = elem.offsetWidth + 'px';
                fixedScreenElem.style.minHeight = height + 'px';
            }
        };

        // Оновлення всіх фіксованих елементів при прокрутці або зміні розміру
        var updateVisibility = function () {
            // Перевірка медіазапроса
            if (!window.matchMedia('(min-width: 992px)').matches) {
                fixedElements.forEach(function (elem, i) {
                    elem.classList.remove(settings.fixedClass);
                    elem.style.minHeight = '';
                    var fixedScreenElem = elem.querySelector(settings.fixedScreenSelector);
                    if (!fixedScreenElem) fixedScreenElem = fixedScreenElements[i];
                    if (fixedScreenElem) {
                        fixedScreenElem.style.minHeight = '';
                        fixedScreenElem.style.width = '';
                    }
                });
                return;
            }

            var scrollBottom = window.pageYOffset + window.innerHeight;
            var bottomTop = bottomPageElement ? bottomPageElement.offsetTop : Infinity;
            var newBottomReached = scrollBottom >= bottomTop;

            // Оновлення кожного елемента
            fixedElements.forEach(function (elem, i) {
                var fixedScreenElem = elem.querySelector(settings.fixedScreenSelector);
                if (!fixedScreenElem) fixedScreenElem = fixedScreenElements[i];
                update(elem, fixedScreenElem);
            });

            // Якщо стан "нижня межа досягнута" змінився, перерисовуємо
            if (newBottomReached !== bottomReached) {
                bottomReached = newBottomReached;
                fixedElements.forEach(function (elem, i) {
                    var fixedScreenElem = elem.querySelector(settings.fixedScreenSelector);
                    if (!fixedScreenElem) fixedScreenElem = fixedScreenElements[i];
                    update(elem, fixedScreenElem);
                });
            }
        };

        window.addEventListener('scroll', updateVisibility);
        window.addEventListener('resize', updateVisibility);

        updateVisibility();
    };

    return {
        initialize: initialize
    };
})();





