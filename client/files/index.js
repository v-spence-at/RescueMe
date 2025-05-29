window.onload = function () {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const bodyElement = document.querySelector("body");
        if (xhr.status === 200) {
            const categories = JSON.parse(xhr.responseText);
            console.log(categories);
            bodyElement.append(displayCategories(categories));
        } else {
            bodyElement.append(
                "Daten konnten nicht geladen werden, Status " +
                xhr.status +
                " - " +
                xhr.statusText
            );
        }

    };
    xhr.open("GET", "/categories");
    xhr.send();
};

// Function to display movies
function displayCategories(categories) {

    const root = document.createElement('root');
    const ul = document.createElement('ul');
    categories.forEach(category => {
        const li = document.createElement('li');
        li.append(category);
        ul.append(li);
    });
    root.append(ul);
    return root;
}

