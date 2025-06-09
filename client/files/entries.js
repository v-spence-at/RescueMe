function addEntryWithAjax() {
    const messages = document.getElementById('messages');
    const categoryInput = document.getElementById('categoryInput');
    const numberInput = document.getElementById('numberInput');
    const urlInput = document.getElementById('urlInput');
    const categoryName = categoryInput.value.trim();
    const numberValue = numberInput.value.trim();
    const urlValue = urlInput.value.trim();

    if (categoryName && numberValue && urlValue) {
        entry = {
            number: numberValue, category: categoryName, url: urlValue
        };
        categoryInput.value = '';
        numberInput.value = '';
        urlInput.value = '';

        // Send the category name to the server using AJAX
        fetch('/add-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
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
                console.log('Entry added:', data);
                renderEntry(data.entry);
            })
            .catch(error => {
                console.error('There was a problem with the operation:', error);
                messages.textContent = "Error: " + error;
            });
    } else {
        alert('Please enter a category or a number value.');
    }
}


function deleteEntryWithAjax(tr) {
    const entryId = tr.getAttribute('id');
    const messages = document.getElementById('messages');
    fetch(`/entries/${entryId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                messages.textContent = "Network error";
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Entry deleted:', data);
            messages.textContent = data.message;
        })
        .catch(error => {
            console.error('There was a problem with the delete operation:', error);
            messages.textContent = "Error: " + error;
        });
}


function editEntryWithAjax(tdId, numberInput, categoryInput, urlInput) {
    const messages = document.getElementById('messages');

    const entry = {
        ID: tdId.textContent,
        number: numberInput.value,
        category: categoryInput.value,
        url: urlInput.value
    };

    fetch(`/entries`, {
        method: 'PUT', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(entry)
    })
        .then(response => {
            if (!response.ok) {
                messages.textContent = "Network error";
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Entry updated:', data);
            messages.textContent = data.message;
        })
        .catch(error => {
            console.error('There was a problem with the PUT operation:', error);
            messages.textContent = "Error: " + error;
        });
}


function renderEntry(entry) {
    const tr = document.createElement('tr');
    tr.className = "bordered-cell";
    tr.setAttribute('id', entry.ID);

    const tdID = document.createElement('td');
    tdID.textContent = entry.ID;
    tdID.className = "bordered-cell";
    tr.appendChild(tdID);

    const numberInput = document.createElement('input');
    numberInput.type = 'text';
    numberInput.value = entry.number;

    const tdNumber = document.createElement('td');
    tdNumber.appendChild(numberInput);
    tdNumber.className = "bordered-cell";

    tr.appendChild(tdNumber);

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.value = entry.category;

    const tdCategory = document.createElement('td');
    tdCategory.appendChild(categoryInput);
    tr.appendChild(tdCategory);

    const tdURL = document.createElement('td');
    tdURL.className = "bordered-cell";
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = entry.url;
    tdURL.appendChild(urlInput);
    tr.appendChild(tdURL);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function () {
        editEntryWithAjax(tdID, numberInput, categoryInput, urlInput);
    };

    const tdEdit = document.createElement('td');
    tdEdit.appendChild(editButton);
    tdEdit.className = "bordered-cell";
    tr.appendChild(tdEdit);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        deleteEntryWithAjax(tr);
        tr.remove();
    };

    const tdDelete = document.createElement('td');
    tdDelete.appendChild(deleteButton);
    tdDelete.className = "bordered-cell";
    tr.appendChild(tdDelete);

    document.getElementById('entriesTable').appendChild(tr);
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
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Fetch categories on page load
window.onload = checkAuthentication;