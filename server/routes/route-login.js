const fs = require('fs');
const gen = require(appRoot + '/server/server-general')
const nodemailer = require('nodemailer');
const {request, response} = require("express");
const fileUpload = require('express-fileupload');
let userMap = {};

function loadUserMap() {
    let userMapJSONFile = appRoot+"/server/data/login-data.json"
    if(!fs.existsSync(userMapJSONFile))
        fs.mkdirSync(userMapJSONFile, (err) => {if (err) return console.error(err)})
    else
        userMap = JSON.parse(fs.readFileSync(userMapJSONFile, 'utf8'))
}

function saveUserMap() {
    let userMapJSONFile = appRoot+"/server/data/login-data.json"
    if(!fs.existsSync(userMapJSONFile))
        fs.mkdirSync(userMapJSONFile, (err) => {if (err) return console.error(err)})
    else
        fs.writeFileSync(userMapJSONFile, JSON.stringify(userMap), (err) => {if (err) return console.error(err)})
}

loadUserMap()
module.exports = function(app) {
    /**---Educational Info---
     * req is information from the request of the client
     * res is information being sent to the client from node.
     * next is the upcoming portion of middleware
     *      Middleware has a chain of code sections which are run after the other
     *      next() calls the next poart of the middleware like a linkedlist
     * the functions below inside get, post, use, all are all added to the middleware 'linkedlist'
     * Lastly lets define middleware: Anything that is run between when a client request something
     *      from the server and when the server sends a response.
     */
    app.use('*', function(req, res, next) {
        if (!(/shoutbox/i.test(req.url))) {
            let userIP = req.socket.remoteAddress
            if (userIP in userMap)
                res.locals.usernickname = userMap[userIP]
            else
                res.locals.usernickname = "Guest"
        }
        next()
    })

    // enable files upload
    app.use(fileUpload({
        createParentPath: true
    }));

    app.get('/user', (req, res) => {
        console.log(typeof userMap)
        let userIP = req.socket.remoteAddress
        let nickname = "Guest"
        if (userIP in userMap)
            nickname = userMap[userIP]

        res.send(JSON.stringify({
            "nickname": nickname
        }));
    })

    app.post('/login', (request, response) => {
        console.log(request.body)
        if("login" in request.body)
            if (fs.existsSync('server/data/users/' + request.body['login']['username'] + '.json')) {
                let userJSON = JSON.parse(fs.readFileSync('server/data/users/' + request.body['login']['username'] + '.json'))
                console.log(JSON.stringify(userJSON))
                console.log(request.socket.remoteAddress)
                let userIP = request.socket.remoteAddress
                userMap[userIP] = request.body['login']['username']
                saveUserMap()
            }
        response.oidc.login({ returnTo: '/profile' })
    })

    app.post('/logout', (request, response) => {
        let userIP = request.socket.remoteAddress.toString()
        delete userMap[userIP]
        saveUserMap()
    })

    app.get('/custom-logout', (req, res) => res.send('Bye!'));

    app.post('/create-user', (request, response) => {
        console.log(request.body)
        if("account" in request.body) {
            console.log("this ran")
            var jsonPath = 'server/data/users/' + request.body['account']['username'] + '.json'
            if (fs.existsSync(jsonPath))
                console.log("user exists")
            else {
                let userJSON = request.body['account']
                fs.writeFile(jsonPath, JSON.stringify(userJSON), () => {
                    var username = request.body['account']['username']
                    var validationURL = "http://localhost/confirmaccount/" + username.strToBase32()
                    sendEmail(request.body['account']['email'], 'Hi, from Node ',
                        '<b>Click below </b><br> ' +
                        '<a href= ' + validationURL + '>verify e-mail</a>')
                })
                gen.insertMongoDoc("user", userJSON)
            }
        }
    })

    app.post('/upload-avatar', (request, response) => {
        let avatar = request.files.avatar;
        avatar.mv('server/data/images/avatars/' + avatar.name);
    })

    app.get('/confirmaccount/*', (request, response) => {
        var username = request.url.replace('/confirmaccount/', '')
        username = username.base32ToStr()
        var jsonPath = 'server/data/users/' + username + '.json'
        var prompText = ''

        if(fs.existsSync(jsonPath)) {
            let userJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
            let isVerified = userJSON['verified']
            userJSON['verified'] = true
            fs.writeFile(jsonPath, JSON.stringify(userJSON), () => {})

            if(isVerified)
                response.send('Your account has been verified')
            else
                response.send('Your account is already verified')
        }
        else
            response.send("account doesn't exist")

    })

    app.get('/create-account', (request, response) => {
        response.render('create_account.handlebars')
    })
}

//Ref: https://bit.ly/2WmkLwz
function sendEmail(recipient, subject, message) {
    console.log(recipient)
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // port for secure SMTP
        auth: {
            user: 'waroncode@gmail.com',
            pass: gen.decodeHash("ebslbojtdppm")
        }
    })

    var mailOptions = {
        from: 'Jesus Guerrero', // sender address (who sends)
        to: recipient, // list of receivers (who receives)
        subject: subject, // Subject line
        text: '', // plaintext body
        html: message// html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}