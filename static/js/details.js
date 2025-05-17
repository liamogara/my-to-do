import { setStatusColor, createSqlDate, formatDateTime } from '/js/helpers.js';

function updateStatus(taskId, status) {
    fetch('/update-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId, status: status })
    })
        .then(response => {
            if (response.ok) {
                $('#saveStatus').css("visibility", "hidden");
            } else {
                console.error("Error updating status:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error updating status:", error);
        });
}

function updateDescription(taskId, description) {
    fetch('/update-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId, description: description })
    })
        .then(response => {
            if (response.ok) {
                $('#saveDescription').css("visibility", "hidden");
            } else {
                console.error("Error updating description:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error updating description:", error);
        });
}

function deleteTask(taskId) {
    fetch('/delete-task', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId })
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '../todo';
            } else {
                console.error("Error deleting task:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error deleting task:", error);
        });
}

function addComment(taskId, content) {
    fetch('/add-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId: taskId, content: content, date: (createSqlDate()) })
    })
        .then(response => {
            if (response.ok) {

            } else {
                console.error("Error adding comment:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error adding comment:", error);
        })
}

function deleteComment(taskId, commentId) {
    fetch('/delete-comment', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: commentId })
    })
        .then(response => {
            if (response.ok) {
                loadCommentSection(taskId);
            } else {
                console.error("Error deleting comment:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error deleting comment:", error);
        });
}

function loadCommentSection(taskId) {
    fetch(`/comments?taskId=${taskId}`)
        .then(response => response.json())
        .then(data => {
            const commentsSection = $("#commentsSection");
            commentsSection.html('');
            data.forEach(comment => {
                const newComment = $('<div>');
                newComment.addClass('comment');
                newComment.html(`
                                        <div class="commentHead">
                                            <span class='commentDate'>
                                                ${formatDateTime(comment.date)}
                                            </span>
                                            <button type='button' class='deleteCommentButton'>
                                                <img alt="Delete icon" src = "/img/close.png"/>
                                            </button>
                                        </div>
                                        <div class ="commentBody">
                                            <p>${comment.content}</p>
                                        </div>
                `);

                commentsSection.append(newComment);

                newComment.find(".deleteCommentButton").on("click", () => {
                    deleteComment(taskId, comment.id);
                });
            });
        })
        .catch(error => {
            console.error("Error getting comments section:", error);
        })
}

$(document).ready(() => {
    var id = taskId;
    var status = $('#status');
    setStatusColor(status);
    status.on("change", () => {
        setStatusColor(status);
        $('#saveStatus').css("visibility", "visible");
    });

    $('#description').on("change", () => {
        $('#saveDescription').css("visibility", "visible");
    });

    $('#backButton').on("click", () => {
        window.location.href = '/todo';
    });

    $('#saveStatus').on("click", () => {
        var statusVal = status.find(":selected").text();
        updateStatus(id, statusVal);
    });

    $('#saveDescription').on("click", () => {
        var description = $('#description').val();
        updateDescription(id, description);
    });

    $('#addCommentButton').on("click", () => {
        var content = $('#comment').val();
        if (content != "") {
            $('#comment').val("");
            addComment(id, content);
            loadCommentSection(id);
        }
    });

    $('.buttonDelete').on("click", () => {
        deleteTask(id);
    });

    loadCommentSection(id);
})