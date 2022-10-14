/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

(async () => {
    console.log(await window.exposed.getStuffFromMain())

    await window.exposed.sendStuffToMain('Stuff from renderer')
})()

const signOut = () => {
    document.querySelector('#main').style.visibility = "visible"
    document.querySelector('#dashboard').style.visibility = "hidden"
}

async function signIn() {
    document.querySelector('#main').style.visibility = "hidden"
    document.querySelector('#dashboard').style.visibility = "visible"
}