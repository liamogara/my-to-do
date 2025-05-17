async function login(username, password) {
    fetch("/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username : username, password: password })
    })
        .then (response => {
            if (response.ok) {
                window.location.href = '/todo';
            } else {
                $('#errorMessage').html("Invalid username/password.");
                $('#username').val('');
                $('#password').val('');
            }
        })
        .catch(error => {
            console.error("Error logging in:", error);
        });
}

$(document).ready(() => {
    $('#loginButton').on('click', () => {
        const username = $('#username').val();
        const password = $('#password').val();
        $('#errorMessage').html('');
        login(username, password);
    })
    $('#createUserButton').on('click', () => {
        window.location.href = '/create-user';
    })
})