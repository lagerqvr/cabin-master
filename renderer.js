/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
//

if (localStorage.getItem('selectedDate') == '') {
    document.querySelector("#birthday").valueAsDate = new Date();
} else {
    document.querySelector("#birthday").value = localStorage.getItem('selectedDate')
}

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
            var row = `<tr><td><input class="form-check-input m-2" type="checkbox" onclick="selectRow()">Cabin ${cabinCount} - ${cabins[i].address}</td></tr>`
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
            var row = `<tr><td><input class="form-check-input m-2" type="checkbox" onclick="selectRow()">${services[i].servicetype}</td></tr>`
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
            var row = `<tr><td><input class="form-check-input m-2" type="checkbox" onclick="selectRow()">${formattedDate}</td><td>${orders[i].servicetype}</td><td>${orders[i].cabin}</td></tr>`
            table.innerHTML += row;
        }
    } catch (error) {
        console.log(error.message);
    }
}
getReservations();

// Make row selectable & get table values
const selectRow = () => {
    console.log("Here")
}

// Get table values
const getTableValues = () => {
    localStorage.setItem('cabinValue', '')
    localStorage.setItem('serviceValue', '')
}

// Create a new reservation
async function createReservation() {
    try {
        data = {
            "date": document.querySelector("#birthday").value,
            "cabin": "Rasmus cabin",
            "servicetype": "Cleaning"
        }
        const resp = await fetch(API_URL + '/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            timeout: 3000
        })
        const res = await resp.json()
        console.log(res);
        document.querySelector('#resmsg').innerHTML = `<p class="text-success mt-2 mb-0"><b>Reservation created</b></p>`
        getReservations();
    } catch (error) {
        console.log(error.message);
        document.querySelector('#resmsg').innerHTML = `<p class="text-danger mt-2 mb-0"><b>Couldn't create reservation</b></p>`
    }
}

// Delete a reservation
async function deleteReservation() {
    try {
        const tempReservationId = 1;
        const resp = await fetch(API_URL + '/orders/' + tempReservationId, {
            method: 'DELETE',
            timeout: 3000
        })
        const res = await resp.json()
        console.log(res);
        document.querySelector('#resmsg').innerHTML = `<p class="text-success mt-2 mb-0"><b>Reservation deleted successfully</b></p>`
        getReservations();
    } catch (error) {
        console.log(error.message);
        document.querySelector('#resmsg').innerHTML = `<p class="text-danger mt-2 mb-0"><b>Couldn't delete reservation</b></p>`
    }
}

// Modify a reservation
async function modifyReservation() {
    try {
        data = {
            "date": document.querySelector("#birthday").value,
            "cabin": "Rasmus cabin",
            "servicetype": "Lawn mowing"
        }
        const tempReservationId = 2;
        const resp = await fetch(API_URL + '/orders/' + tempReservationId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            timeout: 3000
        })
        const res = await resp.json()
        console.log(res);
        document.querySelector('#resmsg').innerHTML = `<p class="text-success mt-2 mb-0"><b>Reservation updated successfully</b></p>`
        getReservations();
    } catch (error) {
        console.log(error.message);
        document.querySelector('#resmsg').innerHTML = `<p class="text-danger mt-2 mb-0"><b>Couldn't change reservation</b></p>`
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

// Set datepicker value
const setDate = () => {
    let datePicker = document.querySelector("#birthday").value;
    console.log(datePicker);
    localStorage.setItem('selectedDate', datePicker);
}

// Function for signing out
document.querySelector('#signOut').addEventListener('click', async () => {
    localStorage.setItem('userKey', '');
    localStorage.setItem('currentUser', '');
    document.querySelector('#dashboard').style.display = "none";
    document.querySelector('#main').style.visibility = "visible";
    document.querySelector('#msg').innerHTML = '<p class="text-success mt-2 mb-0"><b>Signed out</b></p>'
})