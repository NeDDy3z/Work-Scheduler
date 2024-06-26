// Constants
const year = document.getElementById('year');
const month = document.getElementById('month');

const addEventButton = document.getElementById('event-add');
const deleteEventButton = document.getElementById('event-delete');
const updateEventButton = document.getElementById('event-update');

const eventContainer = document.getElementById('event-container');
const eventDate = document.getElementById('event-date-p');
const eventDateInput = document.getElementById('event-date');
const eventTimeFrom = document.getElementById('event-time-from');
const eventTimeTo = document.getElementById('event-time-to');



// Set default values based on a current date
year.value = new Date().getFullYear();
month.value = new Date().getMonth() + 1;

// Generate
window.onload = generateCalendar;



// Generate calendar view
function generateCalendar() {
    // Set start and end date
    let yr = year.value;
    let mon = month.value - 1;
    let startDate = new Date(yr, mon, 1);
    let endDate = new Date(yr, mon + 1, 0);


    // Clear calendar
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

    // Create calendar
    let currentDate = new Date(startDate);

    // Adjust start day to Monday (1st column)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    // Fill calendar
    while (currentDate <= endDate || currentDate.getDay() !== 1) {
        const weekRow = document.createElement('tr');

        for (let i = 0; i < 7; i++) {
            // Set Google compatible date
            let formattedDate = new Date();
            formattedDate = (new Date(formattedDate.setDate(currentDate.getDate()))).toISOString().split('T')[0];

            // Created day cell - insert button & day
            const dayCell = document.createElement('td');
            const button = document.createElement('button');
            const day = document.createElement('p');

            if (currentDate.getMonth() === mon) {
                // Set buttons id to date & click event
                button.id = formattedDate;

                // Set day-date
                day.textContent = currentDate.getDate();
                day.className = 'day';

                button.append(day);
                button.addEventListener('click', openEvent.bind(this, button));

                // Set data
                for (let event of events) {
                    if (event.start.date === formattedDate && event.start.date.split('-')[0] == yr && event.start.date.split('-')[1] == mon+1) {
                        const divTime = document.createElement('div');
                        const from = document.createElement('p');
                        const to = document.createElement('p');

                        from.textContent = event.description.split(';')[0];
                        to.textContent = event.description.split(';')[1];
                        from.className = 'time from';
                        to.className = 'time to';

                        divTime.append(from, to);
                        button.append(divTime);
                        button.addEventListener('click', openEvent.bind(this, button, from.textContent, to.textContent));
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
function openEvent(button, from = null, to = null) {
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
    if (from && to) {
        eventTimeFrom.value = from.length <= 4 ? "0".concat(from) : from;
        eventTimeTo.value = to.length <= 4 ? "0".concat(to) : to;

        addEventButton.style.display = 'none';
    }
    else {
        updateEventButton.style.display = 'none';
        deleteEventButton.style.display = 'none';
    }
}

// Close event
function closeEvent() {
    eventContainer.style.display = 'none';
}
