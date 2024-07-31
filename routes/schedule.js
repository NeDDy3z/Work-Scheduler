const express = require('express');
const router = express.Router();
const calendar = require('../logic/calendar');



function createEvent(date, from, to) {
    return {
        'summary': 'Erik',
        'description': from + ';' + to,
        'start': {
            'date': date
        },
        'end': {
            'date': date
        }
    }
}



// Check if user is authenticated
function isAuthenticated(request, response, next) {
    if (request.session.loggedIn || process.env.DEBUG) {
        // If so return "continue" command
        return next();
    } else {
        // Not logged in => redirect back to index page
        response.status(403).redirect('/');
    }
}



// GET - page (also check if user is loggedIn to be able to access this page)
router.get('/', isAuthenticated, async (request, response) => {
    try {
        const { year, month } = request.query;
        let data = await calendar.getEvents(year, month);
        if (!data) data = [];

        response.status(200).render('pages/schedule', { data: data });
    } catch (e) {
        // Error => 500
        response.status(500).send("Internal server error");
    }
});



// REQUESTS
// Add Event
router.post('/event/add', isAuthenticated, async (request, response) => {
    try {
        const { date, from, to } = request.body;
        await calendar.addEvent(createEvent(date, from, to));

        setTimeout(function() {
            response.status(200).redirect('/schedule');
        }, 750);

    } catch (e) {
        response.status(500).send("Internal server error");
    }
});

// Delete Event
router.post('/event/delete', isAuthenticated, async (request, response) => {
    try {
        const { id } = request.body;
        await calendar.deleteEvent(id);

        setTimeout(function() {
            response.status(200).redirect('/schedule');
        }, 500);
    } catch (e) {
        response.status(500).send("Internal server error");
    }
});

// Update Event
router.post('/event/update', isAuthenticated, async (request, response) => {
    try {
        const { date, from, to, id  } = request.body;

        await calendar.deleteEvent(id);
        await calendar.addEvent(createEvent(date, from, to));

        setTimeout(function() {
            response.status(200).redirect('/schedule');
        }, 600);
    } catch (e) {
        response.status(500).send("Internal server error");
    }
});



// Export
router.get('/export', isAuthenticated, async (request, response) => {
    //report.getReport();
    //response.redirect('/schedule');
});





module.exports = router;
