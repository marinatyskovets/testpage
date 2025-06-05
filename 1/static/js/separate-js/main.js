document.addEventListener('DOMContentLoaded', function () {
    navManager.initialize();

    // ------------------------- JS лише для демонстрації -------------------------
    document.querySelectorAll('.js-scroll-container').forEach(container => {
        var content = container.querySelector('.js-scroll-content');
        if (!content) return;
        content.onscroll = () =>
            container.classList.toggle('is-scroll', content.scrollTop > 0);
    });
    // --------------------------------------------------
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


// ------------------------- JS лише для демонстрації -------------------------
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
                var availableHeight = window.innerHeight - elem.getBoundingClientRect().top - paddings.bottom - paddings.top;
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

            // Додаємо/видаляємо клас фіксації до fixedScreenElem (не до elem!)
            if (scrollTop > offsetTop) {
                if (fixedScreenElem) {
                    fixedScreenElem.classList.add(settings.fixedClass);
                }
            } else {
                if (fixedScreenElem) {
                    fixedScreenElem.classList.remove(settings.fixedClass);
                }
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
                    var fixedScreenElem = elem.querySelector(settings.fixedScreenSelector);
                    if (!fixedScreenElem) fixedScreenElem = fixedScreenElements[i];
                    if (fixedScreenElem) {
                        fixedScreenElem.classList.remove(settings.fixedClass);
                        fixedScreenElem.style.minHeight = '';
                        fixedScreenElem.style.width = '';
                    }
                    elem.style.minHeight = '';
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


var modal = (function () {
    var toggle = function (selector, show) {
        document.querySelectorAll(selector).forEach(function (btn) {
            btn.addEventListener('click', function () {
                var target = show ? document.querySelector(btn.getAttribute('data-bs-target')) : btn.closest('.show');

                if (target) {
                    target.classList.toggle('show', show);
                    target.style.display = show ? 'block' : 'none';
                    if (show) {
                        locker.lock();
                    } else {
                        locker.unlock();
                    }
                }
            });
        });
    };

    toggle('[data-bs-toggle="modal"]', true);
    toggle('[data-bs-dismiss="modal"]', false);

    return {};
})();


var dropdownManager = (function () {
    function toggleDropdown(toggle, show, dropdownSelector) {
        var dropdown = toggle.closest(dropdownSelector);
        if (!dropdown) return;
        var menu = dropdown.querySelector('.dropdown-menu');
        toggle.classList.toggle('show', show);
        if (menu) menu.classList.toggle('show', show);
    }

    function updateLocker() {
        var isScreen = window.innerWidth < 1200;
        var hasShow = !!document.querySelector('.js-modal-dropdown [data-bs-toggle="dropdown"].show');
        if (hasShow) (isScreen ? locker.lock : locker.unlock)();
    }

    function initModalDropdown() {
        document.querySelectorAll('.js-modal-dropdown [data-bs-toggle="dropdown"]').forEach(toggle => {
            toggle.addEventListener('click', e => {
                var isScreen = window.innerWidth < 1200;
                var isShown = toggle.classList.contains('show');
                e.preventDefault();
                e.stopPropagation();

                if (!isShown) {
                    document.querySelectorAll('[data-bs-toggle="dropdown"].show').forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            var otherDropdown = otherToggle.closest('.js-modal-dropdown, .js-dropdown');
                            if (!otherDropdown) return;
                            var menu = otherDropdown.querySelector('.dropdown-menu');
                            otherToggle.classList.remove('show');
                            if (menu) menu.classList.remove('show');
                        }
                    });
                }

                toggleDropdown(toggle, !isShown, '.js-modal-dropdown');

                if (isScreen) (isShown ? locker.unlock : locker.lock)();
            });
        });

        document.querySelectorAll('.js-modal-dropdown .c-modal-dropdown__close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                var dropdown = closeBtn.closest('.js-modal-dropdown');
                var toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
                toggleDropdown(toggle, false, '.js-modal-dropdown');
                if (window.innerWidth < 1200) locker.unlock();
            });
        });

        document.addEventListener('click', e => {
            if (window.innerWidth < 1200) return;
            if (!e.target.closest('.js-modal-dropdown') && !e.target.closest('.js-dropdown')) {
                document.querySelectorAll('[data-bs-toggle="dropdown"].show').forEach(toggle => {
                    var dropdown = toggle.closest('.js-modal-dropdown, .js-dropdown');
                    if (!dropdown) return;
                    var menu = dropdown.querySelector('.dropdown-menu');
                    toggle.classList.remove('show');
                    if (menu) menu.classList.remove('show');
                });
            }
        });

        window.addEventListener('resize', updateLocker);
    }

    function initDropdown() {
        document.querySelectorAll('.js-dropdown [data-bs-toggle="dropdown"]').forEach(toggle => {
            toggle.addEventListener('click', e => {
                var dropdown = toggle.closest('.js-dropdown');
                if (!dropdown) return;

                var menu = dropdown.querySelector('.dropdown-menu');
                var isShown = toggle.classList.contains('show');

                e.preventDefault();
                e.stopPropagation();

                if (!isShown) {
                    document.querySelectorAll('[data-bs-toggle="dropdown"].show').forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            var otherDropdown = otherToggle.closest('.js-modal-dropdown, .js-dropdown');
                            if (!otherDropdown) return;
                            var otherMenu = otherDropdown.querySelector('.dropdown-menu');
                            otherToggle.classList.remove('show');
                            if (otherMenu) otherMenu.classList.remove('show');
                        }
                    });
                }

                toggle.classList.toggle('show', !isShown);
                menu.classList.toggle('show', !isShown);
            });
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.js-dropdown') && !e.target.closest('.js-modal-dropdown')) {
                document.querySelectorAll('[data-bs-toggle="dropdown"].show').forEach(toggle => {
                    var dropdown = toggle.closest('.js-modal-dropdown, .js-dropdown');
                    if (!dropdown) return;
                    var menu = dropdown.querySelector('.dropdown-menu');
                    toggle.classList.remove('show');
                    if (menu) menu.classList.remove('show');
                });
            }
        });
    }

    initModalDropdown();
    initDropdown();

    return {};
})();


var collapse = (function () {
    function toggleCollapse(toggle, target) {
        var isShown = target.classList.contains('show');
        target.classList.toggle('collapse', isShown);
        target.classList.toggle('show', !isShown);
        target.classList.add('collapsing');
        toggle.classList.toggle('collapsed');
        toggle.setAttribute('aria-expanded', String(!isShown));

        setTimeout(() => {
            target.classList.remove('collapsing');
            target.classList.toggle('collapse', true);
            if (!isShown) target.classList.add('show');
        }, 50);
    }

    function handleClick(event) {
        var toggle = event.target.closest('[data-bs-toggle="collapse"]');
        if (!toggle) return;

        var targetSelector = toggle.getAttribute('data-bs-target') || toggle.getAttribute('href');
        var target = document.querySelector(targetSelector);
        if (!target) return;

        var parentSelector = toggle.getAttribute('data-bs-parent');
        if (parentSelector) {
            var parent = document.querySelector(parentSelector);
            parent.querySelectorAll('.collapse.show').forEach(el => {
                if (el !== target) {
                    document.querySelectorAll(`[data-bs-target="#${el.id}"], [href="#${el.id}"]`)
                        .forEach(btn => btn.setAttribute('aria-expanded', 'false'));
                    toggleCollapse(document.querySelector(`[data-bs-target="#${el.id}"], [href="#${el.id}"]`), el);
                }
            });
        }

        toggleCollapse(toggle, target);
    }

    document.addEventListener('click', handleClick);

    return {};
})();
// --------------------------------------------------


