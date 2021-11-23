const gen = require(appRoot + "/server/server-general");
const {request, response} = require("express");
const fs = require("fs");
const {replaceMongoDoc, existentCollectionDo, createCollection, ifMongoDocDoesNotExistDo, insertMongoDoc, getMongoDocAndDo,
    getTimeStamp
} = require("../server-general");




module.exports = function(app) {
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
        getMongoDocAndDo("forum", topic, {"subject": subject}, (doc)=>{
            let thread_listing = doc
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
                "post_date": getTimeStamp()
            })
            replaceMongoDoc("forum", topic, {"subject": subject}, thread_listing)
        })

    })

    app.post('/postthread', (request, response) => {
        let url = request.headers.referer
        let topic, subject, thread_title, thread_author, message;
        [topic, subject, thread_author, thread_title, message] = [request.body["topic"], request.body["subject"], request.body["user"], request.body["thread_title"], request.body["message"]]
        getMongoDocAndDo("forum", topic, {"subject": subject}, (doc)=> {
            let thread_listing = doc
            thread_listing["threads"].unshift({
                "title": thread_title,
                "author": thread_author,
                "publish_date": 2,
                "latest_date": 1,
                "postings": [
                    {
                        "user": thread_author,
                        "message": message,
                        "post_date": getTimeStamp()
                    }
                ]
            })
            replaceMongoDoc("forum", topic, {"subject": subject}, thread_listing)
        })
    })

    generateForums(app)
    app.get('/forum/:topic/:subjects', (request, response) => {
        getMongoDocAndDo("forum", request.params.topic, {subject: request.params.subjects}, (thread_listing)=>{
            response.render('thread_listing', { chat: gen.getChat(), threads: thread_listing })
        })

    })
    app.get('/forum/:topic/:subjects/:threadno/:author/:title/:pageno', (request, response) => {
        getMongoDocAndDo("forum", request.params.topic, {subject: request.params.subjects}, (thread_listing)=>{
            response.render('posting_listing', { chat: gen.getChat(), threads: thread_listing, topic: request.params.topic,
            subjects: request.params.subjects, threadno: request.params.threadno, author: request.params.author, title: request.params.title, pageno: request.params.pageno })
        })
    })
}

function generateForums(app) {
    var path = appRoot+"/server/data/forum"
    var topicsJSON = JSON.parse(fs.readFileSync(path + '/subject_list.json', 'utf8'))

    for(let topic in topicsJSON['topics']) {
        existentCollectionDo("forum", topic, (isExistent)=> {
            if(!isExistent)
                createCollection("forum", topic, () => {})
        })
        let subjects = topicsJSON['topics'][topic]
        for(let i = 0; i < subjects.length; i++) {
            let subject = subjects[i]
            ifMongoDocDoesNotExistDo("forum", topic, {"subject": subject}, ()=> {
                let json = {
                    "topic": topic,
                    "subject": subject,
                    "description": "This is the default description",
                    "icon": "subject_icon.png",
                    "threads":[{"title":"Welcome to thread!","author":"Jawarrior1","publish_date":2,"latest_date":1, "postings":[{"user":"Jawarrior2","message":"Welcome...","post_date":2},{"user":"Jawarrior2","message":"Thanks","post_date":3},{"user":"Jawarrior2","message":"Cool beans","post_date":4},{"user":"guest","message":"okay","post_date":99},{"user":"guest","message":"That was...","post_date":99}]},
                    {"title":"Rules...","author":"That dude","publish_date":3,"latest_date":4,"postings":[{"user":"Jawarrior2","message":"Was good","post_date":2},{"user":"Jawarrior2","message":"He likes SnapChat","post_date":3},{"user":"Jawarrior2","message":"maybe","post_date":4}]}]
                }
                insertMongoDoc("forum", topic, json, ()=>{})
            })
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
