const express = require('express')
const VersionOneRoutes = require('../api/v1/bdapi');

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
    // console.log(routes);

    try {
        res.json({ status: { code: 200, message: "ok" }, versions: { v1: routes } });
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
    // console.log(routes);

    try {
        res.json({ status: { code: 200, message: "ok" }, v1: routes });
    } catch (err) {
        res.send(err);
    }
}

// endpoint: /api
router.get( '/api', allVersions);
// endpoint: /api
router.get( '/api/v1', VersionOne);

module.exports = router;
