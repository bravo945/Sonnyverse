// Load the file list from the `vault` folder
async function loadFileList() {
    try {
        const response = await fetch('./vault/files.json'); // Adjusted to /vault
        if (!response.ok) throw new Error('Network response was not ok');
        
        const fileList = await response.json();
        const fileListElement = document.getElementById('fileList');
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

// Load and display HTML content from the `/vault` folder
async function loadFile(fileName) {
    try {
        const response = await fetch(`./vault/${fileName}`);
        if (!response.ok) throw new Error('Error loading file');
        
        const htmlContent = await response.text();
        document.getElementById('content').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading file:', error);
    }
}

// Initialize file list on page load
document.addEventListener('DOMContentLoaded', loadFileList);
