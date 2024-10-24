// scripts.js

// Load the file list dynamically
async function loadFileList() {
    try {
        const response = await fetch('/files'); // Adjust the endpoint if necessary
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

// Load and display the selected file
async function loadFile(fileName) {
    try {
        const response = await fetch(`/files/${fileName}`);
        if (!response.ok) throw new Error('Error loading file');

        const text = await response.text();
        const htmlContent = marked.parse(text); // Use marked.parse to convert Markdown to HTML
        document.getElementById('content').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading file:', error);
    }
}

// Initialize the file list
document.addEventListener('DOMContentLoaded', () => {
    loadFileList();
});
