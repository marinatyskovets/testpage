document.addEventListener("DOMContentLoaded", function () {
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

    collapseToggle.initialize();

    var container = document.getElementById('jobsContainer'),
        jobsCount = document.getElementById('jobsCount'),
        searchInput = document.getElementById("query");

    function displayVacancies(vacancies) {
        var logoBackgroundOptions = ['#FFC466', '#0026C7', '#8F6B54', '#A557B3', '#FF6951', '#5ACF5A', '#C532C3', '#8D1385', '#FF9D00', '#8B00C7', '#E7A67B', '#53BCB5', '#BCEBFF', '#99F199', '#F4EF79', '#FFB7DC', '#C3E3E5', '#FFC466', '#FFAC90', '#FADDD2'];
        var logoColorOptions = ['#ffffff', '#000000'];

        function getRandomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function getLogo(company) {
            var cachedLogo = localStorage.getItem(company);
            if (cachedLogo) return cachedLogo;

            var logoHTML;
            var logoBackground = getRandomElement(logoBackgroundOptions);
            var logoColor = getRandomElement(logoColorOptions);
            var logoText = company.charAt(0).toUpperCase();
            logoHTML =  `<div class="sc-logo" style="background: ${logoBackground}; color: ${logoColor};">${logoText}</div>`;

            localStorage.setItem(company, logoHTML);

            return logoHTML;
        }

        if (!Array.isArray(vacancies) || vacancies.length === 0) {
            container.innerHTML = '<p class="no-jobs">No jobs available at the moment.</p>';
            return;
        }

        jobsCount.innerHTML = vacancies.length;

        container.innerHTML = vacancies.map(job => {
            var logoHTML = getLogo(job.company),
                description = job.descriptions?.length > 0
                    ? job.descriptions.map(desc => `<p class="sc-description">${desc}</p>`).join('')
                    : null;
            return `
                <article class="c-job-item">
                    <div class="sc-content">
                        ${logoHTML}
                        <div class="sc-info">
                            <div class="sc-head">
                                <h3 class="sc-title"><a href="${job.url}" class="c-job-item-url">${job.title}</a></h3>
                            </div>
                            <div class="sc-details">
                                ${job.company ? `<div class="sc-company">${job.company}</div>` : ''}
                                ${job.salary ? `<div class="sc-salary">💰 ${job.salary}</div>` : ''}
                                ${job.location ? `<div class="sc-location">📍 ${job.location}</div>` : ''}
                                ${job.actuality ? `<div class="sc-date">🕝 ${job.actuality}</div>` : ''}
                            </div>
                            ${description ? description : ''}
                        </div>
                        ${job.tags?.length > 0
                                ? `<div class="sc-tags">${job.tags.map(tag => `<div class="c-tag c-tag--md-short">${tag.value}</div>`).join('')}</div>`
                                : ''}
                    </div>
                    ${job.url ? `<div class="sc-action"><div class="c-btn c-btn--light">View</div></div>` : ''}
                </article>`;
        }).join('');

        document.querySelectorAll('.c-job-item').forEach(item => {
            item.addEventListener('click', function (event) {
                const url = this.querySelector('.c-job-item-url')?.href;
                const clickedInteractive = event.target.closest('a:not(.c-job-item-url), button');
                if (url && !clickedInteractive) {
                    window.location.href = url;
                }
            });
        });
    }

    function filterJobs(searchValue) {
        let searchFilteredJobs = new Set();
        vacancies.forEach(job => {
            if (job.title.toLowerCase().includes(searchValue)
                || (job.company && job.company.toLowerCase().includes(searchValue))
                || (job.location && job.location.toLowerCase().includes(searchValue))
                || (job.salary && job.salary.toLowerCase().includes(searchValue))
                || (job.descriptions.length && job.descriptions.length > 0 && job.descriptions.join('').toLowerCase().includes(searchValue))
            ) {
                searchFilteredJobs.add(job);

            }
        });
        displayVacancies(Array.from(searchFilteredJobs));
    }

    function displayLoadMoreButton() {
        var container = document.getElementById('loadMore');
        if (!container) {
            return;
        }
        var loadMoreButton = document.createElement('button');

        loadMoreButton.classList.add('c-btn', 'c-btn--light', 'c-btn--md-high');
        loadMoreButton.textContent = container.getAttribute('data-text');
        loadMoreButton.addEventListener('click', function () {
            window.location.href = container.getAttribute('data-url');
        });
        container.appendChild(loadMoreButton);
    }

    searchInput.addEventListener('keyup', function (event) {
        const searchValue = searchInput.value.toLowerCase();
        filterJobs(searchValue);
    });

    displayVacancies(vacancies);
    displayLoadMoreButton();
});
