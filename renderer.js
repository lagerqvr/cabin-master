/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

//

const API_URL = "https://wom22-project-2-2.azurewebsites.net"

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

// Fetch all cabins
async function getCabins() {
    try {
        const resp = await fetch(API_URL + '/cabins', {
            method: 'GET',
            timeout: 3000
        })
        const cabins = await resp.json()
        console.log(cabins);

        const table = document.querySelector('#cabins');

        table.innerHTML = "";
        let cabinCount = 0;

        for (var i = 0; i < cabins.length; i++) {
            cabinCount += 1;
            var row = `<tr><td>Cabin ${cabinCount} - ${cabins[i].address}</td></tr>`
            table.innerHTML += row;
        }
    } catch (error) {
        console.log(error.message);
    }
}
getCabins();

// Fetch all services
async function getServices() {
    try {
        const resp = await fetch(API_URL + '/services', {
            method: 'GET',
            timeout: 3000
        })
        const services = await resp.json()
        console.log(services);

        const table = document.querySelector('#services');

        table.innerHTML = "";

        for (var i = 0; i < services.length; i++) {
            var row = `<tr><td>${services[i].servicetype}</td></tr>`
            table.innerHTML += row;
        }
    } catch (error) {
        console.log(error.message);
    }
}
getServices();

// Fetch all reservations
async function getReservations() {
    try {
        const resp = await fetch(API_URL + '/orders', {
            method: 'GET',
            timeout: 3000
        })
        const orders = await resp.json()
        console.log(orders);

        const table = document.querySelector('#orders');

        table.innerHTML = "";

        for (var i = 0; i < orders.length; i++) {
            let date = orders[i].date;
            let formattedDate = date.substring(0, 10);
            var row = `<tr><td>${formattedDate}</td><td>${orders[i].servicetype}</td><td>${orders[i].cabin}</td></tr>`
            table.innerHTML += row;
        }
    } catch (error) {
        console.log(error.message);
    }
}
getReservations();

// Make row selectable
function highlightRow() {

}

// Get table values


// Create a new reservation
async function createReservation() {
    try {
        document.querySelector('#resmsg').innerHTML = `<p class="text-success mt-2 mb-0"><b>Reservation created</b></p>`
        /* data = {
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
        const user = await resp.json() */
        getReservations();
    } catch (error) {
        console.log(error.message);
        document.querySelector('#resmsg').innerHTML = `<p class="text-danger mt-2 mb-0"><b>Couldn't create reservation</b></p>`
    }
}

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