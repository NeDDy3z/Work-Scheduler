const { google } = require('googleapis');
const config = require('../config');
const authentication= require('../routes/authentication');

// Calendar ID
const calendarId = config.calendar_id;



// Get events
async function getEvents(year, month) {
    if (!year || !month) {
        year = new Date().getFullYear();
        month = new Date().getMonth() + 1;
    }

    const calendar = google.calendar({version: 'v3', auth: authentication.oauth2Client });
    const res = await calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date(year, month - 1, 1).toISOString(),
        timeMax: new Date(year, month, 1).toISOString(),
        maxResults: 31,
        singleEvents: true,
        orderBy: 'startTime',
        sendUpdates: 'none'
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
    } else {
        console.log("Events requested: %s", events.length);
        return events;
    }
}

// Add event
async function addEvent(event) {
    const calendar = google.calendar({version: 'v3', auth: authentication.oauth2Client });
    try {
        const res = await calendar.events.insert({
            calendarId: calendarId,
            sendUpdates: 'none',
            resource: event
        });
        console.log("Event created");
        return res.data;
    } catch (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
    }
}

// Delete event
async function deleteEvent(id) {
    const calendar = google.calendar({version: 'v3', auth: authentication.oauth2Client });
    try {
        await calendar.events.delete({
            calendarId: calendarId,
            sendUpdates: 'none',
            eventId: id
        });
        console.log("Event deleted");
    } catch (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
    }
}

// Update event
async function updateEvent(id, event) {
    const calendar = google.calendar({version: 'v3', auth: authentication.oauth2Client});
    try {
        const res = await calendar.events.update({
            calendarId: calendarId,
            eventId: id,
            sendUpdates: 'none',
            resource: event
        });
        console.log("Event updated");
        return res.data;
    } catch (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
    }
}


module.exports = {getEvents, addEvent, deleteEvent, updateEvent};







// Example route to get calendar events
/*
app.get('/events', ensureAuthenticated, async (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: authentication.oauth2Client });
    const events = await calendar.events.list({ calendarId: 'primary' });
    res.json(events.data.items);
});

// Example route to add a calendar event
app.post('/events', ensureAuthenticated, express.json(), async (req, res) => {
    const { summary, description, start, end } = req.body;
    const calendar = google.calendar({ version: 'v3', auth: authentication.oauth2Client });
    const event = {
        summary,
        description,
        start: { dateTime: start },
        end: { dateTime: end },
    };
    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });
    res.json(response.data);
});
*/