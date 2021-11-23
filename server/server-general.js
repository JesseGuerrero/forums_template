let MongoClient = require('mongodb').MongoClient;
let URL = "mongodb://localhost:27017/";

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

//---MongoDB Functions---

function getFirstMongoDoc(db_name, collection_name) {
    MongoClient.connect(URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.collection(collection_name).findOne({}, function(err, doc) {
            if (err) throw err;
            db.close();
        });
    });
}

function getMongoDocAndDo(db_name, collection_name, filterJSON, callback) {
    MongoClient.connect(URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.collection(collection_name).findOne(filterJSON, function(err, doc) {
            if (err) throw err;
            callback(doc)
            db.close();
        });
    });
}

function insertMongoDoc(db_name, collection_name, jsonObj, callback) {
    MongoClient.connect(URL, function(err, db) {
        if (err) throw err;
        let dbo = db.db(db_name);
        dbo.collection(collection_name).insertOne(jsonObj, function(err, doc) {
            if (err) throw err;
            console.log("1 document inserted");
            callback(doc)
            db.close();
        });
    });
}

function updateOneMongoDoc(db_name, collection_name, filter, changes, callback) {
    MongoClient.connect(URL, function(err, db) {
        if (err) throw err;
        let dbo = db.db(db_name);
        dbo.collection(collection_name).updateOne(filter, changes, function(err, doc) {
            if (err) throw err;
            console.log("1 document updated");
            callback(doc)
            db.close();
        });
    });
}

function ifMongoDocExistsDo(db_name, collection_name, filterJSON, callback) {
    MongoClient.connect(URL, function(err, db) {
        if(err) throw err;
        let dbo = db.db(db_name);
        dbo.collection(collection_name).findOne(filterJSON, function(err, doc) {
            if(err) throw error;
            if(doc != null)
                callback(doc)
            db.close();
        })
    })
}

function ifMongoDocDoesNotExistDo(db_name, collection_name, filterJSON, callback) {
    MongoClient.connect(URL, function(err, db) {
        if(err) throw err;
        let dbo = db.db(db_name);
        dbo.collection(collection_name).findOne(filterJSON, function(err, doc) {
            if(err) throw error;
            if(doc == null)
                callback(doc)
            db.close();
        })
    })
}

function replaceMongoDoc(db_name, collection_name, filterJSON, replacementJSON) {
    MongoClient.connect(URL, function(err, db) {
        if(err) throw err;
        let dbo = db.db(db_name);
        dbo.collection(collection_name).replaceOne(filterJSON, replacementJSON, function(err, doc) {
            if(err) throw error;
            db.close();
        })
    })
}

function existentCollectionDo(db_name, collection_name, callback) {
    MongoClient.connect(URL, function(err, db) {
        if(err) throw err;
        let dbo = db.db(db_name);
        dbo.listCollections({name: collection_name})
            .next(function(err, isExistent) {
                callback(isExistent)
                db.close();
            })
    })
}

function createCollection(db_name, collection_name, callback) {
    MongoClient.connect(URL, function(err, db) {
        if(err) throw err;
        let dbo = db.db(db_name);
        dbo.createCollection(collection_name, function(err, doc) {
            if(err) throw error;
            callback()
            db.close();
        });
    })
}

function getTimeStamp() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let month = today.toLocaleString('default', { month: 'short' })
    let yyyy = today.getFullYear();
    let time = today.toTimeString().replace(/.*(\d{2}:\d{2})(:\d{2}).*/, "$1")
    let hh = today.getUTCHours() > 12 ? today.getUTCHours()-12 : today.getUTCHours();
    let mm = today.getUTCMinutes();;
    let ampm = today.getUTCHours() > 12 ? "PM" : "AM"
    time = hh+":"+mm+":"+ampm;
    return month+"-"+dd+"-"+yyyy+", "+ time
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
module.exports.getMongoDocAndDo = getMongoDocAndDo;
module.exports.insertMongoDoc = insertMongoDoc;
module.exports.ifMongoDocExistsDo = ifMongoDocExistsDo;
module.exports.ifMongoDocDoesNotExistDo = ifMongoDocDoesNotExistDo;
module.exports.updateOneMongoDoc = updateOneMongoDoc;
module.exports.getFirstMongoDoc = getFirstMongoDoc;
module.exports.createCollection = createCollection;
module.exports.existentCollectionDo = existentCollectionDo;
module.exports.replaceMongoDoc = replaceMongoDoc;
module.exports.getTimeStamp = getTimeStamp;
