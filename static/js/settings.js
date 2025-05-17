async function logout() {
    fetch("/logout")
        .then (response => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error("Error logging out:", error);
        });
}

$(document).ready(() => {
    $('#logoutButton').on('click', () => {
        logout();
    })
    $('#backButton').on("click", () => {
        window.location.href = '/todo';
    });
    $('#deleteUserButton').on('click', () => {
        window.location.href = '/delete-user';
    })
})