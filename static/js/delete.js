function deleteUser() {
    fetch('/delete-user', {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '../login';
            } else {
                console.error("Error deleting user:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error deleting user:", error);
        });
}

$(document).ready(() => {
    $('#backButton').on("click", () => {
        window.location.href = '/todo';
    });
    $('#deleteUserButton').on('click', () => {
        deleteUser();
    })
})