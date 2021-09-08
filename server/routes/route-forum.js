const gen = require(appRoot + "/server/server-general");
const {request, response} = require("express");
const fs = require("fs");

module.exports = function(app) {
    app.get('/forum/subject', (request, response) => {

    })
    app.get('/forum/sample-posting', (request, response) => {
        response.render('posting_listing', { chat: gen.getChat() })
    })
    app.get('/test/:test', (request, response) => {
        response.send(request.params.test.toString().strURLToHex())
    })
    app.post('/postpost', (request, response) => {
        let url = request.headers.referer
        let topic, subject, title;
        [topic, subject, title] = [1, 4, 1]
        console.log(topic)
        console.log(subject)
        console.log(title)
    })
    generateForums(app)
    app.get('/forum/:topic/:subjects', (request, response) => {
        let thread_listing = JSON.parse(fs.readFileSync(getSubjectPath(request.params.topic, request.params.subjects) + "\\threads.json", 'utf8'))
        response.render('thread_listing', { chat: gen.getChat(), threads: thread_listing })
    })
    app.get('/forum/:topic/:subjects/:threadno/:author/:title/:pageno', (request, response) => {
        console.log(request.params.topic)
        console.log(request.params.subjects)
        let thread_listing = JSON.parse(fs.readFileSync(getSubjectPath(decodeURI(request.params.topic), decodeURI(request.params.subjects)) + "\\threads.json", 'utf8'))
        response.render('posting_listing', { chat: gen.getChat(), threads: thread_listing, threadno: request.params.threadno })
    })
}

function generateForums(app) {
    var path = appRoot+"/server/data/forum"
    var topicsJSON = JSON.parse(fs.readFileSync(path + '/subject_list.json', 'utf8'))
    for(var topic in topicsJSON['topics']) {
        var topicPath = path+"/"+topic.strToPathURLFriendly()
        if(!fs.existsSync(topicPath))
            fs.mkdirSync(topicPath, (err) => {if (err) return console.error(err)})
        if(!fs.existsSync(topicPath + "/topic_icon.png"))
            fs.copyFileSync(appRoot+"/server/data/images/default_topic_icon.png", topicPath+"/topic_icon.png")

        for(var subject of topicsJSON['topics'][topic]) {//var = global to file, let to scope, const can edit but not reassign, mutable but not overwrite
            var subjectPath = topicPath + "/" + subject.strToPathURLFriendly()
            if(!fs.existsSync(subjectPath))
                fs.mkdirSync(subjectPath, (err) => {if (err) return console.error(err)})
            if(!fs.existsSync(subjectPath + "/threads.json"))
                fs.writeFileSync(subjectPath + "/threads.json", "{}", (err) => {if (err) return console.error(err)})
            if(!fs.existsSync(subjectPath + "/description.txt"))
                fs.writeFileSync(subjectPath + "/description.txt", "This is the default description", () => {})
            if(!fs.existsSync(subjectPath + "/subject_icon.png"))
                fs.copyFileSync(appRoot+"/server/data/images/default_topic_icon.png", subjectPath+"/subject_icon.png")
        }
    }

    topicsJSON['topicIcons'] = []
    topicsJSON['description'] = {}
    topicsJSON['subjectIcons'] = {}
    for(var topic in topicsJSON['topics']) {
        topic = topic.strToPathURLFriendly()
        var topicPath = path+"/"+topic

        topicsJSON['topicIcons'].push("/" + topic + "/topic_icon.png")
        topicsJSON['description'][topic] = []
        topicsJSON['subjectIcons'][topic] = []
        for(var subject of topicsJSON['topics'][topic]) {
            subject = subject.strToPathURLFriendly()
            var subjectPath = topicPath + "/" + subject
            var description = fs.readFileSync(subjectPath + "/description.txt", 'utf8').toString()
            topicsJSON['description'][topic].push(description);
            topicsJSON['subjectIcons'][topic].push(topic + "/" + subject + "/subject_icon.png");
        }
    }
    app.get('/forum', (request, response) => {
        response.render('forum', { chat: gen.getChat(), topicsJSON: topicsJSON })
    })
}

function getSubjectPath(topic_name, subject_name) {
    let path = appRoot+"/server/data/forum";
    var topicsJSON = JSON.parse(fs.readFileSync(path + '/subject_list.json', 'utf8'))
    for(var topic in topicsJSON['topics']) {
        topic = topic.strToPathURLFriendly()
        if (topic_name == topic) {
            path = path + "\\" + topic
            for (var subject of topicsJSON['topics'][topic]) {
                subject = subject.strToPathURLFriendly()
                if (subject_name == subject)
                    path = path + "\\" + subject
            }
        }
    }
    return path
}