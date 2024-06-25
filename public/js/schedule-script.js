// Constants
// ! Add cookies support
const year = document.getElementById('year');
const month = document.getElementById('month');
// !
const eventContainer = document.getElementById('event-container');
const eventDate = document.getElementById('event-date');

// Set default values based on a current date
year.value = new Date().getFullYear();
month.value = new Date().getMonth() + 1;

// Generate
window.onload = generateCalendar;


// Generate calendar view
function generateCalendar() {
    // Set start and end date
    const yr = year.value;
    const mon = month.value - 1;
    const startDate = new Date(yr, mon, 1);
    const endDate = new Date(yr, mon + 1, 0);

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
            // Created day cell - insert button & day
            const dayCell = document.createElement('td');
            const button = document.createElement('button');
            const day = document.createElement('p');
            const divTime = document.createElement('div');
            const from = document.createElement('p');
            const to = document.createElement('p');

            if (currentDate.getMonth() === mon) {
                // Set buttons id to date & click event
                button.id = currentDate.toDateString()
                button.addEventListener('click', openEvent);

                // Set data
                day.textContent = currentDate.getDate();
                day.className = 'day';
                from.textContent = '10:00'; // ! TIME FROM & TO
                to.textContent = '18:00';
                from.className = 'time from';
                to.className = 'time to';

                // Append elements
                divTime.append(from, to);
                button.append(day, divTime);
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
function openEvent(button) {
    // Show div
    eventContainer.style.display = 'block';

    // Load data (based on a date)
    eventDate.textContent = button.target.id;
}

// Close event
function closeEvent() {
    eventContainer.style.display = 'none';
}

// Submit new/changes to an event
function submitEvent() {
    // Post data to server
}