document.getElementById("loadButton").addEventListener("click", loadImages);

let globalTags = [];

window.onload = function() {
    fetchTags();
};

function fetchTags() {
    fetch('tags.json')
    .then(response => response.json())
    .then(data => {
        globalTags = data.tags;
        populateGlobalTags();
    })
    .catch(error => {
        console.error("Error fetching tags:", error);
    });
}

function populateGlobalTags() {
    const container = document.getElementById('globalTagsContainer');
    
    globalTags.forEach(tag => {
        const tagButton = document.createElement('button');
        
        tagButton.textContent = tag;
        
        tagButton.addEventListener('click', function() {
            const allCheckboxes = document.querySelectorAll(`input[type="checkbox"][value="${tag}"]`);
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
                
                // Simulate the change event to trigger our previous listener
                checkbox.dispatchEvent(new Event('change'));
            });
        });
        
        container.appendChild(tagButton);
    });
}


function loadImages() {
    const input = document.getElementById('folderInput');
    const imageColumn = document.getElementById('imageColumn');

    // Clear previously loaded images
    imageColumn.innerHTML = '';

    // Filter only image files
    const imageFiles = Array.from(input.files).filter(file => /^image\//.test(file.type));

    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            const textarea = document.createElement('textarea');

            const tagsContainer = document.createElement('div');
            tagsContainer.classList.add('tagsContainer');

            globalTags.forEach(tag => {
                const tagLabel = document.createElement('label');
                const tagCheckbox = document.createElement('input');
                        
                tagCheckbox.type = 'checkbox';
                tagCheckbox.value = tag;
                        
                tagCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        // Append tag text
                        textarea.value += this.value + ', ';
                    } else {
                        // Remove tag text
                        textarea.value = textarea.value.replace(this.value + ', ', '');
                    }
                });
                
                tagLabel.appendChild(tagCheckbox);
                tagLabel.appendChild(document.createTextNode(tag));
            
                tagsContainer.appendChild(tagLabel);
            });

        
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

async function exportZip() {
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

    // Loop over each image row to process the image and textarea
    imageColumn.querySelectorAll('.imageRow').forEach(row => {
        const img = row.querySelector('img');
        const textarea = row.querySelector('textarea');

        const imageExtension = getExtensionFromMimeType(img.src);

        // Add the image to the zip (assuming base64 encoded data)
        const base64Data = img.src.split(',')[1];
        const imageFilename = `${imageFileCount.toString().padStart(3, '0')}.${imageExtension}`;
        zip.file(imageFilename, base64Data, {base64: true});
        imageFileCount++;

        // Add the textarea content to a text file in the zip
        const textFilename = `${textFileCount.toString().padStart(3, '0')}.txt`;
        const textBlob = new Blob([textarea.value], {type: "text/plain"});
        zip.file(textFilename, textBlob);
        textFileCount++;
    });

    // Generate the zip file and offer it for download
    const content = await zip.generateAsync({type: "blob"});
    const url = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = url;
    a.download = "exported_files.zip";
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
}


