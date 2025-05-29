function renderNumbers(numbers) {
    numbers.forEach(number => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = number.number;
        td.className = 'bordered-table';
        tr.appendChild(td);
        const td2 = document.createElement('td');
        td2.textContent = number.category;
        td2.className = 'bordered-table';
        tr.appendChild(td2);

        document.getElementById('numbersTable').appendChild(tr);
    });
}

function fetchNumbers() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const bodyElement = document.querySelector("body");
        if (xhr.status === 200) {
            const numbers = JSON.parse(xhr.responseText);
            renderNumbers(numbers);
            console.log(numbers);
        } else {
            bodyElement.append(
                "Daten konnten nicht geladen werden, Status " +
                xhr.status +
                " - " +
                xhr.statusText
            );
        }

    };
    xhr.open("GET", "/numbers");
    xhr.send();
}

// Fetch categories on page load
window.onload = function () {
    fetchNumbers();
};
