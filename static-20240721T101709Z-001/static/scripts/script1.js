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
