const express = require('express')
const path = require('path')

const app = express()

app
  .get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') })
  });

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
