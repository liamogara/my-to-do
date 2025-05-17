function formatDate(date)
{
    const fullDate = new Date(date);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }
    return fullDate.toLocaleDateString(undefined, options);
}

function formatDateTime(date)
{
    const fullDate = new Date(date);
    return fullDate.toLocaleString("en-US");
}

function createSqlDate()
{
    var date = (new Date()).toISOString().slice(0, -5).replace('T', ' ');
    return date;
}

function formatTime(time)
{
    const fullDate = new Date("1970-01-01T" + time);
    return fullDate.toLocaleTimeString();
}

function setStatusColor(status) {
    switch (status.val()) {
        case ("New"):
            status.css("color", "#89929b");
            break;
        case ("Active"):
            status.css("color", "#77bdfb");
            break;
        case ("Done"):
            status.css("color", "#006600");
            break;
        default:
            status.css("color", "#ecf2f8");
            break;
    }
}

function createStatusHtml(status) {
    var html = "";
    switch (status) {
        case ('Active'):
            html = `<select id="status" name="status" style='color:#77bdfb' required>
                <option value="New">New</option>
                <option value="Active" selected>Active</option>
                <option value="Done">Done</option>
            </select>`;
            break;
        case ('Done'):
            html = `<select id="status" name="status" style='color:#006600' required>
                <option value="New">New</option>
                <option value="Active">Active</option>
                <option value="Done" selected>Done</option>
            </select>`;
            break;
        default:
            html = `<select id="status" name="status" style='color:#89929b' required>
                <option value="New" selected>New</option>
                <option value="Active">Active</option>
                <option value="Done">Done</option>
            </select>`;
            break;
    }
    return html;
}

export {
    formatDate,
    formatTime,
    formatDateTime,
    setStatusColor,
    createStatusHtml,
    createSqlDate,
};