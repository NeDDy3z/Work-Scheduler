const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'logic/api/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'logic/api/credentials.json');

// Calendar ID
const calendarId = process.env.CALENDAR_ID;


// Load Credentials from token.json
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

// Save credentials to token.json
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

// Load or request authorization to call APIs.
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

// Get events
async function getEventsAPI(auth, year, month) {
    if (!year || !month) {
        year = new Date().getFullYear();
        month = new Date().getMonth() + 1;
    }

    const calendar = google.calendar({version: 'v3', auth});
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
async function addEventAPI(auth, event) {
    const calendar = google.calendar({version: 'v3', auth});
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
async function deleteEventAPI(auth, id) {
    const calendar = google.calendar({version: 'v3', auth});
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
async function updateEventAPI(auth, id, event) {
    const calendar = google.calendar({version: 'v3', auth});
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

function getEvents(year, month) {
    return authorize().then(auth => getEventsAPI(auth, year, month)).catch(console.error);
}

function addEvent(event) {
    return authorize().then(auth => addEventAPI(auth, event)).catch(console.error);
}

function deleteEvent(id) {
    return authorize().then(auth => deleteEventAPI(auth, id)).catch(console.error);
}

function updateEvent(id, event) {
    return authorize().then(auth => updateEventAPI(auth, id, event)).catch(console.error);
}

module.exports = {getEvents, addEvent, deleteEvent, updateEvent};
