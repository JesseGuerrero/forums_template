function postJSONToRoute(url, json) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json));
}

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

function goToPage(url) {
    window.location.href = url
}

String.prototype.strToBase32 = function(){
    return this.split("")
        .map(c => c.charCodeAt(0).toString(32).padStart(2, "0"))
        .join("");
}

String.prototype.base32ToStr = function(){
    return this.split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, 16)))
        .join("");
}
