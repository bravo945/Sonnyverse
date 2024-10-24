const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list markdown files in /public/files
app.get('/public/files', (req, res) => {
    const filesDir = path.join(__dirname, 'public', 'files');
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read files' });
        }
        res.json(files.filter(file => file.endsWith('.md')));
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
