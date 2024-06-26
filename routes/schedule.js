const express = require('express');
const router = express.Router();
const calendar = require('../logic/calendar');

const debugEvents = [
    {
        'summary': 'Erik',
        'description': '10:00;18:00',
        'start': {
            'date': '2024-06-01',
        },
        'end': {
            'date': '2024-06-01',
        }
    },
    {
        'summary': 'Erik',
        'description': '10:00;18:00',
        'start': {
            'date': '2024-06-08',
        },
        'end': {
            'date': '2024-06-08',
        }
    },
    {
        'summary': 'Erik',
        'description': '9:45;18:00',
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
        let data;
        if (process.env.DEBUG != "true") data = await calendar.getEvents();
        else data = debugEvents;

        response.status(200).render('pages/schedule', { data: data });
    } catch (e) {
        // Error => 500
        response.status(500).send("Internal server error", e);
    }
});


// REQUESTS
router.post('/event', isAuthenticated, async (request, response) => {
    try {
        const { date, from, to  } = request.body;
        console.log(date, from ,to);
        calendar.insertEvent(
            {
                'summary': 'Erik',
                'description': from + ';' + to,
                'start': {
                    'date': date
                },
                'end': {
                    'date': date
                }
            }
        );

        response.redirect('/schedule');
    } catch (e) {
        response.status(500).send("Internal server error");
    }

});

router.delete('/event', isAuthenticated, async (request, response) => {
    //calendar.deleteEvent();

    response.status(200).redirect('/schedule');

});

router.put('/event', isAuthenticated, async (request, response) => {
    //calendar.updateEvent();

    response.status(200).redirect('/schedule');
});



router.get('/export', isAuthenticated, async (request, response) => {
    //report.getReport();
});





module.exports = router;
