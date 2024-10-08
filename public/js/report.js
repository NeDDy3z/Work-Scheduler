const calendarSelection = document.getElementsByClassName('calendar-selection')[0];
const calendar = document.getElementsByClassName('calendar')[0];

const reportDiv = document.getElementById('report-container');
const reportControls = document.getElementById('report-controls');
const reportTable = document.getElementById('report-table');
const reportHours = document.getElementById('counter');
const reportMoney = document.getElementById('money');

const hideOnExport = document.querySelectorAll('.hide-on-export');

// Fill report table
function reportFillData(year, month) {
    try {
        let hourCount = 0;

        events.forEach(event => {
            if (event.start.date.includes(year) &&
                event.start.date.split('-')[1] == month &&
                event.summary == 'Erik' &&
                typeof event.description !== 'undefined') {
                reportTable.innerHTML += `
                <tr class="report-table-row">
                    <td><input type="text" id="report-table-date" value="${shortDate(event.start.date)}"></td>
                    <td><input type="time" id="report-table-from" min="09:00" max="19:00" onchange="reportUpdate()" value="${event.description.split(';')[0]}"></td>
                    <td><input type="time" id="report-table-to" min="09:00" max="19:00" onchange="reportUpdate()" value="${event.description.split(';')[1]}"></td>
                    <td><input type="text" class="report-table-hour" value="${timeToDecimal(event.description.split(';')[1]) - timeToDecimal(event.description.split(';')[0])}" readonly></td>
                </tr>
                `;

                hourCount += (timeToDecimal(event.description.split(';')[1]) - timeToDecimal(event.description.split(';')[0]));
            }
        });

        reportHours.innerHTML = 'Celkem: <span>' + hourCount.toFixed(2) + '</span> h';
        reportMoney.innerHTML = 'Součet: <span>' + (parseFloat(hourCount) * 175).toFixed(2) + '</span> Kč,-'
    } catch (e) {
        console.log("There was an error filling the report table:\n" + e);
    }
}

// Export to PDF - open print function in browser
function reportExport() {
    try {
        let hourCount = 0;
        document.querySelectorAll('.report-table-row').forEach(row => {
            let hour = (timeToDecimal(row.querySelector('#report-table-to').value) - timeToDecimal(row.querySelector('#report-table-from').value))
            hourCount += hour;
            row.querySelector('.report-table-hour').value = hour;
        });

        reportHours.innerHTML = 'Celkem: <span>' + hourCount.toFixed(2) + '</span> h';
        reportMoney.innerHTML = 'Součet: <span>' + (parseFloat(hourCount) * 175).toFixed(2) + '</span> Kč,-';



        reportClose();
        reportDiv.style.visibility = "visible";
        for (i = 0; i < hideOnExport.length; i++) {
            hideOnExport[i].style.visibility = "hidden";
        }
        window.print();
        for (i = 0; i < hideOnExport.length; i++) {
            hideOnExport[i].style.visibility = "visible";
        }
        reportDiv.style.visibility = "hidden";
    } catch (e) {
        console.log("There was an error exporting the report:\n" + e);
    }
}

// Update report
function reportUpdate() {
    let hourCount = 0;
    document.querySelectorAll('.report-table-row').forEach(row => {
        let hour = (timeToDecimal(row.querySelector('#report-table-to').value) - timeToDecimal(row.querySelector('#report-table-from').value))
        hourCount += hour;
        row.querySelector('.report-table-hour').value = hour.toFixed(2);
    });

    reportHours.innerHTML = 'Celkem: <span>' + hourCount.toFixed(2) + '</span> h';
    reportMoney.innerHTML = 'Součet: <span>' + (parseFloat(hourCount) * 175).toFixed(2) + '</span> Kč,-';
}

// Open report
function reportOpen() {
    calendarSelection.style.display = "none";
    calendar.style.display = "none";

    reportDiv.style.visibility = "visible";
    reportControls.style.display = "block";
    reportDiv.className = 'report-editing';
}

// Close report
function reportClose() {
    calendarSelection.style.display = "flex";
    calendar.style.display = "flex";

    reportDiv.style.visibility = "hidden";
    reportControls.style.display = "none";
    reportDiv.className = '';
}


// Shorten the date
function shortDate(date) {
    try {
        let parts = date.split('-');
        return `${parts[2]}.${parts[1]}.`;
    } catch (e) {
        console.log("There was an error shortening the date:\n" + e);
        return date;
    }

}

// Hour to decimal
function timeToDecimal(time) {
    try {
        let [hours, minutes] = time.split(':').map(Number);
        let decimalMinutes = minutes / 60;

        return hours + decimalMinutes;
    } catch (e) {
        console.log("There was an error converting time to decimal:\n" + e);
        return time;
    }
}
