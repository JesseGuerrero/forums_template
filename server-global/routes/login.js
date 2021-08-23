const fs = require('fs');
const global = require('../server-general')

module.exports = function(app) {
    app.post('/login', (request, response) => {
        console.log(request.body)
        if("login" in request.body)
            if (fs.existsSync('login/users/' + request.body['login']['username'] + '.json')) {
                console.log("user login")
            }
        if("create_user" in request.body) {
            var jsonPath = 'login/users/' + request.body['create_user']['username'] + '.json'
            if (fs.existsSync(jsonPath))
                console.log("user exists")
            else
                fs.writeFile(jsonPath, JSON.stringify(request.body['create_user']), () => {})
        }
    })

    app.get('/confirmaccount/*', (request, response) => {
        var username = request.url.replace('/confirmaccount/', '')
        username = global.decodeHash(username)
        var jsonPath = 'login/users/' + username + '.json'
        console.log(username)
        if(fs.existsSync(jsonPath)) {
            console.log("account exists")
            var userJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
            console.log(userJSON)
            userJSON['verified'] = true
            fs.writeFile(jsonPath, JSON.stringify(userJSON), () => {})
        }
        else
            console.log("account doesn't exist")
        response.render('index', { chat: global.getChat() })
    })
}