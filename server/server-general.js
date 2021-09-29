let DB_NAME = "school"
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

const fs = require("fs");

function hash(string) {
    var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    var result = ''
    for(var str_char of string)
        if(letters.includes(str_char) && str_char != letters[letters.length-1])
            result = result + letters.charAt(letters.indexOf(str_char) + 1)
        else
            result = result + str_char
    return result
}

function decodeHash(string) {
    var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    var result = ''
    for(var str_char of string)
        if(letters.includes(str_char) && str_char != letters[letters.length-1])
            result = result + letters.charAt(letters.indexOf(str_char) - 1)
        else
            result = result + str_char
    return result
}

function getChat() {
    var chatString = fs.readFileSync('server/data/chat.txt', 'utf8')
    return chatString.toString().replace(/\n*$/, "")
}

function getMongoDoc(collection_name) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection(collection_name).findOne({}, function(err, result) {
            if (err) throw err;
            console.log(result.name);
            db.close();
        });
    });
}

function insertMongoDoc(collection_name, jsonObj) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection(collection_name).insertOne(jsonObj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

String.prototype.strToBase32 = function(){
    return this.split("")
        .map(c => c.charCodeAt(0).toString(32).padStart(2, "0"))
        .join("");
}

String.prototype.base32ToStr = function(){
    return this.split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, 32)))
        .join("");
}

String.prototype.strURLToBase32 = function(){
    return this.replace("%20", " ").split("")
        .map(c => c.charCodeAt(0).toString(32).padStart(2, "0"))
        .join("");
}

String.prototype.base32ToStrURL = function(){
    return this.split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, 32)))
        .join("").replace(" ", "%20");
}

String.prototype.splitJoin = function(search, replace) {
    return this.split(search).join(replace)
}

String.prototype.strToPathURLFriendly = function(){
    return this.splitJoin(" ", "-").splitJoin("?", "").splitJoin("+", "");
}

module.exports.hash = hash;
module.exports.decodeHash = decodeHash;
module.exports.getChat = getChat;
module.exports.getMongoDoc = getMongoDoc;
module.exports.insertMongoDoc = insertMongoDoc;