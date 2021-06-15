const express = require('express')
const path = require('path')
const fs = require('fs')

const router = express.Router();

const allDivisions = fs.readFileSync( path.dirname(require.main.filename) + '/views/demo-json/divisions.json', 'utf8' );
const divisionDetails = fs.readFileSync( path.dirname(require.main.filename) + '/views/demo-json/divisionDetails.json', 'utf8' );

router
    .get('/', (req, res) => {
		res.render('pages/index',
			{
				allDivisions: allDivisions,
				divisionDetails: divisionDetails
			}
		)
    });

module.exports = router;
