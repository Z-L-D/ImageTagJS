# ImageTagJS
HTML/JS based image tagger


This is 100% functional although rough in appearance. You are currently on your own for creating your own lit of tags. These are held in a single category JSON file called 'tags.json'. This will be further built out in the future.

Usage:

<ol>
    <li>Press the Browse button and select your image dataset folder.</li>
    <li>You will be prompted by your browser to allow your images to be blobbed into memory. Press Upload.</li>
    <li>Press the Load Images button to inser them into the page.</li>
    <li>At the top of the column of images is the Global Tags buttons. Pressing these will add the tag to ever image that is currently loaded. Pressing again will remove it from every image.</li>
    <li>Beside every image is the Local Tags buttons. Pressing these buttons will add the tag to only the adjacent image. Pressing again will remove the tag from the image. NOTE: If you have already added a local tag to an image, pressing the same tag in the Global Tags will remove the tag from this image while adding it to all others. Think competing light switches.</li>
    <li>After you have tagged your images, press the Export button at the top of the page. This will prompt or automatically download a zip file containing your complete data set. NOTE: Images lose their file names in the process and are renamed to generic 001, 002, 003... style names with the associated text file with the same number. This will be changed to random numbers in the future to prevent clashes with new images being added to the set.</li>
</ol> 

TODO:
<ul>
    <li>Search for already present text files associated with the images and insert the text</li>
    <li>Organize tags into tabbed categories with extensive lists of items based on the categories: art medium, people, animals, poses, clothing, spaces, furnishings, objects, food, events</li>
    <li>Randomize file names to prevent clashing with new data being added to a dataset</li>
    <li>Style the page</li>
</ul>