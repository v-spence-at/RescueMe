document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }
            return response.json();
        })
        .then(data => {
            // Store the JWT in local storage
            localStorage.setItem('token', data.token);
            // Redirect to entries page
            window.location.href = 'entries.html';
        })
        .catch(error => {
            // Display error message
            document.getElementById('errorMessage').innerText = error.message;
        });
});