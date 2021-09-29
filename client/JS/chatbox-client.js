let CHAT_HEIGHT = 10;
let chatbox = document.getElementById("chatbox");
let input = document.getElementById("text-input");
var nickname = ""

chatbox.value = removeExcessChat(chatbox.value)
scrollChatToBottom()

function removeExcessChat(data) {
    var chatString = data
    var chatlines = chatString.split("\n")

    chatString = ""
    for(const line of chatlines.splice(chatlines.length-CHAT_HEIGHT, chatlines.length))
        chatString = chatString + line + "\n"
    return chatString.replace(/\n*$/, "")
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

    function post(usernick) {
        nickname = usernick["nickname"]
        if(input.value != "") {
            var time_date = new Date();
            var time = (time_date.getHours() < 10 ? "0" + time_date.getHours() : time_date.getHours()) + ":" + (time_date.getMinutes() < 10 ? "0" + time_date.getMinutes() : time_date.getMinutes())
            var newText = time + " " + nickname + ": " + input.value
            postJSONToRoute('/shoutbox', {'shoutbox':newText})
        }
        input.value = "";
    }
    fetch("/user")
        .then(response => response.json())
        .then(usernick => post(usernick))
        .catch(error => {
            console.error(error);
        })


}
function fetchMostRecentData() {
    fetch("/shoutbox/chat")
        .then(response => response.text())
        .then(data => updateView(data))
        .catch(err => showError(err));
}


function updateView(data) {
    if(chatbox.value != data) {
        chatbox.value = removeExcessChat(data)
        scrollChatToBottom()
    }
}

function showError(err) {
    console.error(err);
    // alert("Something went wrong");
}

// call fetchMostRecentData once every 10s
setInterval(fetchMostRecentData, 1000);