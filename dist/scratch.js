function createTagsContainer(textarea, containerIndex) {
    const tagsNav = document.createElement('div');
    tagsNav.classList.add('nav', 'nav-tabs');
    tagsNav.id = `tags-tab-${containerIndex}`;
    tagsNav.setAttribute('role', 'tablist');

    const tagsTabContent = document.createElement('div');
    tagsTabContent.classList.add('tab-content');
    tagsTabContent.id = `tags-tabContent-${containerIndex}`;

    let mainIndex = 0;
    for (const [mainKey, subTags] of Object.entries(tags)) {
        const navItem = document.createElement('a');
        navItem.classList.add('nav-item', 'nav-link');
        navItem.id = `tag-${mainIndex}-tab-${containerIndex}`;
        navItem.setAttribute('data-toggle', 'tab');
        navItem.setAttribute('href', `#tag-${mainIndex}-${containerIndex}`);
        navItem.setAttribute('role', 'tab');
        navItem.textContent = mainKey;

        tagsNav.appendChild(navItem);

        const tabPane = document.createElement('div');
        tabPane.classList.add('tab-pane', 'fade');
        tabPane.id = `tag-${mainIndex}-${containerIndex}`;
        tabPane.setAttribute('role', 'tabpanel');

        // Create inner tabs
        const innerTagsNav = document.createElement('div');
        innerTagsNav.classList.add('nav', 'nav-tabs');
        innerTagsNav.setAttribute('role', 'tablist');

        const innerTagsTabContent = document.createElement('div');
        innerTagsTabContent.classList.add('tab-content');

        let innerIndex = 0;
        for (const [innerKey, innerTags] of Object.entries(subTags)) {
            const innerNavItemId = `inner-tag-${containerIndex}-${mainIndex}-${innerIndex}`;
            const innerNavItem = document.createElement('a');
            innerNavItem.classList.add('nav-item', 'nav-link');
            innerNavItem.id = innerNavItemId + '-tab';
            innerNavItem.setAttribute('data-toggle', 'tab');
            innerNavItem.setAttribute('href', `#${innerNavItemId}`);
            innerNavItem.setAttribute('role', 'tab');
            innerNavItem.textContent = innerKey;

            const innerTabPane = document.createElement('div');
            innerTabPane.classList.add('tab-pane', 'fade');
            innerTabPane.id = innerNavItemId;
            innerTabPane.setAttribute('role', 'tabpanel');

            innerTags.forEach(tag => {
                const tagCheckbox = document.createElement('input');
                tagCheckbox.type = 'checkbox';
                tagCheckbox.value = tag;

                const tagLabel = document.createElement('label');
                tagLabel.textContent = tag;

                tagCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        textarea.value += this.value + ', ';
                    } else {
                        textarea.value = textarea.value.replace(this.value + ', ', '');
                    }
                });

                const checkboxContainer = document.createElement('div');
                checkboxContainer.appendChild(tagCheckbox);
                checkboxContainer.appendChild(tagLabel);

                innerTabPane.appendChild(checkboxContainer);
            });

            innerTagsNav.appendChild(innerNavItem);
            innerTagsTabContent.appendChild(innerTabPane);

            innerIndex++;
        }

        tabPane.appendChild(innerTagsNav);
        tabPane.appendChild(innerTagsTabContent);

        tagsTabContent.appendChild(tabPane);
        
        mainIndex++;
    }

    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('tagsContainer');
    tagsContainer.appendChild(tagsNav);
    tagsContainer.appendChild(tagsTabContent);

    return tagsContainer;
}