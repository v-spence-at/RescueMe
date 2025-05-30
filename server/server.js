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
        console.log('Data saved:', rescueModel);
        fs.writeFileSync(DATA_FILE, JSON.stringify(rescueModel, null, 2));
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

// Load data when the server starts
loadData();

// Parse urlencoded bodies
app.use(bodyParser.json());
app.use(express.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, '../client/files')));

app.get('/entries', function (req, res) {
    console.log(rescueModel);
    res.send(rescueModel.entries);
})

app.post('/add-entry', function (req, res) {
    if (req.body) {
        const entry = req.body;
        entry.ID = rescueModel.entries.length;
        console.log(entry);
        rescueModel.entries.push(entry);
        res.status(200).send({
            message: 'Entry updated successfully',
            entry: entry
        });
    } else {
        res.status(400).send("Invalid Input");
    }
});

app.delete('/entries/:entryId', (req, res) => {
    const entryId = parseInt(req.params.entryId, 10);
    const index = rescueModel.entries.findIndex(entry => entry.ID === entryId);

    if (index !== -1) {
        // Remove the entry from the array
        const entry = rescueModel.entries[index];
        rescueModel.entries.splice(index, 1);
        console.log("Deleted entry with id " + entry.ID);
        console.log("Updated entries:", rescueModel.entries);
        return res.status(200).json({ message: 'Entry deleted successfully' });
    } else {
        console.log("Entry not found");
        return res.status(404).json({ message: 'Entry not found' });
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
