//HTML inner text extraction
let topic = document.getElementById("topic")
let subject = document.getElementById("subject")

//Appears based on create_thread & post_reply
let reply_prompt = document.getElementById("replyprompt")

//Post information
let reply_chatbox = document.getElementById("chatbox-reply")
let post_title = document.getElementById("post-title")

//Thread information
let thread_chatbox = document.getElementById("chatbox-thread")
let thread_title = document.getElementById("thread-title")


function showReplyPrompt() {
    reply_prompt.style.display = "flex";
}

function postThread() {
    function reply(usernick) {
        console.log(topic.innerText)
        console.log(subject.innerText)
        console.log(thread_title.value)
        console.log(thread_chatbox.value)
        console.log(usernick.nickname)
        var thread_info = {
            topic: topic.innerText,
            subject: subject.innerText,
            user: usernick.nickname,
            thread_title: thread_title.value,
            message: thread_chatbox.value
        };
        postJSONToRoute("/postthread", thread_info);
        setTimeout(window.location.reload(true), 3000)
    }


    fetch("/user")
        .then(response => response.json())
        .then(usernick => reply(usernick))
        .catch(error => {
            console.error(error);
        })
}

function postReply() {
    function reply(usernick) {
        console.log(topic.innerText)
        console.log(subject.innerText)
        console.log(post_title.innerText)
        console.log(reply_chatbox.value, "Guest")
        var post_info = {
            topic: topic.innerText,
            subject: subject.innerText,
            post_title: post_title.innerText,
            text: reply_chatbox.value,
            user: usernick.nickname
        };
        console.log(reply_chatbox.value)
        postJSONToRoute("/postpost", post_info);
        setTimeout(window.location.reload(true), 3000)
    }


    fetch("/user")
        .then(response => response.json())
        .then(usernick => reply(usernick))
        .catch(error => {
            console.error(error);
        })
}