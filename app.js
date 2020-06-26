const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const db_config = require('./db_config')

const app = express()

mongoose.connect(db_config.db_config, {useNewUrlParser: true});
mongoose.connection
  .once( 'open', () => console.log("connected") )
  .on( 'error', (error) => console.log(error) );

app
  .get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') })
  });

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
