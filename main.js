// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

// "localStorage" for electron
// https://www.npmjs.com/package/electron-store
const Store = require('electron-store')
const store = new Store()

const API_URL = "https://wom22-project-2-1.azurewebsites.net"

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1469,
    height: 1283,
    icon: __dirname + './public/logo-v1.png',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: false // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {

  createWindow()

  // Check original template for MacOS stuff!
})

ipcMain.handle('signIn', async (event, data) => {
  console.log('Login (main)')
  try {
    const resp = await fetch(API_URL + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 3000
    })
    const user = await resp.json()
    console.log(user)

    if (resp.status > 201) return user

    store.set('jwt', user.token)
    return false // false = login succeeded

  } catch (error) {
    console.log(error.message)
    return { 'msg': "Login failed." }
  }
})

// Example functions for communication between main and renderer (backend/frontend)
ipcMain.handle('get-stuff-from-main', () => 'Stuff from main!')
ipcMain.handle('send-stuff-to-main', async (event, data) => console.log(data))

app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})


