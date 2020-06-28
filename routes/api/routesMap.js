const express = require('express')
const bdApiRoutes = require('../api/v1/bdapi');

const router = express.Router();

/**
 * version and routes map. 
 * 
 * v1: array
 */
const allVersions = async (req, res) => {
    let routes = [];
    const routeUrl = req.protocol + '://' + req.get('host');

    const allRouts = await bdApiRoutes.stack;
    allRouts.forEach((route) => {
        routes.push(routeUrl + route.route.path);
    });
    console.log(routes);

    try {
        res.json({ status: { code: 200, message: "ok" }, v1: routes });
    } catch (err) {
        res.send(err);
    }
}
// endpoint: /api
router.get( '/api', allVersions);

module.exports = router;
