//HTML inner text extraction
let topic = document.getElementById("topic")
let subject = document.getElementById("subject")

//Appears based on create_thread & post_reply
let reply_prompt = document.getElementById("replyprompt")
let reply_prompt_shower = document.getElementsByClassName("prompt-shower")

//Post information
let reply_chatbox = document.getElementById("chatbox-reply")
let post_title = document.getElementById("post-title")

//Thread information
let thread_chatbox = document.getElementById("chatbox-thread")
let thread_title = document.getElementById("thread-title")


hideUserPrompts()

function hideUserPrompts() {
    function reply(usernick) {
        console.log(usernick.nickname)
        if(usernick.nickname != "Guest") {
            for(let i = 0; i < reply_prompt_shower.length; i++)
                reply_prompt_shower[i].style.visibility = 'visible'
        }
    }

    fetch("/user")
        .then(response => response.json())
        .then(usernick => reply(usernick))
        .catch(error => {
            console.error(error);
        })
}

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
        setTimeout(function(){window.location.reload(true)}, 1800)
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
        setTimeout(function(){window.location.reload(true)}, 1800)
    }


    fetch("/user")
        .then(response => response.json())
        .then(usernick => reply(usernick))
        .catch(error => {
            console.error(error);
        })
}
