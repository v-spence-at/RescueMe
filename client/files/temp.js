function submitCategories() {
  const categories = [];
  const listItems = document.querySelectorAll("#categoryList li");
  listItems.forEach((item) => {
    categories.push(item.firstChild.textContent); // Get the category name
  });

  if (categories.length > 0) {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure it: POST-request for the URL /addMovies
    xhr.open("POST", "http://localhost:3000/categories", true);

    // Set the request header to indicate JSON data
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Convert the array of IDs to a JSON string
    const jsonData = JSON.stringify(categories);

    // Define what happens on successful data submission
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Handle the response from the server
        console.log("Success:", xhr.responseText);
      } else if (xhr.readyState === 4) {
        // Handle errors
        console.error("Error:", xhr.statusText);
      }
    };

    // Send the request with the JSON string as the payload
    xhr.send(jsonData);
  } else {
    alert("No categories to submit.");
  }
}
