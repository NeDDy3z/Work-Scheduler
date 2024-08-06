const express = require('express');
const router = express.Router();
const calendar = require('../logic/calendar');


function createEvent(date, from, to) {
    return {
        'summary': 'Erik',
        'description': from.toString() + ';' + to.toString(),
        'start': {
            'date': date.toString()
        },
        'end': {
            'date': date.toString()
        }
    }
}


// Check if user is authenticated
function isAuthenticated(request, response, next) {
    if (request.session.loggedIn || process.env.DEBUG) {
        return next();
    } else {
        // Not logged in => redirect back to index page
        response.status(403).redirect('/');
    }
}


// GET - page (also check if user is loggedIn to be able to access this page)
router.get('/', isAuthenticated, async (request, response) => {
    try {
        let {year, month} = request.query;
        if (!year || !month) {
            year = new Date().getFullYear();
            month = new Date().getMonth() + 1;
        }
        let data = await calendar.getEvents(year, month);

        if (!data) data = [];
        else {
            data = data.filter(event => event.summary === 'Erik');
            data = data.filter(event => event.description);
        }

        response.status(200).render('pages/schedule', {data: data});
    } catch (e) {
        response.status(500).send("Internal server error");
        console.log(e);
    }
});


// REQUESTS
// Add Event
router.post('/event/add', isAuthenticated, async (request, response) => {
    try {
        const {date, from, to} = request.body;
        await calendar.addEvent(createEvent(date, from, to));

        setTimeout(function () {
            response.status(200).redirect('/schedule');
        }, 750);

    } catch (e) {
        response.status(500).send("Internal server error");
        console.log(e);
    }
});


// Delete Event
router.post('/event/delete', isAuthenticated, async (request, response) => {
    try {
        const {id} = request.body;
        await calendar.deleteEvent(id);

        setTimeout(function () {
            response.status(200).redirect('/schedule');
        }, 250);
    } catch (e) {
        response.status(500).send("Internal server error");
        console.log(e);
    }
});

// Update Event
router.post('/event/update', isAuthenticated, async (request, response) => {
    try {
        const {date, from, to, id} = request.body;

        //await calendar.deleteEvent(id);
        //await calendar.addEvent(createEvent(date, from, to));
        await calendar.updateEvent(id, createEvent(date, from, to));

        setTimeout(function () {
            response.status(200).redirect('/schedule');
        }, 750);
    } catch (e) {
        response.status(500).send("Internal server error");
        console.log(e);
    }
});


module.exports = router;
