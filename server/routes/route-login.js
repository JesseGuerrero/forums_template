const fs = require('fs');
const gen = require(appRoot + '/server/server-general')
const nodemailer = require('nodemailer');
const {request, response} = require("express");

module.exports = function(app) {
    app.post('/login', (request, response) => {
        console.log(request.body)
        if("login" in request.body)
            if (fs.existsSync('server/data/users/' + request.body['login']['username'] + '.json'))
                console.log("user login")
    })

    app.post('/create-user', (request, response) => {
        if("create_user" in request.body) {
            console.log("this ran")
            var jsonPath = 'server/data/users/' + request.body['create_user']['username'] + '.json'
            if (fs.existsSync(jsonPath))
                console.log("user exists")
            else
                fs.writeFile(jsonPath, JSON.stringify(request.body['create_user']), () => {
                    var username = request.body['create_user']['username']
                    var validationURL = "http://72.191.29.70/confirmaccount/" + gen.hash(username)
                    sendEmail('jesseguerrero1991@gmail.com', 'Hi, from Node ',
                        '<b>Click below </b><br> ' +
                        '<a href= ' + validationURL + '>verify e-mail</a>')
                })
        }
    })

    app.get('/confirmaccount/*', (request, response) => {
        var username = request.url.replace('/confirmaccount/', '')
        username = gen.decodeHash(username)
        var jsonPath = 'server/data/users/' + username + '.json'
        var prompText = ''

        console.log(username)
        if(fs.existsSync(jsonPath)) {
            console.log("account exists")
            var userJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
            console.log(userJSON)
            userJSON['verified'] = true
            fs.writeFile(jsonPath, JSON.stringify(userJSON), () => {})
            prompText = username + " verified!"
        }
        else
            console.log("account doesn't exist")
        response.render('index', { chat: gen.getChat(), prompt: prompText})
    })

    app.get('/create-account', (request, response) => {
        response.render('create_account.handlebars')
    })
}

//Ref: https://bit.ly/2WmkLwz
function sendEmail(recipient, subject, message) {
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