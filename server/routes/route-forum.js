const gen = require(appRoot + "/server/server-general");

module.exports = function(app) {
    app.get('/forum', (request, response) => {
        response.render('forum', { chat: gen.getChat() })
    })
}