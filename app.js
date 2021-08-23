const express = require('express')
const path = require('path')
const global = require('./server-global/server-general')

const app = express()
app.use(express.static(path.join(__dirname, 'shoutbox')));
app.use(express.static(path.join(__dirname, 'login')));
app.use(express.static(path.join(__dirname, 'client-global')));
const port = 80

require("./server-global/startup")(app)

app.get('/', (request, response) => {
    console.log(global.getChat())
    response.render('index', { chat: global.getChat() })
})

app.listen(port, '0.0.0.0', ()=> console.log("Successful on port " + port))
