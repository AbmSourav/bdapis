const express = require('express')
const mongoose = require('mongoose')

const router = express.Router();

const schema = new mongoose.Schema({_id: Number})  
const dbData = mongoose.model('bdapi_data', schema, 'bdapi_data');

router
    .get( '/divisions', async (req, res) => {
        const api = await dbData.find({division: "Dhaka"});
        try {
            res.json({ status: { code: 200, message: "ok" }, data: api });
        } catch (err) {
            res.send(err);
        }
    });

module.exports = router;
