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


function createTagsContainer(textarea, containerIndex) {
    let tagsContainerHTML = '<div class="tagsContainer">';

    let tagsNavHTML = '<div class="nav nav-tabs" role="tablist">';
    let tagsTabContentHTML = '<div class="tab-content">';

    let mainIndex = 0;

    for (const [mainKey, subTags] of Object.entries(tags)) {
        tagsNavHTML += `
            <a class="nav-item nav-link" id="tag-${mainIndex}-tab-${containerIndex}"
            data-toggle="tab" href="#tag-${mainIndex}-${containerIndex}" role="tab">
                ${mainKey}
            </a>
        `;

        let tabPaneHTML = `<div class="tab-pane fade" id="tag-${mainIndex}-${containerIndex}" role="tabpanel">`;
        let innerTagsNavHTML = '<div class="nav nav-tabs" role="tablist">';
        let innerTagsTabContentHTML = '<div class="tab-content">';

        let innerIndex = 0;

        for (const [innerKey, innerTags] of Object.entries(subTags)) {
            innerTagsNavHTML += `
                <a class="nav-item nav-link" id="inner-tag-${containerIndex}-${mainIndex}-${innerIndex}-tab"
                data-toggle="tab" href="#inner-tag-${containerIndex}-${mainIndex}-${innerIndex}" role="tab">
                    ${innerKey}
                </a>
            `;

            let innerTabPaneHTML = `<div class="tab-pane fade" id="inner-tag-${containerIndex}-${mainIndex}-${innerIndex}" role="tabpanel">`;

            innerTags.forEach(tag => {
                innerTabPaneHTML += `
                    <div>
                        <input type="checkbox" value="${tag}" id="checkbox-${tag}" 
                        onchange="handleCheckboxChange(this, '${textarea.id}')">
                        <label>${tag}</label>
                    </div>
                `;
            });

            innerTabPaneHTML += '</div>';
            innerTagsTabContentHTML += innerTabPaneHTML;

            innerIndex++;
        }

        innerTagsNavHTML += '</div>';
        innerTagsTabContentHTML += '</div>';
        tabPaneHTML += innerTagsNavHTML + innerTagsTabContentHTML + '</div>';

        tagsTabContentHTML += tabPaneHTML;
        mainIndex++;
    }

    tagsNavHTML += '</div>';
    tagsTabContentHTML += '</div>';

    tagsContainerHTML += tagsNavHTML + tagsTabContentHTML + '</div>';

    const tagsContainer = document.createElement('div');
    tagsContainer.insertAdjacentHTML('beforeend', tagsContainerHTML);

    return tagsContainer;
}

function handleCheckboxChange(element, textareaId) {
    console.log('checkbox clicked')
    const textarea = document.getElementById(textareaId);
    if (element.checked) {
        textarea.value += element.value + ', ';
    } else {
        textarea.value = textarea.value.replace(element.value + ', ', '');
    }
}