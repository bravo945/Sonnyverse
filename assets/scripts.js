async function loadFileList() {
    try {
        const response = await fetch('/assets/files/files.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const fileList = await response.json();
        const fileListElement = document.getElementById('fileList');
        fileListElement.innerHTML = ''; // Clear any existing placeholders

        fileList.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.title || file;
            listItem.onclick = () => loadFile(file.path || file);
            fileListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading file list:', error);
        // Provide a fallback option if file list cannot be loaded
        document.getElementById('fileList').innerHTML = `
            <li onclick="loadFile('file1.html')">File 1</li>
            <li onclick="loadFile('file2.html')">File 2</li>
        `;
    }
}

function loadFile(fileName) {
    const readerContent = document.getElementById('content');
    fetch(`/vault/${fileName}`)
        .then(response => {
            if (!response.ok) throw new Error('Error loading file');
            return response.text();
        })
        .then(htmlContent => {
            readerContent.innerHTML = htmlContent; // Insert HTML content
        })
        .catch(error => console.error('Error loading file:', error));
}

// Load file list on page load
document.addEventListener('DOMContentLoaded', loadFileList);
