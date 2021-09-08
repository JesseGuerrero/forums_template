let reply_prompt = document.getElementById("replyprompt")
let reply_chatbox = document.getElementById("chatbox-reply")
let post_title = document.getElementById("post-title")

function showReplyPrompt() {
    reply_prompt.style.display = "flex";
}

function postReply() {
    var text = { post_title: post_title.value, text: reply_chatbox.value, user: "guest" };
    console.log(reply_chatbox.value)
    postJSONToRoute("/postpost", text);
}

function saveHTML() {

}