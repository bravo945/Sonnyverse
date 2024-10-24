const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const vaultPath = path.join(__dirname, 'Vault');

// Serve static files from the Vault directory
app.use('/Vault', express.static(vaultPath));

// Serve the index.html file on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get the list of Markdown files
app.get('/files', (req, res) => {
    fs.readdir(vaultPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Unable to scan Vault directory' });
        }
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        res.json(markdownFiles);
    });
});

// Endpoint to serve a specific Markdown file
app.get('/view/:filename', (req, res) => {
    const filePath = path.join(vaultPath, req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        const htmlContent = marked(data);
        res.send(htmlContent);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
