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
    fetchEntries();
};
