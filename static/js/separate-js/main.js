var collapseToggle = (function () {
    var defaults = {
        container: '.js-collapse-container',
        toggleBtn: '.js-collapse-toggle',
        itemSelector: ':scope > *',
    };

    var setMaxVisibleItems = () => window.innerWidth <= 668 ? 8 : (window.innerWidth <= 992 ? 16 : 24);

    var hideOverflowingItems = (items, toggleBtn, maxVisibleItems) => {
        items.forEach((item, index) => item.classList.toggle('u-hidden', index >= maxVisibleItems));
        toggleBtn.classList.toggle('u-hidden', items.length <= maxVisibleItems);
    };

    var initialize = function (params) {
        var settings = { ...defaults, ...params, maxVisibleItems: setMaxVisibleItems() };

        var updateButtonText = (items, toggleBtn) => {
            const hiddenItems = items.length - settings.maxVisibleItems;
            const spanNode = toggleBtn.querySelector('span');
            if (hiddenItems > 0) {
                spanNode ? spanNode.textContent = `${hiddenItems} more...` : toggleBtn.appendChild(Object.assign(document.createElement('span'), { textContent: `${hiddenItems} more...` }));
            } else {
                spanNode?.remove();
            }
            toggleBtn.classList.toggle('u-hidden', items.length <= settings.maxVisibleItems);
        };

        var updateVisibility = (container) => {
            var toggleBtn = container.querySelector(settings.toggleBtn);
            var items = container.querySelectorAll(settings.itemSelector);
            hideOverflowingItems(items, toggleBtn, settings.maxVisibleItems);
            updateButtonText(items, toggleBtn);

            toggleBtn.addEventListener('click', () => {
                items.forEach(item => item.classList.remove('u-hidden'));
                toggleBtn.classList.add('u-hidden');
            });

            window.addEventListener('resize', () => {
                settings.maxVisibleItems = setMaxVisibleItems();
                hideOverflowingItems(items, toggleBtn, settings.maxVisibleItems);
                updateButtonText(items, toggleBtn);
            });
        };

        document.querySelectorAll(settings.container).forEach(updateVisibility);
    };

    return { initialize };
})();


