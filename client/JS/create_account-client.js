let previewer = document.getElementById("avatar_preview")
let uploader = document.getElementById("avatar_uploader");
let errors = document.getElementById("errors")

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