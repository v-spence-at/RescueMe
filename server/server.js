// Create a GET AllCategories
// Add a New Category
// Delete a New category

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rescueModel = require('./rescue-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, '../client/files')));

// Configure a 'get' endpoint for all categories
app.get('/categories', function (req, res) {
    res.send(Object.values(rescueModel.categories));
})


app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
