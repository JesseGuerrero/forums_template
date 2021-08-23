const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

module.exports = function(app) {
    app.use(bodyParser.json());
    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars')

    //Route files
    require("./routes/login")(app)
    require("./routes/shoutbox")(app)

}