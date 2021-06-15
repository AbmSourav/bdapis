const fs = require('fs')
const path = require('path')

const homePage = (req, res) => {
	const allDivisions = fs.readFileSync( path.dirname(require.main.filename) + '/views/demo-json/divisions.json', 'utf8' );
	const divisionDetails = fs.readFileSync( path.dirname(require.main.filename) + '/views/demo-json/divisionDetails.json', 'utf8' );

	const data = { allDivisions: allDivisions, divisionDetails: divisionDetails }
	res.render('pages/index', data)
}

module.exports = {homePage}
