const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const EXAMPLES_FOLDER = path.join(__dirname, 'examples');

function getExampleStructure(folderPath) {
    try {
        const examples = [];
        fs.readdirSync(folderPath).forEach(file => {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                const example = {
                    name: file,
                    path: path.join('examples', file),
                    files: [], // Initialize files array
                    subdirectories: getSubdirectories(filePath) // Call the function to get subdirectories recursively
                };
                // Fetch and include file names for the current directory
                const files = fs.readdirSync(filePath).filter(name => fs.statSync(path.join(filePath, name)).isFile());
                example.files = files;
                examples.push(example);
            }
        });
        console.log(examples)
        return examples;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

function getSubdirectories(folderPath) {
    const subdirectories = [];
    fs.readdirSync(folderPath).forEach(subfolder => {
        const subfolderPath = path.join(folderPath, subfolder);
        const stats = fs.statSync(subfolderPath);
        if (stats.isDirectory()) {
            subdirectories.push({
                name: subfolder,
                path: path.join('examples',path.relative(EXAMPLES_FOLDER, subfolderPath)),
                files: fs.readdirSync(subfolderPath).filter(name => fs.statSync(path.join(subfolderPath, name)).isFile()),
                subdirectories: getSubdirectories(subfolderPath) // Corrected recursive call
            });
        }
    });
    return subdirectories;
}



app.use(express.static(__dirname));


app.get('/examples', (req, res) => {
    const examples = getExampleStructure(EXAMPLES_FOLDER);
    console.log(EXAMPLES_FOLDER)
    res.json(examples);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
