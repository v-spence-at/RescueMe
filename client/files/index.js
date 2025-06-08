function updateMap(url, map) {
    // Create a URL object
    const urlObj = new URL(url);

    // Use URLSearchParams to get the parameters
    const params = new URLSearchParams(urlObj.search);
    const latlng = {
       "lat": params.get('mlat'),
       "lng": params.get('mlon')
    };

    marker = L.marker(latlng).addTo(map);
    map.setView(latlng, 15);
    getAddress(latlng);
}

function renderEntries(entries, map) {
    entries.forEach(entry => {
        const tr = document.createElement('tr');
        const tdNumber = document.createElement('td');
        tdNumber.textContent = entry.number;
        tdNumber.className = 'bordered-cell';
        tr.appendChild(tdNumber);
        const tdCategory = document.createElement('td');
        tdCategory.textContent = entry.category;
        tdCategory.className = 'bordered-cell';
        tr.appendChild(tdCategory);
        const tdURL = document.createElement('td');
        const a = document.createElement('a');
        a.href = entry.url;
        a.textContent = "show-on-map";
        a.onclick = function () {
            updateMap(entry.url, map);
            return false;
        }
        tdURL.appendChild(a);
        tdURL.className = 'bordered-cell';
        tr.appendChild(tdURL);
        document.getElementById('entriesTable').appendChild(tr);
    });
}

function fetchEntries(map) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const bodyElement = document.querySelector("body");
        if (xhr.status === 200) {
            const entries = JSON.parse(xhr.responseText);
            renderEntries(entries, map);
        } else {
            bodyElement.append(
                "Daten konnten nicht geladen werden, Status " +
                xhr.status +
                " - " +
                xhr.statusText
            );
        }

    };
    xhr.open("GET", "/entries");
    xhr.send();
}

// Fetch entries on page load
window.onload = function () {
    const map = L.map('map').setView([48.2064, 14.2858], 8); // Center of Austria

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    fetchEntries(map);
};

function getAddress(latlng) {
    const addressField = document.getElementById("addressField");
    const urlField = document.getElementById("urlField");
    const address =
        "/address?query=" + encodeURIComponent(latlng.lat + "+" + latlng.lng);
    fetch(address, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                messages.textContent = "Network error";
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Address added:", data);
            addressField.textContent = "Address: " + data.address;
            const a = document.createElement('a');
            a.href = data.url;
            a.textContent = data.url;
            a.target = '_blank';
            a.rel="noopener noreferrer"
            urlField.innerHTML = "";
            urlField.appendChild(a);
        })
        .catch((error) => {
            console.error("There was a problem with the operation:", error);
            messages.textContent = "Error: " + error;
        });
}
