// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const documentFile = params.get('document');

    if (documentFile) {
        loadMarkdownFile(`/vault/${documentFile}`);
    }
});

function loadMarkdownFile(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(markdown => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = marked(markdown);
        })
        .catch(error => {
            console.error('Error fetching markdown file:', error);
            document.getElementById('content').textContent = 'Failed to load document.';
        });
}
