async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      headers: {
        Authorization: "Bearer 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"
      },
      method: "POST",
      body: JSON.stringify(data)
    }
  );
  const result = await response.blob();
  return result;
}

document
  .getElementById("imageInput")
  .addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const input = event.target;
  const outputImage = document.getElementById("outputImage");
  const outputContainer = document.getElementById("outputImageContainer");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      outputImage.src = e.target.result;
      outputContainer.style.display = "block";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

document.getElementById('enhance-btn').addEventListener('click', enhanceImage);

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



async function removeBackground() {
    const input = document.getElementById("imageInput");
    const outputImage = document.getElementById("outputImage");
    const outputContainer = document.getElementById("outputImageContainer");

    if (input.files && input.files[0]) {
        const formData = new FormData();
        formData.append("image_file", input.files[0]);
        formData.append("size", "auto");

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": "DUHjfg7qLFiDtDpTN8eMHxW6" // Replace with your API key
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.blob();
                outputImage.src = URL.createObjectURL(result);
                outputContainer.style.display = "block";
            } else {
                console.error("Background removal failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error processing image:", error);
        }
    }
}

  

async function convertToImage() {
  const textInput = document.getElementById("textInput").value;
  const textToImage = document.getElementById("textToImage");
  const textToImageContainer = document.getElementById("textToImageContainer");

  if (textInput.trim() !== "") {
    try {
      const imageData = await query({ inputs: textInput });
      const imageUrl = URL.createObjectURL(imageData);

      textToImage.src = imageUrl;
      textToImageContainer.style.display = "flex";
    } catch (error) {
      console.error("Error converting text to image:", error);
    }
  }
}
// Function to trigger download for background removed image
document.getElementById("downloadOutputImage").addEventListener("click", function () {
  const outputImage = document.getElementById("outputImage");
  const url = outputImage.src;
  const link = document.createElement("a");
  link.download = "background_removed_image.png";
  link.href = url;
  link.click();
});

// Function to trigger download for text to image
document.getElementById("downloadTextToImage").addEventListener("click", function () {
  const textToImage = document.getElementById("textToImage");
  const url = textToImage.src;
  const link = document.createElement("a");
  link.download = "text_to_image.png";
  link.href = url;
  link.click();
});
function downloadImage() {
  var img = document.getElementById("textToImage");
  var link = document.createElement("a");
  link.href = img.src;
  link.download = "generated_image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// Function to trigger download for enhanced image
document.getElementById("downloadEnhancementImage").addEventListener("click", function () {
  const enhancementImage = document.getElementById("enhancementImage");
  const url = enhancementImage.src;
  const link = document.createElement("a");
  link.download = "enhanced_image.png";
  link.href = url;
  link.click();
});
