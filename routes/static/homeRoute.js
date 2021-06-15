const express = require('express')
const {homePage} = require('./controller')

const router = express.Router();

router.get('/', homePage);

module.exports = router;
