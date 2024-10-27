document.addEventListener('DOMContentLoaded', loadFileList);

function loadFileList() {
    const fileList = document.getElementById('fileList');

    // Clear any placeholders
    fileList.innerHTML = ''; 

    // Define the list of HTML files in `/vault` manually
    const files = [
     //   'vault/file1.html',
     //   'vault/file2.html',
        // Add each file as needed in this list
    ];

    // Generate list items for each file
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.replace(/^.*[\\/]/, '').replace('.html', ''); // Just show filename without path
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
