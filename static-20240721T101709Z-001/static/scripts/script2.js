document.getElementById('enhance-btn').addEventListener('click', enhanceImage);
//document.getElementById('upload-label').addEventListener('click', function() {
    document.getElementById('image-input').click();
//});


function enhanceImage() {
    var input = document.getElementById('image-input');
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var inputImage = new Image();
            inputImage.onload = function() {
                var canvas = document.getElementById('output-canvas');
                var ctx = canvas.getContext('2d');

                // Set canvas dimensions
                canvas.width = inputImage.width;
                canvas.height = inputImage.height;

                // Draw image onto canvas
                ctx.drawImage(inputImage, 0, 0);

                // Image enhancement logic (brightness and contrast)
                var brightnessValue = parseInt(document.getElementById('brightness-range').value);
                var contrastValue = parseInt(document.getElementById('contrast-range').value);

                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;

                for (var i = 0; i < data.length; i += 4) {
                    data[i] += brightnessValue; // Red
                    data[i + 1] += brightnessValue; // Green
                    data[i + 2] += brightnessValue; // Blue

                    data[i] = (data[i] - 128) * (contrastValue / 100) + 128; // Red
                    data[i + 1] = (data[i + 1] - 128) * (contrastValue / 100) + 128; // Green
                    data[i + 2] = (data[i + 2] - 128) * (contrastValue / 100) + 128; // Blue
                } 

                ctx.putImageData(imageData, 0, 0);

                // Show enhanced image
                canvas.style.display = 'block';
            };
            inputImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Get the download button element
var downloadButton = document.getElementById("downloadEnhancerImage");

// Add a click event listener to the download button
downloadButton.addEventListener("click", function() {
    // Get the enhanced image element
    var enhancedImage = document.getElementById("output-canvas");

    // Convert the enhanced image to a data URL
    var imageDataURL = enhancedImage.toDataURL("image/png");

    // Create a temporary anchor element
    var tempAnchor = document.createElement("a");

    // Set the href attribute of the anchor to the data URL
    tempAnchor.href = imageDataURL;

    // Set the download attribute to the desired filename
    tempAnchor.download = "enhanced_image.png";

    // Programmatically click the anchor to trigger the download
    tempAnchor.click();
});

function scrollToElement(className) {
    var element = document.querySelector(className);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

  