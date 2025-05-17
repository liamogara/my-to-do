async function createUser(username, password) {
    fetch("/create-user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username : username, password: password })
    })
        .then (response => {
            if (response.ok) {
                window.location.href = '/login';
            } else {
                $('#errorMessage').html("Error creating user. Please enter different user details.");
                $('#username').val('');
                $('#password').val('');
                $('#password#Confirm').val('');
            }
        })
        .catch(error => {
            console.error("Creating user:", error);
        });
}

$(document).ready(() => {
    $('#createUserButton').on('click', () => {
        if ($('#password').val() != $('#passwordConfirm').val()) {
            $('#errorMessage').html('Passwords must match.');
        }
        else {
            const username = $('#username').val();
            const password = $('#password').val();
            $('#errorMessage').html('');
            createUser(username, password);
        }
    })
    $('#clearButton').on("click", () => {
        $('#username').val('');
        $('#password').val('');
        $('#passwordConfirm').val('');
    });
    $('#backButton').on("click", () => {
        window.location.href = '/login';
    });
})