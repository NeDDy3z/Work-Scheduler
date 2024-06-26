// https://developers.google.com/calendar/quickstart/node
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const {get} = require("axios");



// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'logic/api/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'logic/api/credentials.json');



/**
 * Reads previously authorized credentials from the save file.
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
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

/**
 * Load or request or authorization to call APIs.
 */
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



/**
 * Lists the next 30 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function fetchEvents() {
    const auth = await authorize();

    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.list({
        calendarId: 'primary',//'954603196a55e983b4a378024770523dc8e28c74b87bd204c4ce9f58300dfd35@group.calendar.google.com',
        timeMin: new Date().toISOString(), // ! Od dnešního dne
        maxResults: 30,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    console.log("Events requested: %s", events.length);

    return events;
}

/**
 * Inserts an event into the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Object} event The event to insert.
 */
async function postEvent(event) {
    const auth = await authorize();

    console.log(event);

    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.insert ({
        calendarId: 'primary',
        resource: event
    });

    console.log("Event created: %s", res.data.htmlLink);
}

/*
const event = {
    'summary': 'Erik',
    'description': '10:00;18:00', // 10:00 - 18:00
    'start': {
        'date': '2024-06-01',
    },
    'end': {
        'date': '2024-06-01',
    },
};
*/

//authorize().then(auth => insertEvent(auth, event)).catch(console.error);
//authorize().then(auth => getEvents(auth)).catch(console.error);



function getEvents() {
    return authorize().then(auth => fetchEvents(auth)).catch(console.error);
}

function insertEvent(event) {
    return authorize().then(auth => postEvent(auth, event)).catch(console.error);
}




module.exports = { getEvents, insertEvent }
