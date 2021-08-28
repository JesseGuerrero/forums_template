const gen = require(appRoot + "/server/server-general");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");

module.exports = function(app) {
    app.use(bodyParser.json());
    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars')
    var hbs = exphbs.create({});
    hbs.handlebars.registerHelper('getElement', function(array, index) {
        return array[index]
    });

    //Route files
    require(appRoot + "/server/routes/route-login")(app)
    require(appRoot + "/server/routes/route-shoutbox")(app)
    require(appRoot + "/server/routes/route-forum")(app)

    generateForums(app)
}

function generateForums(app) {
    var path = appRoot+"/server/data/forum"
    var topicsJSON = JSON.parse(fs.readFileSync(path + '/subject_list.json', 'utf8'))
    for(var sub of topicsJSON['subjects']) {
        var subjectFolder = path+"/" + sub;
        if(!fs.existsSync(subjectFolder)) {
            fs.mkdirSync(subjectFolder, (err) => {
                if(err) return console.error(err)
                console.log(sub + ' created successfully')
            })
            fs.writeFileSync(subjectFolder + "/description.txt", "This is the default description", () => {})
            fs.copyFileSync(appRoot+"/server/data/images/default_subject_icon.png", subjectFolder+"/icon.png")
        }

        app.get('/forum/' + sub, (request, response) => {
            response.render('sample_subject', { chat: gen.getChat()})
        })
    }

    for(var sub of topicsJSON['subjects']) {
        var subjectFolder = path+"/" + sub;
        var description = fs.readFileSync(subjectFolder + "/description.txt", 'utf8').toString()
        topicsJSON['description'].push(description);
        topicsJSON['logoPaths'].push("/forum/" + sub + "/icon.png");
    }

    app.get('/forum', (request, response) => {
        response.render('forum', { chat: gen.getChat(), topicsJSON: topicsJSON })
    })
}