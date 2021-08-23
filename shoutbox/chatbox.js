let CHAT_HEIGHT = 10;
let chatbox = document.getElementById("chatbox");
let name = document.getElementById("username");
let input = document.getElementById("text-input");

removeExcessChat()
scrollChatToBottom()

function removeExcessChat() {
    var chatString = chatbox.value
    var chatlines = chatString.split("\n")

    chatString = ""
    for(const line of chatlines.splice(chatlines.length-CHAT_HEIGHT, chatlines.length))
        chatString = chatString + line + "\n"
    chatbox.value = chatString.replace(/\n*$/, "")
}

function scrollChatToBottom() {
    chatbox.scrollTop = chatbox.scrollHeight;
}

function hasInvalidCharacters(string) {
    return string.includes("\\")
}

function postText() {
    if(hasInvalidCharacters(input.value)) {
        alert("Invalid message")
        input.value = ""
        return
    }
    if(hasInvalidCharacters(name.value)) {
        alert("Invalid name")
        name.value = ""
        return
    }

    if(input.value != "") {
        var time_date = new Date();
        var time = (time_date.getHours() < 10 ? "0" + time_date.getHours() : time_date.getHours()) + ":" + (time_date.getMinutes() < 10 ? "0" + time_date.getMinutes() : time_date.getMinutes())
        var newText = time + " " + (name.value == "" ? "Guest" : name.value)
            + ": " + input.value
        chatbox.value =
            (chatbox.value == "" ? "" : chatbox.value + "\n") + newText;
        postJSONToRoute('/shoutbox', {'shoutbox':newText})
        removeExcessChat()
        scrollChatToBottom()
    }
    input.value = "";
}

