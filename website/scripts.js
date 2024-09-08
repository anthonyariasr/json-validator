// Helper function to display messages
const displayMessage = (elementId, message) => {
    document.getElementById(elementId).innerText = message;
};

// Function to handle file upload
const handleFileUpload = async (event) => {
    event.preventDefault(); // Prevent form submission

    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    // Client-side validation
    if (!file) {
        alert("Please select a file.");
        return;
    }

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("Please select a file with .json extension.");
        return;
    }

    if (file.size > 1 * 1024 * 1024) { // 1MB
        alert("The file exceeds the maximum allowed size of 1MB.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    displayMessage("response", "Uploading file...");

    try {
        const response = await fetch("http://127.0.0.1:8000/upload/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            displayMessage("response", result.message);
        } else {
            displayMessage("response", result.detail || "Error uploading the file.");
        }
    } catch (error) {
        displayMessage("response", "Error uploading the file.");
        console.error("Error:", error);
    }
};

// Function to handle file validation
const handleFileValidation = async () => {
    displayMessage("response", "Validating files...");
    document.getElementById("validation-results").innerHTML = "";

    try {
        const response = await fetch("http://127.0.0.1:8000/validate/", {
            method: "GET",
        });

        const result = await response.json();

        if (response.ok) {
            const output = result.results.map(
                (file) => `<li><strong>${file.filename}</strong> - Size: ${file.size} bytes - Status: ${file.status}</li>`
            ).join("");

            document.getElementById("validation-results").innerHTML = `<ul>${output}</ul>`;
            displayMessage("response", "Validation completed.");
        } else {
            displayMessage("response", "Error during validation.");
        }
    } catch (error) {
        displayMessage("response", "Error validating the files.");
        console.error("Error:", error);
    }
};

// Event listeners
document.getElementById("upload-form").addEventListener("submit", handleFileUpload);
document.getElementById("validate-button").addEventListener("click", handleFileValidation);
