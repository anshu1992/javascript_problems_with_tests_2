/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const DIR_NAME = path.join(__dirname, 'files');


function readDirContents() {
  return new Promise((resolve, reject) => {
    fs.readdir(DIR_NAME, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  })
}

function readFile(filename) {
  filename = path.join(__dirname, 'files', filename);
  // console.log(filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve(data);
      }
    });
  })
}

app.get('/files', (req, res) => {
  readDirContents()
    .then(files => {
      res.status(200).json(files);
    })
    .catch(err => {
      res.status(500).send('Unable to read files due to internal server error');
    });
});

app.get('/file/:filename', (req, res) => {
  const name = req.params.filename;

  readFile(name)
    .then(data => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send('File not found');
      }
    })
    .catch(err => {
      res.status(500).send('Unable to read file due to internal server error');
    });
});

// Any other route is not found
app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

module.exports = app;
