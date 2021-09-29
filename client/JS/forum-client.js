let reply_prompt = document.getElementById("replyprompt")
let reply_chatbox = document.getElementById("chatbox-reply")
let topic = document.getElementById("topic")
let subject = document.getElementById("subject")
let post_title = document.getElementById("post-title")

function showReplyPrompt() {
    reply_prompt.style.display = "flex";
}

function postReply() {
    function reply(usernick) {
        console.log(topic.innerText)
        console.log(subject.innerText)
        console.log(post_title.innerText)
        console.log(reply_chatbox.value, "Guest")
        var text = {
            topic: topic.innerText,
            subject: subject.innerText,
            post_title: post_title.innerText,
            text: reply_chatbox.value,
            user: usernick.nickname
        };
        console.log(reply_chatbox.value)
        postJSONToRoute("/postpost", text);
        setTimeout(window.location.reload(true), 3000)
    }


    fetch("/user")
        .then(response => response.json())
        .then(usernick => reply(usernick))
        .catch(error => {
            console.error(error);
        })
}

function saveHTML() {

}