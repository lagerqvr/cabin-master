/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
//

// Logic for datepicker
if (localStorage.getItem('selectedDate') == '') {
    document.querySelector("#birthday").valueAsDate = new Date();
} else {
    document.querySelector("#birthday").value = localStorage.getItem('selectedDate')
}

// API URL for API 2
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

// Get token from API 1
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

// Check if user has JWT
const checkAuth = () => {
    let userKey = localStorage.getItem('userKey');
    /* console.log(userKey) */
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

        const table = document.querySelector('#cabins');

        table.innerHTML = "";
        let cabinCount = 0;
        let checkNum = 0;

        for (var i = 0; i < cabins.length; i++) {
            cabinCount += 1;
            checkNum += 1;
            var row = `<tr><td><input class="form-check-input res-input" type="checkbox" id="checkC${checkNum}" onclick="selectCabin(this, this.id)">Cabin ${cabinCount} - ${cabins[i].address}</td></tr>`
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

        const table = document.querySelector('#services');

        table.innerHTML = "";
        let checkNum = 0;

        for (var i = 0; i < services.length; i++) {
            checkNum += 1;
            var row = `<tr><td><input class="form-check-input res-input" type="checkbox" id="checkS${checkNum}" onclick="selectService(this, this.id)">${services[i].servicetype}</td></tr>`
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

        const table = document.querySelector('#orders');

        table.innerHTML = "";
        let checkNum = 0;

        for (var i = 0; i < orders.length; i++) {
            let date = orders[i].date;
            let formattedDate = date.substring(0, 10);
            checkNum += 1;
            var row = `<tr><td><input class="form-check-input res-input" type="checkbox" id="checkR${checkNum}"
            onclick="selectRes(this, this.id)">${orders[i].id}</td>
            <td contenteditable="true" id="resDate${orders[i].id}">${formattedDate}</td>
            <td contenteditable="true" id="resType${orders[i].id}">${orders[i].servicetype}</td>
            <td contenteditable="true" id="resCabin${orders[i].id}">${orders[i].cabin}</td></tr>`
            table.innerHTML += row;
        }
    } catch (error) {
        console.log(error.message);
    }
}
getReservations();

// Select cabin & get value
const selectCabin = (e, id) => {
    try {
        for (var i = 1; i <= 3; i++) {
            if ("checkC" + i === id && document.getElementById("checkC" + i).checked === true) {
                document.getElementById("checkC" + i).checked = true;
            } else {
                document.getElementById("checkC" + i).checked = false;
            }
        }
        let cabin = e.parentElement.innerText;
        let formattedCabin = cabin.substring(10);

        localStorage.setItem('selectedCabin', formattedCabin);
    } catch (error) {
        console.log(error.message);
    }
}

// Select cabin & get value
const selectService = (e, id) => {
    try {
        for (var i = 1; i <= 3; i++) {
            if ("checkS" + i === id && document.getElementById("checkS" + i).checked === true) {
                document.getElementById("checkS" + i).checked = true;
            } else {
                document.getElementById("checkS" + i).checked = false;
            }
        }
        let service = e.parentElement.innerText;

        localStorage.setItem('selectedService', service);
    } catch (error) {

    }
}

// Select reservation & get value
const selectRes = (e, id) => {
    try {
        let tableLength = document.getElementById("res-table").rows.length - 1;
        for (var i = 1; i <= tableLength; i++) {
            if ("checkR" + i === id && document.getElementById("checkR" + i).checked === true) {
                document.getElementById("checkR" + i).checked = true;
            } else {
                document.getElementById("checkR" + i).checked = false;
            }
        }
        let res = e.parentElement.innerText;
        console.log(res)

        localStorage.setItem('selectedRes', res);
    } catch (error) {
        console.log(error.message);
    }
}


// Create a new reservation
async function createReservation() {
    try {
        data = {
            "date": document.querySelector("#birthday").value,
            "cabin": localStorage.getItem('selectedCabin'),
            "servicetype": localStorage.getItem('selectedService')
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
        let resId = localStorage.getItem('selectedRes');
        const resp = await fetch(API_URL + '/orders/' + resId, {
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
        let resId = localStorage.getItem('selectedRes');
        data = {
            "date": document.querySelector(`#resDate${resId}`).innerText,
            "cabin": document.querySelector(`#resCabin${resId}`).innerText,
            "servicetype": document.querySelector(`#resType${resId}`).innerText
        }

        const resp = await fetch(API_URL + '/orders/' + resId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            timeout: 3000
        })
        const res = await resp.json()
        console.log(res);
        document.querySelector('#resmsg').innerHTML = `<p class="text-success mt-2 mb-0"><b>Reservation ${resId} updated successfully</b></p>`
        getReservations();
    } catch (error) {
        console.log(error.message);
        document.querySelector('#resmsg').innerHTML = `<p class="text-danger mt-2 mb-0"><b>Couldn't change reservation</b></p>`
    }
}

// Function for signing in
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
    try {
        let datePicker = document.querySelector("#birthday").value;
        console.log(datePicker);
        localStorage.setItem('selectedDate', datePicker);
    } catch (error) {
        console.log(error.message);
    }
}

// Function for signing out
document.querySelector('#signOut').addEventListener('click', async () => {
    localStorage.setItem('userKey', '');
    localStorage.setItem('currentUser', '');
    document.querySelector('#dashboard').style.display = "none";
    document.querySelector('#main').style.visibility = "visible";
    document.querySelector('#msg').innerHTML = '<p class="text-success mt-2 mb-0"><b>Signed out</b></p>'
})