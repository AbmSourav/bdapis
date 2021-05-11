const express = require('express')
const moment = require('moment')
const Version10Routes = require('./v1.0/bdapi');
const Version11Routes = require('./v1.1/bdapi');

const router = express.Router();

const getVersionRoutes = (baseUrl, stact, versionNumber) => {
	const version = {};
	version[versionNumber] = [];

	stact.forEach( (route, index) => {
		version[versionNumber][index] = baseUrl + route.route.path
	} );

	return version;
}

/**
 * helper function for response
 * 
 * @param res response object
 * @param data string|object|array
 */
const printData = (res, data) => {
	const response = {};
	
	let dateTime = new Date();
	dateTime = dateTime.toGMTString();

	response['status'] = { code: 200, message: "ok", date: dateTime };
	response['data'] = data;

    try {
        res.json(response);
    } catch (err) {
        res.send(err);
    }
}

/**
 * callback function for `/api`
 * 
 * @param req request object
 * @param res response object
 */
const allVersions = async (req, res) => {
    const routeUrl = req.protocol + '://' + req.get('host');

    const v10Stack = await Version10Routes.stack;
	const v11Stack = await Version11Routes.stack;
	const v10Routes = getVersionRoutes(routeUrl, v10Stack, 'v1.0');
	const v11Routes = getVersionRoutes(routeUrl, v11Stack, 'v1.1');

	printData(res, [ v10Routes, v11Routes ]);
}

/**
 * callback function for `/v1.0`
 * 
 * @param req request object
 * @param res response object
 */
const version10 = async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');

    const v10Stack = await Version10Routes.stack;
	const v10Routes = getVersionRoutes(baseUrl, v10Stack, 'v1.0');

    printData(res, v10Routes);
}

/**
 * callback function for `/v1.1`
 * 
 * @param req request object
 * @param res response object
 */
 const version11 = async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');

    const v11Stack = await Version11Routes.stack;
	const v11Routes = getVersionRoutes(baseUrl, v11Stack, 'v1.1');

	printData(res, v11Routes);
}

// endpoint: /api
router.get( '/api', allVersions);

// endpoint: /api
router.get( '/api/v1.0', version10);
router.get( '/api/v1.1', version11);


module.exports = router;
