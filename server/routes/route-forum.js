const gen = require(appRoot + "/server/server-general");
const {request, response} = require("express");
const fs = require("fs");

module.exports = function(app) {
    gen.getMongoDoc("user");

    app.get('/forum/subject', (request, response) => {

    })
    app.get('/forum/sample-posting', (request, response) => {
        response.render('posting_listing', { chat: gen.getChat() })
    })
    app.get('/test', (request, response) => {

        // gen.insertMongoDoc("user", { name: "Company Inc", address: "Highway 37" })
        response.render('tester')
    })
    app.post('/postpost', (request, response) => {
        let url = request.headers.referer
        let topic, subject, title, reply_user, new_text;
        [topic, subject, title, reply_user, new_text] = [request.body["topic"], request.body["subject"], request.body["post_title"], request.body["user"], request.body["text"]]
        let thread_listing = JSON.parse(fs.readFileSync(getSubjectPath(topic, subject) + "\\threads.json", 'utf8'))
        console.log(thread_listing)
        let i = -1
        while(true || i == 100) {
            if (thread_listing["threads"][++i]["title"] == title)
                break;
        }
        if(i == 100) {
            return;
        }
        console.log(i)
        console.log(thread_listing["threads"][i]["postings"])
        thread_listing["threads"][i]["postings"].push({
            "user": reply_user,
            "message": new_text,
            "post_date": 99
        })
        fs.writeFileSync(getSubjectPath(topic, subject) + "\\threads.json", JSON.stringify(thread_listing))
    })
    generateForums(app)
    app.get('/forum/:topic/:subjects', (request, response) => {
        let thread_listing = JSON.parse(fs.readFileSync(getSubjectPath(request.params.topic, request.params.subjects) + "\\threads.json", 'utf8'))
        response.render('thread_listing', { chat: gen.getChat(), threads: thread_listing })
    })
    app.get('/forum/:topic/:subjects/:threadno/:author/:title/:pageno', (request, response) => {
        let thread_listing = JSON.parse(fs.readFileSync(getSubjectPath(request.params.topic, request.params.subjects) + "\\threads.json", 'utf8'))
        response.render('posting_listing', { chat: gen.getChat(), threads: thread_listing, topic: request.params.topic,
            subjects: request.params.subjects, threadno: request.params.threadno, author: request.params.author, title: request.params.title, pageno: request.params.pageno })
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
                fs.writeFileSync(subjectPath + "/threads.json",
                    JSON.stringify({
                        "topic": topic,
                        "subject": subject,
                        "threads":[{"title":"Welcome to thread!","author":"Jawarrior1","publish_date":2,"latest_date":1, "postings":[{"user":"Jawarrior2","message":"Welcome...","post_date":2},{"user":"Jawarrior2","message":"Thanks","post_date":3},{"user":"Jawarrior2","message":"Cool beans","post_date":4},{"user":"guest","message":"okay","post_date":99},{"user":"guest","message":"That was...","post_date":99}]},
                            {"title":"Rules...","author":"That dude","publish_date":3,"latest_date":4,"postings":[{"user":"Jawarrior2","message":"Was good","post_date":2},{"user":"Jawarrior2","message":"He likes SnapChat","post_date":3},{"user":"Jawarrior2","message":"maybe","post_date":4}]}]
                    }), (err) => {if (err) return console.error(err)})
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
    topic_name = topic_name.strToPathURLFriendly()
    subject_name = subject_name.strToPathURLFriendly()
    let path = appRoot+"/server/data/forum";
    var topicsJSON = JSON.parse(fs.readFileSync(path + '/subject_list.json', 'utf8'))
    for(var topic in topicsJSON['topics']) {
        topic = topic.strToPathURLFriendly()
        if (topic_name == topic) {
            path = path + "\\" + topic
            for (var subject of topicsJSON['topics'][topic]) {
                subject = subject.strToPathURLFriendly()
                console.log("S " + subject)
                if (subject_name == subject)
                    path = path + "\\" + subject
            }
        }
    }
    return path
}