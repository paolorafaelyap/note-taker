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
app.use(express.static(path.join(__dirname, "./public")));

// Variables

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
let allNotes;

// Routes
// =============================================================
app.get("*", function (req,res) {
  res.sendFile(__dirname, "./public/index.html");
});

app.get("/notes", function (req,res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes/", function (req,res) {
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
    .then(function (data) {
        return res.json(JSON.parse(data)); 
    });
});

app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
      .then(function (data) {
          allNotes = JSON.parse(data);
          if (newNote.id || newNote.id === 0) {
              let note = allNotes[newNote.id];
              note.title = newNote.title;
              note.text = newNote.text;
          } else {
              allNotes.push(newNote);
          }
          writeFileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
              .then(function () {
                  console.log("Wrote db.json");
              })
      });
  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  var id = req.params.id;
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
      .then(function (data) {
          allNotes = JSON.parse(data);
          allNotes.splice(id, 1);
          writeFileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
              .then(function () {
                  console.log("Deleted db.json");
              })
      });
  res.json(id);
});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
 