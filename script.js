const uploadInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadZip');
const loader = document.getElementById('loader');
let zip = new JSZip();
let imageCount = 0;

uploadInput.addEventListener('change', function(event) {
  const files = event.target.files;
  const width = parseInt(document.getElementById('width').value, 10);
  const height = parseInt(document.getElementById('height').value, 10);
  zip = new JSZip(); // Reset the zip file
  imageCount = 0;

  if (files.length > 0) {
    loader.style.display = 'block';
    downloadButton.style.display = 'none';
  }

  Array.from(files).forEach((file, index) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(function(blob) {
            if (files.length === 1) {
              // Single file - direct download
              saveAs(blob, `resized_image.jpg`);
              loader.style.display = 'none';
            } else {
              // Multiple files - add to zip
              zip.file(`image${index}.jpg`, blob);
              imageCount++;

              if (imageCount === files.length) {
                loader.style.display = 'none';
                downloadButton.style.display = 'block';
              }
            }
          }, 'image/jpeg');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('File is not an image:', file);
    }
  });
});

downloadButton.addEventListener('click', function() {
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    saveAs(content, 'resized_images.zip');
  });
});
