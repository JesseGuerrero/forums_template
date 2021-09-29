let username = document.getElementById("userlogin");
let password = document.getElementById("password");

function login() {
    postJSONToRoute('/login', {'login':{'username':username.value, 'password':password.value}})
    location.reload(true);
}

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/logout", true);
    xhr.send()
    location.reload(true);
}
