const express = require('express')
const moment = require('moment')
const VersionOneRoutes = require('./v1.0/bdapi');

const router = express.Router();

/**
 * all versions and routes map. 
 * 
 * versions: object
 */
const allVersions = async (req, res) => {
    let routes = [];
    const routeUrl = req.protocol + '://' + req.get('host');

    const allRouts = await VersionOneRoutes.stack;
    allRouts.forEach((route) => {
        routes.push(routeUrl + route.route.path);
    });

    try {
        res.json({ status: { code: 200, message: "ok", date: moment().format() }, versions: { v1: routes } });
    } catch (err) {
        res.send(err);
    }
}

/**
 * version one and routes map. 
 * 
 * v1: array
 */
const VersionOne = async (req, res) => {
    let routes = [];
    const routeUrl = req.protocol + '://' + req.get('host');

    const allRouts = await VersionOneRoutes.stack;
    allRouts.forEach((route) => {
        routes.push(routeUrl + route.route.path);
    });

    try {
        res.json({ status: { code: 200, message: "ok", date: moment().format() }, v1: routes });
    } catch (err) {
        res.send(err);
    }
}

// endpoint: /api
router.get( '/api', allVersions);

// endpoint: /api
router.get( '/api/v1', VersionOne);


module.exports = router;
