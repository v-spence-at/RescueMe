window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  const title = document.getElementById("page-title");
  const container = document.getElementById("entriesContainer");

  if (!category) {
    title.textContent = "Unknown Category";
    container.innerHTML = "<p>No category specified.</p>";
    return;
  }

  title.textContent = `Vets for ${capitalize(category)}`;

  fetch("/entries")
    .then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then((entries) => {
      const filtered = entries.filter(
        (entry) => entry.category.toLowerCase() === category.toLowerCase()
      );

      if (filtered.length === 0) {
        container.innerHTML = "<p>No entries found for this category.</p>";
        return;
      }
      const list = document.createElement("ul");

      filtered.forEach((entry) => {
        /*extract lat and lng from the url*/
        const coordinates = extractCoordinates(entry.url);
        const linkToMap = coordinates
          ? `map.html?lat=${coordinates.lat}&lng=${
              coordinates.lng
            }&name=${encodeURIComponent(entry.name || entry.number)}`
          : entry.url;
        const li = document.createElement("li");
        li.innerHTML = `<strong> Name:</strong> ${
          entry.name || entry.number
        }<br>
                        <strong>Address:</strong>${
                          entry.address || "Not provided"
                        }<br>
                        <strong>Phone: </strong>${entry.number}<br>
                        <a href="${linkToMap}" target="_blank">View on Map</a>
                        <hr>
                    `;

        list.appendChild(li);
      });
      container.innerHTML = ""; // Clear previous content
      container.appendChild(list);
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = "<p>Error loading entries.</p>";
    });
};
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function extractCoordinates(url) {
  const match = url.match(/mlat=([0-9.]+)&mlon=([0-9.]+)/);
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2]),
    };
  }
  return null; // Return null if no coordinates found
}
