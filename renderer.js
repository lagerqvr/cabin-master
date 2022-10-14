/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// 

// Show/hide password toggle
const showPsd = () => {
    try {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    } catch (error) {
        console.log(error.message);
    }
}

document.querySelector('#signIn').addEventListener('click', async () => {
    const login_failed = await window.electron.signIn({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    if (login_failed) {
        document.querySelector('#msg').innerText = login_failed.msg
        return
    }
    document.querySelector('#main').style.visibility = "hidden";
    document.querySelector('#dashboard').style.display = "initial";
    document.querySelector('#currentUser').innerHTML = `<p class="mt-3 ml-3">Signed is as <b>${document.querySelector('#email').value}<b class="check">✓</b></b></p>`
})

document.querySelector('#signOut').addEventListener('click', async () => {
    document.querySelector('#main').style.visibility = "visible";
    document.querySelector('#dashboard').style.display = "none";
})