# ImageTagJS
A simple HTML/JS based image tagger - no installation required


ImageTagJS is an image tagging/captioning/annotating software that can be fully run in the browser, no other installations necessary. All you need to do is to supply a folder of images, tag your images and hit export to get a zipped file of your dataset.

<img src="ImageTagJS.png"/>

## Features
* Runs in nearly all modern browsers
* Supports all major image formats.
* Provides a zipped archive of your dataset for easy storage
* Can import image-text dataset pairs to rapidly review auto generated tags
* Built in extensive library of organized tags.

## Usage:

For the latest, clone this repository:

```
   git clone https://github.com/Z-L-D/ImageTagJS.git
```

1. Open index.html in the dist folder with your preferred browser. It should work with the vast majority.
1. Press the Browse button and select your image dataset folder.
1. You will be prompted by your browser to allow your images to be blobbed into memory. Press Upload. *( [Read Here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory) for further details in how this process works. )*
1. Press the Load Images button to insert them into the page.
1. Beside every image are the Local Tags buttons. Pressing these buttons will add the tag to only the adjacent image. Pressing again will remove the tag from the image.
1. After you have tagged your images, press the Export button at the top of the page. This will prompt or automatically download a zip file containing your complete dataset. This process will take several minutes if you have a lot of photos. NOTE: Imported images don't retain their original file names and are renamed a batch number and image number name with an associated text file with the same name.

## Upcoming features
* Incorporate smartcrop.js for content aware cropping
* Incorporate pica.js for alias safe downscaling
* Incorporate global tagging as a user generated content area from a text box
* Incorporate an image converter that allows the user to select the exported format - either JPG or PNG - useful for webp images
* Incorporate an easy way to build and modify a custom tag library that can be alternately used instead of the built in library
* Incorporate the ability to load zipped datasets.
* Incorporate checkboxes next to images to allow enabling or disabling inclusion into the dataset.

## Current Issues:
* Imported tags aren't checked against the tags library
* The current layout does not work well with screens under 1280px wide at this time
* Zipped file should use batch number in filename