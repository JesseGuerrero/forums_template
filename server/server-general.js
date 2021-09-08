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

String.prototype.strToHex = function(){
    return this.split("")
        .map(c => c.charCodeAt(0).toString(32).padStart(2, "0"))
        .join("");
}

String.prototype.hexToStr = function(){
    return this.split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, 32)))
        .join("");
}

String.prototype.strURLToHex = function(){
    return this.replace("%20", " ").split("")
        .map(c => c.charCodeAt(0).toString(32).padStart(2, "0"))
        .join("");
}

String.prototype.hexToStrURL = function(){
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