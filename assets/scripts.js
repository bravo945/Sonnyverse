// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Reference the elements after DOM is ready
    const fileListElement = document.getElementById("fileList");
    const contentElement = document.getElementById("content");

    // Function to load file list
    async function loadFileList() {
        try {
            const response = await fetch('/assets/files/files.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const fileList = await response.json();

            fileList.forEach(file => {
                const listItem = document.createElement('li');
                listItem.textContent = file;
                listItem.onclick = () => loadFile(file);
                fileListElement.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error loading file list:', error);
        }
    }

    // Function to load selected file
    async function loadFile(fileName) {
        try {
            const response = await fetch(`/vault/${fileName}`);
            if (!response.ok) throw new Error('Error loading file');
            const text = await response.text();
            contentElement.innerHTML = text;
        } catch (error) {
            console.error('Error loading file:', error);
        }
    }

    // Initialize the file list on load
    loadFileList();
});
