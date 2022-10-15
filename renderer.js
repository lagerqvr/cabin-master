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

async function getToken() {
    try {
        data = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value
        }
        const API_URL = "https://wom22-project-2-1.azurewebsites.net"
        const resp = await fetch(API_URL + '/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            timeout: 3000
        })
        const user = await resp.json()
        localStorage.setItem('userKey', user.token)
    } catch (error) {
        console.log(error.message);
    }

}

const checkAuth = () => {
    let userKey = localStorage.getItem('userKey');
    console.log(userKey)
    if (userKey == null || userKey == '' || userKey == undefined) {
        document.querySelector('#dashboard').style.display = "none";
        document.querySelector('#main').style.visibility = "visible";
    } else {
        document.querySelector('#main').style.visibility = "hidden";
        document.querySelector('#dashboard').style.display = "initial";
        document.querySelector('#currentUser').innerHTML = `<p class="mt-3 ml-3">Signed is as <b>${localStorage.getItem('currentUser')}<b class="check">✓</b></b></p>`
    }
}
checkAuth();

document.querySelector('#signIn').addEventListener('click', async () => {
    getToken();
    localStorage.setItem('currentUser', document.querySelector('#email').value);
    const login_failed = await window.electron.signIn({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    if (login_failed) {
        document.querySelector('#msg').innerHTML = `<p class="text-danger mt-2 mb-0"><b>${login_failed.msg}</b></p>`
        return
    }
    document.querySelector('#main').style.visibility = "hidden";
    document.querySelector('#dashboard').style.display = "initial";
    document.querySelector('#currentUser').innerHTML = `<p class="mt-3 ml-3">Signed is as <b>${document.querySelector('#email').value}<b class="check">✓</b></b></p>`
})

document.querySelector('#signOut').addEventListener('click', async () => {
    localStorage.setItem('userKey', '');
    localStorage.setItem('currentUser', '');
    document.querySelector('#dashboard').style.display = "none";
    document.querySelector('#main').style.visibility = "visible";
    document.querySelector('#msg').innerHTML = '<p class="text-success mt-2 mb-0"><b>Signed out</b></p>'
})