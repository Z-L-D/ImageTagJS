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

    globalTags = tags.tags;
    populateGlobalTags();
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

    const allFiles = Array.from(input.files);
    const imageFiles = allFiles.filter(file => /^image\//.test(file.type));
    const textFiles = allFiles.filter(file => /\.txt$/.test(file.name));

    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            const textarea = document.createElement('textarea');

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
    startLoadingAnimation();

    // Initialize an object to store the files that will go into the ZIP.
    const files = {};

    const imageColumn = document.getElementById('imageColumn');

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
        
        // Convert base64 to Uint8Array
        const imageArrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        files[imageFilename] = imageArrayBuffer;

        const textFilename = `${batchNumber}-${(i+1).toString().padStart(5, '0')}.txt`;
        const textBlob = new Blob([textarea.value], {type: "text/plain"});
        
        // Convert Blob to Uint8Array
        const arrayBuffer = await textBlob.arrayBuffer();
        const textArrayBuffer = new Uint8Array(arrayBuffer);
        
        files[textFilename] = textArrayBuffer;

        // Give control back to the browser for a frame to keep UI responsive.
        if (i % 10 === 0) { // Adjust this batch size as needed.
            await new Promise(resolve => setTimeout(resolve));
        }
    }

    // Create ZIP using UZIP
    const zipData = UZIP.encode(files);

    const blob = new Blob([zipData], { type: "application/zip" });
    const url = URL.createObjectURL(blob);

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