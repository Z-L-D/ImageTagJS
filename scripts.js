document.getElementById("loadButton").addEventListener("click", loadImages);

let globalTags = [];

window.onload = function() {
    fetchTags();
};

function fetchTags() {
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
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const img = row.querySelector('img');
        const textarea = row.querySelector('textarea');

        const imageExtension = getExtensionFromMimeType(img.src);
        const base64Data = img.src.split(',')[1];
        const imageFilename = `${(i+1).toString().padStart(3, '0')}.${imageExtension}`;

        zip.file(imageFilename, base64Data, {base64: true, compression: "DEFLATE", compressionOptions: { level: 1 }});
        
        const textFilename = `${(i+1).toString().padStart(3, '0')}.txt`;
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