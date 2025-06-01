const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();
const shortId= require('shortid');
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'rescue-model.json');
const URL = "https://api.opencagedata.com/geocode/v1/json?key=477650a203ff446ba31a00fa8d53afdd&q=";

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
app.use(express.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, '../client/files')));

app.get('/entries', function (req, res) {
    console.log(rescueModel);
    res.send(rescueModel.entries);
})

app.post('/add-entry', function (req, res) {
    if (req.body) {
        const entry =  {
            ID: shortId.generate(),
            number: req.body.number,
            category: req.body.category,
            url: req.body.url
        };
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
    const entryId = req.params.entryId;
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

app.put('/entries', (req, res) => {
    if (req.body) {
        const entryInput = req.body;
        console.log("updating entry with ID " + entryInput.ID);
        const index = rescueModel.entries.findIndex(entry => entry.ID === entryInput.ID);
        if (index !== -1) { // we found it
            rescueModel.entries[index] = entryInput;
            console.log("Updated entries:", rescueModel.entries);
            return res.status(200).json({ message: 'Entry updated successfully' });
        } else {
            console.log("Entry not found");
            return res.status(404).json({ message: 'Entry not found' });
        }
    } else {
        res.status(400).send("Invalid Input");
    }
});

app.get('/address', function (req, res) {
    console.log(req.query);
    const query = req.query.query;
    if (query != null) {
        axios.get(URL + query)
            .then(response => {
                console.log(response.data.results[0]);
                const data =  {
                    "address" : response.data.results[0].formatted,
                    "url": response.data.results[0].annotations.OSM.url
                };
                res.json(data); // Send the response data back to the client
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400); // Send a 400 status code in case of an error
            });
    } else {
        console.log("No query parameter");
        res.sendStatus(400); // Send a 400 status code if no title is provided
    }

    //"https://api.opencagedata.com/geocode/v1/json?q=52.5432379%2C+13.4142133&key=477650a203ff446ba31a00fa8d53afdd"
}),


// Save data when the server shuts down
process.on('SIGINT', () => {
    saveData();
    process.exit();
});

process.on('SIGTERM', () => {
    saveData();
    process.exit();
});


const jwt = require('jsonwebtoken');

//very simple admin user so we can use JWT session management
const user = { id: 1, username: 'admin', password: "password" };


// Example login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username !== user.username || password !== user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(user, 'secret', { expiresIn: '1h' });
    res.json({ token }); // Send token back to client
});


app.listen(PORT, () => {
    console.log(`Server now running on http://localhost:${PORT}`);
});
