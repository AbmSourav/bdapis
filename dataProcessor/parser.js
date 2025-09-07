const path = require("path");
const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath =  path.join(__dirname, 'resource/v1.1.csv');
const outputJsonPath = path.join(__dirname, 'resource/v1.1.json');

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        console.log('Converted JSON data:', jsonObj);

        // Optional: Save the JSON data to a file
        fs.writeFile(outputJsonPath, JSON.stringify(jsonObj, null, 2), (err) => {
          if (err) {
            console.error('Error writing JSON to file:', err);
          } else {
            console.log('JSON data saved to:', outputJsonPath);
          }
        });
    })
    .catch((err) => {
        console.error('Error converting CSV to JSON:', err);
    });
