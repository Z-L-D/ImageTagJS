"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

document.getElementById("loadButton").addEventListener("click", loadImages);
var globalTags = [];

window.onload = function () {
  fetchTags();
};

function fetchTags() {} // This section commented for legacy purposes.
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
  imageFiles.forEach(function (file, imageIndex) {
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
      } // Create the tabbed tags container


      var tagsContainer = createTagsContainer(textarea, imageIndex);
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

function createTagsContainer(textarea, containerIndex) {
  var tagsNav = document.createElement('div');
  tagsNav.classList.add('nav', 'nav-tabs');
  tagsNav.id = "tags-tab-".concat(containerIndex);
  tagsNav.setAttribute('role', 'tablist');
  var tagsTabContent = document.createElement('div');
  tagsTabContent.classList.add('tab-content');
  tagsTabContent.id = "tags-tabContent-".concat(containerIndex);
  var index = 0;

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        mainKey = _Object$entries$_i[0],
        subTags = _Object$entries$_i[1];

    var navItem = document.createElement('a');
    navItem.classList.add('nav-item', 'nav-link');
    navItem.id = "tag-".concat(index, "-tab-").concat(containerIndex);
    navItem.setAttribute('data-toggle', 'tab');
    navItem.setAttribute('href', "#tag-".concat(index, "-").concat(containerIndex));
    navItem.setAttribute('role', 'tab');
    navItem.setAttribute('aria-controls', "tag-".concat(index, "-").concat(containerIndex));
    navItem.textContent = mainKey;
    tagsNav.appendChild(navItem);
    var tabPane = document.createElement('div');
    tabPane.classList.add('tab-pane', 'fade');
    tabPane.id = "tag-".concat(index, "-").concat(containerIndex);
    tabPane.setAttribute('role', 'tabpanel');
    tabPane.setAttribute('aria-labelledby', "tag-".concat(index, "-tab-").concat(containerIndex));
    subTags.forEach(function (tag) {
      var tagCheckbox = document.createElement('input');
      tagCheckbox.type = 'checkbox';
      tagCheckbox.value = tag;
      var tagLabel = document.createElement('label');
      tagLabel.textContent = tag;
      tagCheckbox.addEventListener('change', function () {
        if (this.checked) {
          textarea.value += this.value + ', ';
        } else {
          textarea.value = textarea.value.replace(this.value + ', ', '');
        }
      });
      var checkboxContainer = document.createElement('div');
      checkboxContainer.appendChild(tagCheckbox);
      checkboxContainer.appendChild(tagLabel);
      tabPane.appendChild(checkboxContainer);
    });
    tagsTabContent.appendChild(tabPane);
    index++;
  };

  for (var _i = 0, _Object$entries = Object.entries(tags); _i < _Object$entries.length; _i++) {
    _loop();
  }

  var tagsContainer = document.createElement('div');
  tagsContainer.classList.add('tagsContainer');
  tagsContainer.appendChild(tagsNav);
  tagsContainer.appendChild(tagsTabContent);
  return tagsContainer;
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