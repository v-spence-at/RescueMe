function addCategory() {
    const input = document.getElementById('categoryInput');
    const categoryName = input.value.trim();
    if (categoryName) {
        const li = document.createElement('li');
        li.textContent = categoryName;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            li.remove();
        };

        li.appendChild(deleteButton);
        document.getElementById('categoryList').appendChild(li);
        input.value = ''; // Clear the input field
    } else {
        alert('Please enter a category name.');
    }
}

function addCategoryWithAjax() {
    const input = document.getElementById('categoryInput');
    const categoryName = input.value.trim();

    if (categoryName) {
        // Create a new list item
        const li = document.createElement('li');
        li.textContent = categoryName;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            li.remove();
        };

        li.appendChild(deleteButton);
        document.getElementById('categoryList').appendChild(li);
        input.value = ''; // Clear the input field

        // Send the category name to the server using AJAX
        fetch('/add-category', { // Replace with your server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: categoryName })
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

function submitCategories() {
    const categories = [];
    const listItems = document.querySelectorAll('#categoryList li');
    listItems.forEach(item => {
        categories.push(item.firstChild.textContent); // Get the category name
    });

    if (categories.length > 0) {
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Configure it: POST-request for the URL /addMovies
        xhr.open('POST', 'http://localhost:3000/categories', true);

        // Set the request header to indicate JSON data
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Convert the array of IDs to a JSON string
        const jsonData = JSON.stringify(categories);

        // Define what happens on successful data submission
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Handle the response from the server
                console.log('Success:', xhr.responseText);
            } else if (xhr.readyState === 4) {
                // Handle errors
                console.error('Error:', xhr.statusText);
            }
        };

        // Send the request with the JSON string as the payload
        xhr.send(jsonData);
    } else {
        alert('No categories to submit.');
    }
}

function renderEntries(entries) {
    entries.forEach(entry => {
        const tr = document.createElement('tr');
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
            tr.remove();
        };
        const td3 = document.createElement('td');
        td3.appendChild(deleteButton);
        tr.appendChild(td3);

        document.getElementById('entriesTable').appendChild(tr);
    });
}

function fetchEntries() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const bodyElement = document.querySelector("body");
        if (xhr.status === 200) {
            const entries = JSON.parse(xhr.responseText);
            renderEntries(entries);
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