const express = require('express')
const {allDivisions, allDistricts, queryByDivision, queryByDistrict} = require('./controller');

const router = express.Router();

const routeNameSpace = "/api"
const apiVersionOne = "/v1.2"
const routePrefix = routeNameSpace + apiVersionOne

// endpoint: /api/v1.2/divisions
router.get( routePrefix + '/divisions', allDivisions);

// endpoint: /api/v1.2/districts
router.get( routePrefix + '/districts', allDistricts);

// endpoint: /api/v1.2/division/:divisionName
router.get( routePrefix + '/division/:divisionName', queryByDivision);

// endpoint: /api/v1.2/district/:districtName
router.get( routePrefix + '/district/:districtName', queryByDistrict);

module.exports = router;
