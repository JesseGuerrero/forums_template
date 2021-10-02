const gen = require(appRoot + "/server/server-general");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");
require('dotenv').config();
const { auth } = require('express-openid-connect')

module.exports = function(app) {
    app.use(
        auth({
            authRequired: false,
            auth0Logout: true,
            issuerBaseURL: process.env.ISSUER_BASE_URL,
            baseURL: process.env.BASE_URL,
            clientID: process.env.CLIENT_ID,
            secret: process.env.SECRET,
            routes: {
                login: false,
                postLogoutRedirect: '/custom-logout'
            }
        })
    );
    app.use(bodyParser.json());
    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars')
    var hbs = exphbs.create({});
    hbs.handlebars.registerHelper('getElement', function(array, index) {
        return array[index]
    });
    hbs.handlebars.registerHelper('getElementFromJSONKey', function(options) {
        return options.hash.json[options.hash.key][options.hash.index]
    });
    hbs.handlebars.registerHelper('toTitleCase', function(str) {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    });
    hbs.handlebars.registerHelper('getElementThenProperty', function(array, index, property) {
        return array[index][property]
    });
    hbs.handlebars.registerHelper('turnPathURLFriendly', function(string) {
        return string.strToPathURLFriendly()
    });
    hbs.handlebars.registerHelper('ifNotEqualPostThis', function(var1, var2, postthis) {
        if(var1 !== var2)
            return postthis
    });
    hbs.handlebars.registerHelper('getUserImage', function(username) {
        let path = appRoot + "/server/data/users/" + username + ".json"
        if(fs.existsSync(path)) {
            let userJSON = JSON.parse(fs.readFileSync(path, 'utf8'))
            return userJSON['avatar']
        } else {
            let userJSON = JSON.parse(fs.readFileSync(appRoot + "/server/data/users/Guest.json", 'utf8'))
            return userJSON['avatar']
        }
    });
    hbs.handlebars.registerHelper('getUserSignature', function(username) {
        let path = appRoot + "/server/data/users/" + username + ".json"
        if(fs.existsSync(path)) {
            let userJSON = JSON.parse(fs.readFileSync(path, 'utf8'))
            return userJSON['signature']
        } else {
            let userJSON = JSON.parse(fs.readFileSync(appRoot + "/server/data/users/Guest.json", 'utf8'))
            return userJSON['signature']
        }
    });
    hbs.handlebars.registerHelper('ifNumBetween', function(num, lower, upper, options) {
        return (num >= lower && num < upper) ? options.fn(this) : options.inverse(this);
    });
    hbs.handlebars.registerHelper('calcLowerFromPostPageNo', function(pageno) {
        return pageno*10-10;
    });
    hbs.handlebars.registerHelper('calcUpperFromPostPageNo', function(pageno) {
        return pageno*10;
    });
    hbs.handlebars.registerHelper('add', function(num1, num2) {
        return Number(num1)+Number(num2);
    });
    hbs.handlebars.registerHelper('minus', function(num1, num2) {
        return Number(num1)-Number(num2);
    });
    hbs.handlebars.registerHelper('getPageCountOfPostings', function(postings) {
        return Math.ceil(postings.length/10.0);
    });

    //Route files
    require(appRoot + "/server/routes/route-login")(app)
    require(appRoot + "/server/routes/route-shoutbox")(app)
    require(appRoot + "/server/routes/route-forum")(app)
}

