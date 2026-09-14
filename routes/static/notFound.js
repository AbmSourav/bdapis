const express = require('express')

const router = express.Router();

router
    .get('*', (req, res) => {
        res.status(404).json( { status: { code: 404, message: "nothing found" } } );
    });

module.exports = router;
