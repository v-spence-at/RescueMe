function addEntryWithAjax() {
    const messages = document.getElementById('messages');
    const categoryInput = document.getElementById('categoryInput');
    const numberInput = document.getElementById('numberInput');
    const categoryName = categoryInput.value.trim();
    const numberValue = numberInput.value.trim();

    if (categoryName && numberValue) {
        entry = {
            number: numberValue, category: categoryName
        };
        categoryInput.value = '';
        numberInput.value = '';

        // Send the category name to the server using AJAX
        fetch('/add-entry', { // Replace with your server endpoint
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


function editEntryWithAjax(tdId, numberInput, categoryInput) {
    const messages = document.getElementById('messages');

    const entry = {
        ID: tdId.textContent,
        number: numberInput.value,
        category: categoryInput.value
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
    tr.setAttribute('id', entry.ID);

    const tdID = document.createElement('td');
    tdID.textContent = entry.ID;
    tr.appendChild(tdID);

    const numberInput = document.createElement('input');
    numberInput.type = 'text';
    numberInput.value = entry.number;

    const tdNumber = document.createElement('td');
    tdNumber.appendChild(numberInput);
    tr.appendChild(tdNumber);

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.value = entry.category;

    const tdCategory = document.createElement('td');
    tdCategory.appendChild(categoryInput);
    tr.appendChild(tdCategory);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function () {
        editEntryWithAjax(tdID, numberInput, categoryInput);
    };

    const tdEdit = document.createElement('td');
    tdEdit.appendChild(editButton);
    tr.appendChild(tdEdit);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        deleteEntryWithAjax(tr);
        tr.remove();
    };

    const tdDelete = document.createElement('td');
    tdDelete.appendChild(deleteButton);
    tr.appendChild(tdDelete);

    document.getElementById('entriesTable').appendChild(tr);
}


function fetchEntries() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const bodyElement = document.querySelector("body");
        if (xhr.status === 200) {
            const entries = JSON.parse(xhr.responseText);
            entries.forEach(entry => {
                renderEntry(entry);
            });
            console.log(entries);
        } else {
            bodyElement.append("Daten konnten nicht geladen werden, Status " + xhr.status + " - " + xhr.statusText);
        }

    };
    xhr.open("GET", "/entries");
    xhr.send();
}

// Fetch categories on page load
window.onload = function () {
    fetchEntries();
};