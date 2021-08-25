const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

module.exports = function(app) {
    app.use(bodyParser.json());
    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars')

    //Route files
    require(appRoot + "/server/routes/route-login")(app)
    require(appRoot + "/server/routes/route-shoutbox")(app)

}