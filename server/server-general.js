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

module.exports.hash = hash;
module.exports.decodeHash = decodeHash;
module.exports.getChat = getChat;