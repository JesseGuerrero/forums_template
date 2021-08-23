const express = require('express')
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const global = require('./server-global/server-general')

const app = express()
const port = 80

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'shoutbox')));
app.use(express.static(path.join(__dirname, 'login')));
app.use(express.static(path.join(__dirname, 'client-global')));
app.use(bodyParser.json());

function getChat() {
    var chatString = fs.readFileSync('shoutbox/chat.txt', 'utf8')
    return chatString.toString().replace(/\n*$/, "")
}

app.get('/', (request, response) => {
    console.log(getChat())
    response.render('index', { chat: getChat() })
})

app.post('/', (request, response) => {
    console.log(request.body)
    if("shoutbox" in request.body)
        fs.appendFile('shoutbox/chat.txt', request.body["shoutbox"] + "\n", ()=>{})
    if("login" in request.body)
        if (fs.existsSync('login/users/' + request.body['login']['username'] + '.json')) {
            alert("user exists")
        }
    if("create_user" in request.body)
        if(fs.existsSync('login/users/' + request.body['create_user']['username'] + '.json'))
            alert("user exists")
        else
            fs.writeFileSync('login/users/' + request.body['create_user']['username'] + '.json', JSON.stringify(request.body['create_user']), () => {})
})

app.get('/confirmaccount/*', (request, response) => {
    var username = request.url.replace('/confirmaccount/', '')
    console.log(global.decodeHash(username))
    response.render('index', { chat: getChat() })
})

app.listen(port, '0.0.0.0', ()=> console.log("Successful on port " + port))