// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require('fs');
var util = require('util')

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Variables

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
let allNotes;

// Routes
// =============================================================
app.get("/", function (req,res) {
  res.sendFile(__dirname, "./public/index.html");
});

app.get("/notes", function (req,res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
 