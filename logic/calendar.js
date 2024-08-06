const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth');



// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'logic/api/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'logic/api/credentials.json');

// Calendar ID
const calendarId = '954603196a55e983b4a378024770523dc8e28c74b87bd204c4ce9f58300dfd35@group.calendar.google.com';



// Load or request or authorization to call APIs.
async function authorize() {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const oAuth2Client = new OAuth2Client(
        credentials.web.client_id,
        credentials.web.client_secret,
        // Redirect URI (replace with your backend server's URL)
        'https://work-scheduler.up.railway.app/schedule' // Update with your redirect URI
    );

    // Check if refresh token exists
    if (credentials.refresh_token) {
        oAuth2Client.setCredentials({ refresh_token: credentials.refresh_token });
    }

    try {
        const tokens = await oAuth2Client.getAccessToken();
        oAuth2Client.setCredentials(tokens);
        return oAuth2Client;
    } catch (err) {
        console.error('Error retrieving access token:', err);
        return null;
    }
}



// Get events
async function getEventsAPI(auth, year, month) {
    if (!year || !month) {
        year = new Date().getFullYear();
        month = new Date().getMonth() + 1;
    }

    //const auth = await authorize();

    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date(year, month - 1, 0).toISOString(),
        timeMax: new Date(year, month, 1).toISOString(),
        maxResults: 31,
        singleEvents: true,
        orderBy: 'startTime'
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    else {
        console.log("Events requested: %s", events.length);

        return events;
    }
}

// Add event
async function addEventAPI(event) {
    const auth = await authorize();

    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: event
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }

        console.log("Event created");
    });
}

// Delete event
async function deleteEventAPI(id) {
    const auth = await authorize();

    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.delete({
        auth: auth,
        calendarId: calendarId,
        eventId: id
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log("Event updated");
    });
}

// Update event
async function updateEventAPI(id, event) {
    const auth = await authorize();

    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.update({
        auth: auth,
        calendarId: calendarId,
        eventId: id,
        resource: event
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log("Event updated");
    });
}



function getEvents(year, month) {
    return authorize().then(auth => getEventsAPI(auth, year, month)).catch(console.error);
}

function addEvent(event) {
    authorize().then(addEventAPI(event)).catch(console.error);
}

function deleteEvent(id) {
    authorize().then(deleteEventAPI(id)).catch(console.error);
}

function updateEvent(id, event) {
    authorize().then(updateEventAPI(id, event)).catch(console.error);
}



module.exports = { getEvents, addEvent, deleteEvent, updateEvent }
