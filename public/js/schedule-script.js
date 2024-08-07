// Constants
const year = document.getElementById('year');
const month = document.getElementById('month');

const addEventButton = document.getElementById('event-add');
const deleteEventButton = document.getElementById('event-delete');
const updateEventButton = document.getElementById('event-update');

const eventContainer = document.getElementById('event-container');
const eventDate = document.getElementById('event-date-p');
const eventDateInput = document.getElementById('event-date');
const eventId = document.getElementById('event-id');
const eventTimeFrom = document.getElementById('event-time-from');
const eventTimeTo = document.getElementById('event-time-to');


// Generate
window.onload = () => {
    try {
        let cookies = document.cookie.split(';');

        if (document.cookie.includes('year') && document.cookie.includes('month')) {
            cookies.forEach(cookie => {
                    if (cookie.includes('year')) year.value = parseInt(cookie.split('=')[1]);
                    if (cookie.includes('month')) month.selectedIndex = parseInt(cookie.split('=')[1]) - 1;
                }
            );
        } else throw "No cookies found";


    } catch (e) {
        console.log("There was an error with loading cookies\n\n" + e);

        setCookie('year', new Date().getFullYear());
        setCookie('month', parseInt(new Date().getMonth()) + 1);

        //window.location.reload();
    }

    generateCalendar();
    reportFillData(year.value, month.selectedIndex + 1);
};


// Set cookies
function setCookie(name, value) {
    try {
        let date = new Date(year.value, month.value, 2);

        document.cookie = name + '=' + value + '; expires=' + date.toUTCString();
    } catch (e) {
        console.log("There was an error with setting cookies\n\n" + e);
    }
}


// Subbmision
function dateSelectionSubmit() {
    try {
        setCookie('year', year.value);
        setCookie('month', month.value);

        document.getElementById('event-select').submit();
    } catch (e) {
        console.log("There was an error with selecting date\n\n" + e);
    }

}

// Generate calendar view
function generateCalendar() {
    // Set start and end date (within the month)
    let yr = year.value;
    let mon = month.value - 1;
    let startDate = new Date(yr, mon, 1);
    let endDate = new Date(yr, mon + 1, 0);


    // Clear calendar
    let calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

    // Create calendar
    let currentDate = new Date(startDate);

    // Adjust start day to Monday (1st column)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);


    // Fill calendar
    while (currentDate <= endDate || currentDate.getDay() !== 1) {
        let weekRow = document.createElement('tr');

        for (let i = 0; i < 7; i++) {
            // Set Google compatible date
            let formattedDate = new Date(year.value, month.value - 1, 2);
            formattedDate = (new Date(formattedDate.setDate(currentDate.getDate() + 1))).toISOString().split('T')[0];

            // Created day cell - insert button & day
            let dayCell = document.createElement('td');
            let button = document.createElement('button');
            let day = document.createElement('p');

            if (currentDate.getMonth() == mon) {
                // Set buttons id to date & click event
                button.id = formattedDate.toString();

                // Set day-date
                day.textContent = currentDate.getDate().toString();
                day.className = 'day';

                button.append(day);
                button.addEventListener('click', eventOpen.bind(this, button));


                // Set data
                if (typeof events !== 'undefined') {
                    for (let event of events) {
                        // Fill calendar
                        if (event.start.date == formattedDate && event.start.date.split('-')[0] == yr && event.start.date.split('-')[1] == mon + 1) {
                            button.style.backgroundColor = 'hsla(0,0%,100%,0.05)';

                            let divTime = document.createElement('div');
                            let from = document.createElement('p');
                            let to = document.createElement('p');

                            if (event.description) {
                                from.textContent = event.description.split(';')[0];
                                to.textContent = event.description.split(';')[1];
                            }
                            from.className = 'time from';
                            to.className = 'time to';

                            divTime.append(from, to);
                            button.append(divTime);
                            button.addEventListener('click', eventOpen.bind(this, button, from.textContent, to.textContent, event.id));
                        }
                    }
                }

                // Append button
                dayCell.append(button);
            }

            // Add day to week
            weekRow.appendChild(dayCell);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // Add week to calendar
        calendarBody.appendChild(weekRow);
    }
}


// Open event for details and editing
function eventOpen(button, from = null, to = null, id = null) {
    try {
        // Show div
        eventContainer.style.display = 'block';

        // Reset
        eventDate.textContent = null;
        eventTimeFrom.value = null;
        eventTimeTo.value = null;
        addEventButton.style.display = 'block';
        deleteEventButton.style.display = 'block';
        updateEventButton.style.display = 'block';


        // Load data (based on a date)
        eventDate.textContent = button.id;
        eventDateInput.value = button.id;
        if (from && to && id) {
            eventTimeFrom.value = from.length <= 4 ? "0".concat(from) : from;
            eventTimeTo.value = to.length <= 4 ? "0".concat(to) : to;

            eventId.value = id;

            addEventButton.style.display = 'none';
        } else {
            eventTimeFrom.value = '10:00'
            eventTimeTo.value = '18:00';

            updateEventButton.style.display = 'none';
            deleteEventButton.style.display = 'none';
        }
    } catch (e) {
        console.log("There was an error with opening event\n\n" + e);
    }
}

// Close event
function eventClose() {
    try {
        eventContainer.style.display = 'none';
    } catch (e) {
        console.log("There was an error with closing event\n\n" + e);
    }
}









