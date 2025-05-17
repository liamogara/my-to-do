import { formatDate, formatTime, setStatusColor, createStatusHtml } from '/js/helpers.js';

function editTask(taskId) {
    window.location.href = `/task-details/${taskId}`;
}

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
                loadToDoList(filter);
            } else {
                console.error("Error updating status:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error updating status:", error);
        });
}

function deleteTask(taskId, task) {
    fetch('/delete-task', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId, task: task })
    })
        .then(response => {
            if (response.ok) {
                loadToDoList(filter);
            } else {
                console.error("Error deleting task:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error deleting task:", error);
        });
}


function loadToDoList(filter) {
    fetch(`/todolist?filter=${filter}`)
        .then(response => response.json())
        .then(data => {
            const listBody = $("#toDoList");
            listBody.html('');
            data.forEach(task => {
                const item = $("<div>");
                item.addClass('taskContainer');
                item.attr('id',`taskContainer${task.id}`);
                item.html(`
                    <div class="taskHead">
                        <div class="statusSelect">
                            ${createStatusHtml(task.status)}
                            <button type=button class="saveButton">
                                <img alt="Save button icon" src="img/diskette.png"/>
                            </button>
                        </div>

                        <div>
                            <button type=button class="buttonDelete">
                                <img alt="Delete icon" src = "/img/close.png"/>
                            </button>
                        </div>
                    </div>
                    <div class ="taskBody">
                    <p class="task">${task.task}</p>
                    <p class="date">${formatDate(task.date)}</p>
                    <p class="time">${formatTime(task.time)}</p>
                    </div>
                    <div class="taskFoot">
                        <button type=button class="submitButton">
                            Details
                            <img alt="Details icon" src="/img/details.png"/>
                        </button>
                    </div>
                `);
                listBody.append(item);

                $(`#taskContainer${task.id} #status`).on("change", () => {
                    var status = $(`#taskContainer${task.id} #status`);
                    setStatusColor(status);
                    $(`#taskContainer${task.id} .saveButton`).css("visibility", "visible");
                });

                item.find(".saveButton").on("click", () => {
                    var status = $(`#taskContainer${task.id} #status`).find(":selected").text();
                    updateStatus(task.id, status);
                });
                item.find(".submitButton").on("click", () => {
                    editTask(task.id, task.task);
                });
                item.find(".buttonDelete").on("click", () => {
                    deleteTask(task.id, task.task);
                });
            });
        })
        .catch(error => {
            console.error("Error loading list:", error);
        });
}

let filter;
$(document).ready(() => {
    const filterSelect = $('#statusFilter');
    filter = filterSelect.val();

    filterSelect.on('change', ()=>{
        setStatusColor(filterSelect);
    })

    $('#filterButton').on('click', ()=> {
        filter = $('#statusFilter').val();
        loadToDoList(filter);
    })

    loadToDoList(filter);
})