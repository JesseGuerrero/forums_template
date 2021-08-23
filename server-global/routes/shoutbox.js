const fs = require('fs');

module.exports = function(app) {
    app.post('/shoutbox', (request, response) => {
        console.log(request.body["shoutbox"])
        if ("shoutbox" in request.body)
            fs.appendFile('shoutbox/chat.txt', request.body["shoutbox"] + "\n", () => {})
    })
}