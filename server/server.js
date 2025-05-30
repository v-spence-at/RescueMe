const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'rescue-model.json');

let rescueModel;

// Load JSON data from the file on startup
function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        rescueModel = JSON.parse(data);
        console.log('Data loaded:', rescueModel);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        rescueModel = {}; // Initialize with an empty object if there's an error
    }
}

// Save JSON data to the file on shutdown
function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(rescueModel, null, 2));
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

// Load data when the server starts
loadData();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, '../client/files')));

app.get('/entries', function (req, res) {
    console.log(rescueModel);
    res.send(rescueModel.entries);
})

app.post('/entries', express.json(), function (req, res) {
    if (req.body) {
        console.log(req.body);
        rescueModel.entries = req.body;
        res.status(200).send({
            message: 'Categories updated successfully', entries: rescueModel.entries
        });
    } else {
        res.status(400).send("Invalid Input");
    }
});

// Save data when the server shuts down
process.on('SIGINT', () => {
    saveData();
    process.exit();
});

process.on('SIGTERM', () => {
    saveData();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server now running on http://localhost:${PORT}`);
});
