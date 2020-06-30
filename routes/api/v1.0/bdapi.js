const express = require('express')
const {allDivisions, allDistricts, queryByDivision} = require('./controller');

const router = express.Router();

const routeNameSpace = "/api"
const apiVersionOne = "/v1.0"
const routePrefix = routeNameSpace + apiVersionOne

// endpoint: /api/v1.0/divisions
router.get( routePrefix + '/divisions', allDivisions);

// endpoint: /api/v1.0/districts
router.get( routePrefix + '/districts', allDistricts);

// endpoint: /api/v1.0/division/:divisionName
router.get( routePrefix + '/division/:divisionName', queryByDivision);

module.exports = router;
