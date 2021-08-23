let username = document.getElementById("userlogin");
let password = document.getElementById("password");

let account_prompt = document.getElementById("create_account_prompt");

function login() {
    sendJSONToServer({'login':{'username':username.value, 'password':password.value}})
}

function create_user() {
    sendJSONToServer({'create_user':{'username':username.value, 'password':password.value, 'verified':false}})
    showCreationDisplay()
}

function showCreationDisplay() {
    account_prompt.innerText = "An email was sent to your account! " + hash(username.value)
}