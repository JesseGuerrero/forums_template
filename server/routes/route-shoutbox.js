const fs = require('fs');

module.exports = function(app) {
    app.get('/shoutbox/chat', (req, res) => {
        let chat = fs.readFileSync('server/data/chat.txt').toString()
        res.send(chat)
    })
    app.post('/shoutbox', (request, response) => {
        console.log(request.body["shoutbox"])
        if ("shoutbox" in request.body)
            fs.appendFile('server/data/chat.txt', request.body["shoutbox"] + "\n", () => {})
    })
}