function addEntryWithAjax() {
    const categoryInput = document.getElementById('categoryInput');
    const numberInput = document.getElementById('numberInput');
    const categoryName = categoryInput.value.trim();
    const numberValue = numberInput.value.trim();

    if (categoryName && numberValue) {
        entry = {
            number: numberValue,
            category: categoryName
        };
        renderEntry(entry);
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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Category added:', data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        alert('Please enter a category name.');
    }
}


function deleteEntryWithAjax(tr) {
    const entryId = tr.getAttribute('id');

    fetch(`/entries/${entryId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Entry deleted:', data);
            // Optionally, update the UI to reflect the deletion
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function renderEntry(entry) {
    const tr = document.createElement('tr');
    tr.setAttribute('id', entry.ID);
    const td = document.createElement('td');

    td.textContent = entry.number;
    td.className = 'bordered-table';
    tr.appendChild(td);
    const td2 = document.createElement('td');
    td2.textContent = entry.category;
    td2.className = 'bordered-table';
    tr.appendChild(td2);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        deleteEntryWithAjax(tr);
        tr.remove();
    };
    const td3 = document.createElement('td');
    td3.appendChild(deleteButton);
    tr.appendChild(td3);

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

// Fetch categories on page load
window.onload = function () {
    fetchEntries();
};