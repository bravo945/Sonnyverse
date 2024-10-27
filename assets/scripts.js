document.addEventListener('DOMContentLoaded', loadFileList);

function loadFileList() {
    const fileList = document.getElementById('fileList');
    
    // Clear placeholder items and add actual HTML files in `/vault`
    fileList.innerHTML = ''; 

    // List of file paths in the vault folder, adjust as needed
    const files = [
        'vault/file1.html',
        'vault/file2.html',
        // Add other HTML files manually here
    ];

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.replace(/^.*[\\/]/, '').replace('.html', ''); // Display file name
        listItem.onclick = () => loadFile(file);
        fileList.appendChild(listItem);
    });
}

function loadFile(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(content => {
            document.getElementById('content').innerHTML = content;
        })
        .catch(error => console.error('Error loading file:', error));
}
