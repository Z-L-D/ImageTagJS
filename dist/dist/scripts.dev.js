"use strict";

document.getElementById("loadButton").addEventListener("click", loadImages);
var globalTags = [];

window.onload = function () {
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
  var container = document.getElementById('globalTagsContainer');
  globalTags.forEach(function (tag) {
    var tagButton = document.createElement('button');
    tagButton.textContent = tag;
    tagButton.addEventListener('click', function () {
      var allCheckboxes = document.querySelectorAll("input[type=\"checkbox\"][value=\"".concat(tag, "\"]"));
      allCheckboxes.forEach(function (checkbox) {
        checkbox.checked = !checkbox.checked; // Simulate the change event to trigger our previous listener

        checkbox.dispatchEvent(new Event('change'));
      });
    });
    container.appendChild(tagButton);
  });
}

function loadImages() {
  var input = document.getElementById('folderInput');
  var imageColumn = document.getElementById('imageColumn'); // Clear previously loaded images

  imageColumn.innerHTML = '';
  var allFiles = Array.from(input.files);
  var imageFiles = allFiles.filter(function (file) {
    return /^image\//.test(file.type);
  });
  var textFiles = allFiles.filter(function (file) {
    return /\.txt$/.test(file.name);
  });
  imageFiles.forEach(function (file) {
    var reader = new FileReader();

    reader.onload = function (event) {
      var img = new Image();
      img.src = event.target.result;
      var textarea = document.createElement('textarea'); // Try to find the corresponding text file

      var textFilename = file.name.replace(/\.[^/.]+$/, ".txt");
      var textFile = textFiles.find(function (tf) {
        return tf.name === textFilename;
      });

      if (textFile) {
        var textReader = new FileReader();

        textReader.onload = function (textEvent) {
          textarea.value = textEvent.target.result;
        };

        textReader.readAsText(textFile);
      }

      var tagsContainer = document.createElement('div');
      tagsContainer.classList.add('tagsContainer');
      globalTags.forEach(function (tag) {
        var tagLabel = document.createElement('label');
        var tagCheckbox = document.createElement('input');
        tagCheckbox.type = 'checkbox';
        tagCheckbox.value = tag;
        tagCheckbox.addEventListener('change', function () {
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
      var imageRow = document.createElement('div');
      imageRow.classList.add('imageRow');
      imageRow.appendChild(img);
      imageRow.appendChild(textarea);
      imageRow.appendChild(tagsContainer);
      imageColumn.appendChild(imageRow);
    };

    reader.readAsDataURL(file);
  });
}

function exportZip() {
  var zip, imageColumn, textFileCount, imageFileCount, getExtensionFromMimeType, rows, i, row, img, textarea, imageExtension, base64Data, imageFilename, textFilename, textBlob, content, url, a;
  return regeneratorRuntime.async(function exportZip$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          getExtensionFromMimeType = function _ref(dataURL) {
            var mimeType = dataURL.split(':')[1].split(';')[0];

            switch (mimeType) {
              case 'image/jpeg':
                return 'jpg';

              case 'image/png':
                return 'png';

              case 'image/gif':
                return 'gif';

              case 'image/webp':
                return 'webp';

              case 'image/bmp':
                return 'bmp';
              // ... add more mappings as needed

              default:
                return 'jpg';
              // default to jpg
            }
          };

          startLoadingAnimation();
          zip = new JSZip();
          imageColumn = document.getElementById('imageColumn');
          textFileCount = 1;
          imageFileCount = 1; // Function to get the image extension from its MIME type

          rows = Array.from(imageColumn.querySelectorAll('.imageRow'));
          i = 0;

        case 8:
          if (!(i < rows.length)) {
            _context.next = 25;
            break;
          }

          row = rows[i];
          img = row.querySelector('img');
          textarea = row.querySelector('textarea');
          imageExtension = getExtensionFromMimeType(img.src);
          base64Data = img.src.split(',')[1];
          imageFilename = "".concat((i + 1).toString().padStart(3, '0'), ".").concat(imageExtension);
          zip.file(imageFilename, base64Data, {
            base64: true,
            compression: "DEFLATE",
            compressionOptions: {
              level: 1
            }
          });
          textFilename = "".concat((i + 1).toString().padStart(3, '0'), ".txt");
          textBlob = new Blob([textarea.value], {
            type: "text/plain"
          });
          zip.file(textFilename, textBlob, {
            compression: "DEFLATE",
            compressionOptions: {
              level: 1
            }
          }); // Give control back to the browser for a frame to keep UI responsive.

          if (!(i % 10 === 0)) {
            _context.next = 22;
            break;
          }

          _context.next = 22;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve);
          }));

        case 22:
          i++;
          _context.next = 8;
          break;

        case 25:
          _context.next = 27;
          return regeneratorRuntime.awrap(zip.generateAsync({
            type: "blob"
          }));

        case 27:
          content = _context.sent;
          url = URL.createObjectURL(content);
          a = document.createElement('a');
          a.href = url;
          a.download = "exported_files.zip";
          a.click();
          URL.revokeObjectURL(url);
          stopLoadingAnimation();

        case 35:
        case "end":
          return _context.stop();
      }
    }
  });
}

var animationInterval;

function startLoadingAnimation() {
  var loadingElement = document.getElementById('loadingAnimation');
  loadingElement.style.display = 'inline';
  var frames = ['|', '/', '-', '\\'];
  var frameIndex = 0;
  animationInterval = setInterval(function () {
    loadingElement.textContent = frames[frameIndex];
    frameIndex = (frameIndex + 1) % frames.length; // This wraps the animation back to the start
  }, 200); // Adjust the interval for speed, this is set to 200ms between frames
}

function stopLoadingAnimation() {
  clearInterval(animationInterval);
  document.getElementById('loadingAnimation').style.display = 'none';
}