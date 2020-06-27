const express = require('express')

const router = express.Router();

router
    .get('*', (req, res) => {
        res.json( { status: { code: 200, message: "nothing found" } } );
    });

module.exports = router;
