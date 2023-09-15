document.getElementById("loadButton").addEventListener("click", loadImages);

let globalTags = [];

window.onload = function() {
    fetchTags();
};

function fetchTags() {
    // This section commented for legacy purposes.
    // ----------------------------------------------------------------------------------------
    // The code below references a *.json file which is slightly more portable
    //   than a *.js file, being parsed as a file rather than held as a js constant.
    //   I made the decision to switch to *.js due to the content origin policy in most
    //   browsers refusing to load *.json files (and many other types) if the page is
    //   is not being presented from a server. I'd rather users not need to load this 
    //   program unnecessarily with a server when that would provide very little function 
    //   beyond circumventing this obstacle. This code will remain here in the event that 
    //   features are added in the future that do necessitate a server. This would 
    //   allow greater portability with other devs that may wish to use the tags in
    //   other apps.
    // ----------------------------------------------------------------------------------------
    // fetch('tags.json')
    // .then(response => response.json())
    // .then(data => {
    //     globalTags = data.tags;
    //     populateGlobalTags();
    // })
    // .catch(error => {
    //     console.error("Error fetching tags:", error);
    // });

    // loadedTags = tags.tags;
    // populateGlobalTags();
}

// function populateGlobalTags() {
//     const container = document.getElementById('globalTagsContainer');
    
//     loadedTags.forEach(tag => {
//         const tagButton = document.createElement('button');
        
//         tagButton.textContent = tag;
        
//         tagButton.addEventListener('click', function() {
//             const allCheckboxes = document.querySelectorAll(`input[type="checkbox"][value="${tag}"]`);
//             allCheckboxes.forEach(checkbox => {
//                 checkbox.checked = !checkbox.checked;
                
//                 // Simulate the change event to trigger our previous listener
//                 checkbox.dispatchEvent(new Event('change'));
//             });
//         });
        
//         container.appendChild(tagButton);
//     });
// }


function loadImages() {
    const input = document.getElementById('folderInput');
    const imageColumn = document.getElementById('imageColumn');

    // Clear previously loaded images
    imageColumn.innerHTML = '';

    const allFiles = Array.from(input.files);
    const imageFiles = allFiles.filter(file => /^image\//.test(file.type));
    const textFiles = allFiles.filter(file => /\.txt$/.test(file.name));

    imageFiles.forEach((file, imageIndex) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            const textarea = document.createElement('textarea');
            textarea.id = 'textarea-' + imageIndex;

            // Try to find the corresponding text file
            const textFilename = file.name.replace(/\.[^/.]+$/, ".txt");
            const textFile = textFiles.find(tf => tf.name === textFilename);
            if (textFile) {
                const textReader = new FileReader();
                textReader.onload = function(textEvent) {
                    textarea.value = textEvent.target.result;
                }
                textReader.readAsText(textFile);
            }

            // Create the tabbed tags container
            const tagsContainer = createTagsContainer(textarea, imageIndex);

            const imageRow = document.createElement('div');
            imageRow.classList.add('imageRow');
            imageRow.appendChild(img);
            imageRow.appendChild(textarea);
            imageRow.appendChild(tagsContainer);

            imageColumn.appendChild(imageRow);
        };

        reader.readAsDataURL(file);
    });
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


async function exportZip() {
    startLoadingAnimation();

    const zip = new JSZip();
    const imageColumn = document.getElementById('imageColumn');

    let textFileCount = 1;
    let imageFileCount = 1;

    // Function to get the image extension from its MIME type
    function getExtensionFromMimeType(dataURL) {
        const mimeType = dataURL.split(':')[1].split(';')[0];
        switch(mimeType) {
            case 'image/jpeg': return 'jpg';
            case 'image/png': return 'png';
            case 'image/gif': return 'gif';
            case 'image/webp': return 'webp';
            case 'image/bmp': return 'bmp';
            // ... add more mappings as needed
            default: return 'jpg'; // default to jpg
        }
    }
    
    const rows = Array.from(imageColumn.querySelectorAll('.imageRow'));

    // Generate random dataset batch number
    let randomFloat = Math.random();
    let batchNumber = Math.round(randomFloat * 1000000);
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const img = row.querySelector('img');
        const textarea = row.querySelector('textarea');

        const imageExtension = getExtensionFromMimeType(img.src);
        const base64Data = img.src.split(',')[1];
        const imageFilename = `${batchNumber}-${(i+1).toString().padStart(5, '0')}.${imageExtension}`;

        zip.file(imageFilename, base64Data, {base64: true, compression: "DEFLATE", compressionOptions: { level: 1 }});
        
        const textFilename = `${batchNumber}-${(i+1).toString().padStart(5, '0')}.txt`;
        const textBlob = new Blob([textarea.value], {type: "text/plain"});
        zip.file(textFilename, textBlob, {compression: "DEFLATE", compressionOptions: { level: 1 }});

        // Give control back to the browser for a frame to keep UI responsive.
        if (i % 10 === 0) { // Adjust this batch size as needed.
            await new Promise(resolve => setTimeout(resolve));
        }
    }

    const content = await zip.generateAsync({type: "blob"});
    const url = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = url;
    a.download = "exported_files.zip";
    a.click();

    URL.revokeObjectURL(url);

    stopLoadingAnimation();
}

let animationInterval;

function startLoadingAnimation() {
    const loadingElement = document.getElementById('loadingAnimation');
    loadingElement.style.display = 'inline';

    const frames = ['|', '/', '-', '\\'];
    let frameIndex = 0;
    
    animationInterval = setInterval(() => {
        loadingElement.textContent = frames[frameIndex];
        frameIndex = (frameIndex + 1) % frames.length; // This wraps the animation back to the start
    }, 200); // Adjust the interval for speed, this is set to 200ms between frames
}

function stopLoadingAnimation() {
    clearInterval(animationInterval);
    document.getElementById('loadingAnimation').style.display = 'none';
}