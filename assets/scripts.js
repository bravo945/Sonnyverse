// Load the file list statically
async function loadFileList() {
    try {
        const response = await fetch('./files/files.json'); // Adjusted to a static JSON file path
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

// Load and display selected HTML files
async function loadFile(fileName) {
    try {
        const response = await fetch(`./files/${fileName}`);
        if (!response.ok) throw new Error('Error loading file');
        
        const htmlContent = await response.text();
        document.getElementById('content').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading file:', error);
    }
}

// Initialize the file list on page load
document.addEventListener('DOMContentLoaded', loadFileList);
