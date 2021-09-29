let previewer = document.getElementById("avatar_preview")
let uploader = document.getElementById("avatar_uploader");
let errors = document.getElementById("errors")
let nickname = document.getElementById("nickname");
let pass = document.getElementById("pass");
let email = document.getElementById("email");
let signature = document.getElementById("signature");
let account_prompt = document.getElementById("create_account_prompt");



function create_user() {
    console.log(nickname.value)
    console.log(pass.value)
    console.log(email.value)
    console.log(signature.value)

    let file = previewer.file
    let file_name = nickname.value.strToBase32()
    if(file.type.includes("png"))
        file_name = file_name + ".png"
    else if(file.type.includes("jpeg"))
        file_name = file_name + ".jpeg"
    else if(file.type.includes("jpg"))
        file_name = file_name + ".jpg"

    file = new File([file], file_name, {type: file.type});
    let formData = new FormData();
    formData.append('avatar', file)
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/upload-avatar')
    xhr.send(formData)

    postJSONToRoute('/create-user', {'account':{'username':nickname.value, 'password':pass.value, 'email': email.value, 'avatar': file_name, 'signature': signature.value, 'verified':false}})
    showCreationDisplay()
}

function showCreationDisplay() {
    account_prompt.innerHTML = "&nbsp;An email was sent to your account for verification"
}

function uploadAvatar() {
    if(uploader.files.length == 1) {
        var file = uploader.files[0]
        console.log(typeof file)
        if(file.type.includes("png") || file.type.includes("jpeg") || file.type.includes("jpg")
            || file.type.includes("gif")) {
            previewer.classList.add("obj");
            previewer.file=file;
            const reader = new FileReader();
            reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(previewer);
            reader.readAsDataURL(file);
            errors.innerText=""
        } else {
            errors.innerText = "Invalid image format, try png, gif, jpeg or jpg files."
        }
    } else {
        ;
    }
}