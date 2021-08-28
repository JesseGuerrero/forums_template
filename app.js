const express = require('express')
const path = require('path')
const gen = require('./server/server-general')
global.appRoot = path.resolve(__dirname);


const app = express()
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'server/data')));

const port = 80

require(appRoot + "/server/startup")(app)

app.get(['/', '/whats-new'], (request, response) => {
    response.render('news')
})

app.listen(port, '0.0.0.0', ()=> console.log("Successful on port " + port))
