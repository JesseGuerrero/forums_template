const gen = require(appRoot + "/server/server-general");
const {request, response} = require("express");
const fs = require("fs");

module.exports = function(app) {
    app.get('/forum/subject', (request, response) => {

    })
    app.get('/forum/sample-subject', (request, response) => {
        response.render('sample_subject', { chat: gen.getChat() })
    })
    app.post('/test', (request, response) => {
        var jsonPath = appRoot + '/server/data/forum/subject1/thread1.json'
        console.log("yes")
        fs.writeFile(jsonPath, JSON.stringify(request.body), () => {})
    })
}