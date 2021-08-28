let reply_prompt = document.getElementById("replyprompt")
let posts = document.getElementById("posts")

function showReplyPrompt() {
    reply_prompt.style.display = "flex";
}

function postReply() {
    var html = { html: posts.outerHTML };
    postJSONToRoute("/test", html);
}

function saveHTML() {

}