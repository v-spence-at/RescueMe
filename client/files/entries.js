function addEntryWithAjax() {
  const messages = document.getElementById("messages");
  const nameInput = document.getElementById("nameInput");
  const addressInput = document.getElementById("addressInput");
  const categoryInput = document.getElementById("categoryInput");
  const numberInput = document.getElementById("numberInput");
  const urlInput = document.getElementById("urlInput");

  const categoryValue = categoryInput.value.trim();
  const nameValue = nameInput.value.trim();
  const addressValue = addressInput.value.trim();
  const numberValue = numberInput.value.trim();
  const urlValue = urlInput.value.trim();

  if (nameValue && numberValue && categoryValue && urlValue) {
    const entry = {
      name: nameValue,
      address: addressValue,
      number: numberValue,
      category: categoryValue,
      url: urlValue,
    };
    // Clear the input fields after submission
    nameInput.value = "";
    addressInput.value = "";
    categoryInput.value = "";
    numberInput.value = "";
    urlInput.value = "";

    // Send the category name to the server using AJAX
    fetch("/add-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        messages.textContent = data.message;
        console.log("Entry added:", data);
        renderEntry(data.entry);
      })
      .catch((error) => {
        console.error("TError:", error);
        messages.textContent = "Error: " + error.message;
      });
  } else {
    alert("Please fill in the required fields.");
  }
}

function deleteEntryWithAjax(tr) {
  const entryId = tr.getAttribute("id");
  const messages = document.getElementById("messages");
  fetch(`/entries/${entryId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      messages.textContent = data.message;
      tr.remove(); // Remove the row from the table
    })
    .catch((error) => {
      console.error("Delete error", error);
      messages.textContent = "Error: " + error.message;
    });
}

function editEntryWithAjax(
  tdId,
  nameInput,
  addressInput,
  numberInput,
  categoryInput,
  urlInput
) {
  const messages = document.getElementById("messages");

  const entry = {
    ID: tdId.textContent,
    name: nameInput.value,
    address: addressInput.value,
    number: numberInput.value,
    category: categoryInput.value,
    url: urlInput.value,
  };

  fetch(`/entries`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      messages.textContent = data.message;
      console.log("Entry updated:", data);
    })
    .catch((error) => {
      console.error("Update error:", error);
      messages.textContent = "Error: " + error.message;
    });
}

function renderEntry(entry) {
  const tr = document.createElement("tr");
  tr.className = "bordered-cell";
  tr.setAttribute("id", entry.ID);

  const tdID = document.createElement("td");
  tdID.textContent = entry.ID;
  tdID.className = "bordered-cell";
  tr.appendChild(tdID);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = entry.name;

  const tdName = document.createElement("td");
  tdName.appendChild(nameInput);
  tdName.className = "bordered-cell";
  tr.appendChild(tdName);

  const addressInput = document.createElement("input");
  addressInput.type = "text";
  addressInput.value = entry.address;

  const tdAddress = document.createElement("td");
  tdAddress.appendChild(addressInput);
  tdAddress.className = "bordered-cell";
  tr.appendChild(tdAddress);

  const numberInput = document.createElement("input");
  numberInput.type = "text";
  numberInput.value = entry.number;

  const tdNumber = document.createElement("td");
  tdNumber.appendChild(numberInput);
  tdNumber.className = "bordered-cell";
  tr.appendChild(tdNumber);

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.value = entry.category;

  const tdCategory = document.createElement("td");
  tdCategory.appendChild(categoryInput);
  tr.appendChild(tdCategory);

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.value = entry.url;

  const tdUrl = document.createElement("td");
  tdUrl.appendChild(urlInput);
  tdUrl.className = "bordered-cell";
  tr.appendChild(tdUrl);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = function () {
    editEntryWithAjax(
      tdID,
      nameInput,
      addressInput,
      numberInput,
      categoryInput,
      urlInput
    );
  };

  const tdEdit = document.createElement("td");
  tdEdit.appendChild(editButton);
  tdEdit.className = "bordered-cell";
  tr.appendChild(tdEdit);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteEntryWithAjax(tr);
    tr.remove();
  };

  const tdDelete = document.createElement("td");
  tdDelete.appendChild(deleteButton);
  tdDelete.className = "bordered-cell";
  tr.appendChild(tdDelete);

  document.getElementById("entriesTable").appendChild(tr);
}


function fetchEntriesWithAjax() {
    fetch("/entries", {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                messages.textContent = "Network error";
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            messages.textContent = data.message;
            data.forEach(entry => {
                renderEntry(entry);
            });
            console.log(data);
        })
        .catch(error => {
            console.error('data could not be loaded:', error);
            messages.textContent = "Error: " + error;
        });
}

// Function to check if the user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        // No token found, redirect to login
        window.location.href = 'login.html';
    } else {
        // Token is valid, proceed to load entries
        fetchEntriesWithAjax(); // Call a function to load entries data
   }
}

function clearSession() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}


function getAddressWithAjax(latlng) {
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
            urlField.textContent = "URL: " + data.url;
        })
        .catch((error) => {
            console.error("There was a problem with the operation:", error);
            messages.textContent = "Error: " + error;
        });
}


function loadMap() {
    const map = L.map("map").setView([48.2064, 14.2858], 8); // Center of Austria

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(map);

    let marker;

    // Add click event to the map
    map.on("click", function (e) {
        if (marker) {
            map.removeLayer(marker); // Remove existing marker
        }
        marker = L.marker(e.latlng).addTo(map); // Add new marker
        console.log("Selected location:", e.latlng.lat, e.latlng.lng);
        const loc = document.getElementById("location");
        loc.textContent =
            "latitude:" + e.latlng.lat + " longitude: " + e.latlng.lng;
        getAddressWithAjax(e.latlng);
    });
}

// Check if allowed to edit and load the map
window.onload = function () {
    checkAuthentication();
    this.loadMap();
}
