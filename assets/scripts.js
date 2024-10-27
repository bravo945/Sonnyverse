document.addEventListener('DOMContentLoaded', () => {
    const fileListElement = document.getElementById('fileList');

    const files = [
        { name: "File 1", path: "vault/file1.html" },
        { name: "File 2", path: "vault/file2.html" }
        // Add more files manually here
    ];

    files.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = file.path;
        link.textContent = file.name;
        link.target = "_blank";
        listItem.appendChild(link);
        fileListElement.appendChild(listItem);
    });
});
