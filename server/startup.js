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

    //Route files
    require(appRoot + "/server/routes/route-login")(app)
    require(appRoot + "/server/routes/route-shoutbox")(app)
    require(appRoot + "/server/routes/route-forum")(app)
}

