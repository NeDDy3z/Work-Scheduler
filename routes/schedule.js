const express = require('express');
const router = express.Router();
const calendar = require('../logic/calendar');

const debugEvents = [
    {
        'summary': 'Erik',
        'start': {
            'date': '2024-06-01',
        },
        'end': {
            'date': '2024-06-01',
        }
    },
    {
        'summary': 'Erik',
        'start': {
            'date': '2024-06-08',
        },
        'end': {
            'date': '2024-06-08',
        }
    },
    {
        'summary': 'Erik',
        'start': {
            'date': '2024-06-15',
        },
        'end': {
            'date': '2024-06-15',
        }
    }
];



// Check if user is authenticated
function isAuthenticated(request, response, next) {
    if (request.session.loggedIn || DEBUG) {
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
        let events;
        if (!process.env.DEBUG) events = await calendar.getEvents();
        else events = debugEvents;


        response.status(200).render('pages/schedule', { events: events });
    } catch (e) {
        // Error => 500
        response.status(500).send("Internal server error", e);
    }
});


// POST - send data
router.post('/', isAuthenticated, async (request, response) => {
    //calendar.insertEvent();
});



module.exports = router;
