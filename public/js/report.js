const reportDiv = document.getElementById('report');
const reportTable = document.getElementById('report-table');
const reportHours = document.getElementById('counter');
const reportMoney = document.getElementById('money');



// Fill report table
function reportFillData(year, month) {
    try {
        let hourCount = 0;

        events.forEach(event => {
            if (event.start.date.includes(year) &&
                event.start.date.split('-')[1] == month &&
                event.summary == 'Erik' &&
                typeof event.description !== 'undefined') {
                let reportTableRow = document.createElement('tr');
                let reportTableDate = document.createElement('td');
                let reportTableFrom = document.createElement('td');
                let reportTableTo = document.createElement('td');
                let reportTableHours = document.createElement('td');

                reportTableDate.textContent = shortDate(event.start.date);
                if (typeof event.description !== 'undefined' && event.description.length == 11 && event.description.includes(';')) {
                    reportTableFrom.textContent = event.description.split(';')[0];
                    reportTableTo.textContent = event.description.split(';')[1];
                    reportTableHours.textContent = timeToDecimal(event.description.split(';')[1]) - timeToDecimal(event.description.split(';')[0]);
                }

                reportTableRow.appendChild(reportTableDate);
                reportTableRow.appendChild(reportTableFrom);
                reportTableRow.appendChild(reportTableTo);
                reportTableRow.appendChild(reportTableHours);

                hourCount += parseFloat(reportTableHours.textContent);

                reportTable.appendChild(reportTableRow);
            }

            reportHours.innerHTML = 'Celkem h.: <span>'+ hourCount +'</span> h';
            reportMoney.innerHTML = 'Součet: <span>'+ hourCount * 175 +'</span> Kč,-';
        });
    } catch (e) {
        console.log("There was an error fillling the report table: \n\n" + e);
    }
}

// Export to PDF - open print function in browser
function reportExport() {
    try {
        reportDiv.style.visibility = "visible";
        window.print();
        reportDiv.style.visibility = "hidden";
    } catch (e) {
        console.log("There was an error exporting the report: \n\n" + e);
    }
}



// Shorten the date
function shortDate(date) {
    let parts = date.split('-');
    return `${parts[2]}.${parts[1]}.`;
}

// Hour to decimal
function timeToDecimal(time) {
    let [hours, minutes] = time.split(':').map(Number);
    let decimalMinutes = minutes / 60;

    return hours + decimalMinutes;
}
