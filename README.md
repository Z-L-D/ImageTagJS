# ImageTagJS
A simple HTML/JS based image tagger - no installation required


This is 100% functional although rough in appearance. You are currently on your own for creating your own list of tags. These are held in a single category JSON file called 'tags.js'. This will be further built out in the future.

<img src="ImageTagJS.png"/>

## Usage:

### Clone this repository:

```
   git clone https://github.com/Z-L-D/ImageTagJS.git
```

<ol>
    <li>Open index.html with your preferred browser. It should work with the vast majority.</li>
    <li>Press the Browse button and select your image dataset folder.</li>
    <li>You will be prompted by your browser to allow your images to be blobbed into memory. Press Upload.</li>
    <li>Press the Load Images button to insert them into the page.</li>
    <li>At the top of the column of images are the Global Tags buttons. Pressing these will add the tag to every image that is currently loaded. Pressing again will remove it from every image.</li>
    <li>Beside every image are the Local Tags buttons. Pressing these buttons will add the tag to only the adjacent image. Pressing again will remove the tag from the image. NOTE: If you have already added a Local Tag to an image, pressing the same tag in the Global Tags will remove the tag from this image while adding it to all others. Think competing light switches.</li>
    <li>After you have tagged your images, press the Export button at the top of the page. This will prompt or automatically download a zip file containing your complete dataset. This process will take several minutes if you have a lot of photos. NOTE: Images lose their file names in the process and are renamed to generic numbered named in the style 001, 002, 003... with an associated text file with the same number. </li>
</ol> 

## TODO:
<ul>
    <li>Organize tags into tabbed categories with extensive lists of items based on the categories: art medium, people, animals, poses, clothing, spaces, furnishings, objects, food, events</li>
    <li>Style the page</li>
    <li>Possibly explore adding functionality through Pica.js to add a max width and height and automatically perform a weighted average downscale if necessary.</li>
    <li>Possibly explore adding functionality through Pica.js to add a built in cropping function</li>
</ul>