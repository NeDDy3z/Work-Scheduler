const express = require('express');
const router = express.Router();
const calendar = require('../logic/calendar');
const authentication = require('../routes/authentication');


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
function isAuthenticated(req, res, next) {
    if (req.session.loggedIn || process.env.BYPASS_LOGIN) {
        return next();
    } else {
        // Not logged in => redirect back to index page
        res.status(403).redirect('/');
    }
}



// GET - page (also check if user is loggedIn to be able to access this page)
router.get('/', isAuthenticated, authentication.ensureAuthenticated, async (req, res) => {
    try {
        let {year, month} = req.query;
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

        res.status(200).render('pages/schedule', {data: data});
    } catch (e) {
        res.status(500).send("Internal server error");
        console.log(e);
    }
});

// Add Event
router.post('/event/add', isAuthenticated, authentication.ensureAuthenticated, async (req, res) => {
    try {
        const {date, from, to} = req.body;
        await calendar.addEvent(createEvent(date, from, to));

        setTimeout(function () {
            res.status(200).redirect('/schedule');
        }, 750);

    } catch (e) {
        res.status(500).send("Internal server error");
        console.log(e);
    }
});

// Delete Event
router.post('/event/delete', isAuthenticated, authentication.ensureAuthenticated, async (req, res) => {
    try {
        const {id} = req.body;
        await calendar.deleteEvent(id);

        setTimeout(function () {
            res.status(200).redirect('/schedule');
        }, 250);
    } catch (e) {
        res.status(500).send("Internal server error");
        console.log(e);
    }
});

// Update Event
router.post('/event/update', isAuthenticated, authentication.ensureAuthenticated, async (req, res) => {
    try {
        const {date, from, to, id} = req.body;

        //await calendar.deleteEvent(id);
        //await calendar.addEvent(createEvent(date, from, to));
        await calendar.updateEvent(id, createEvent(date, from, to));

        setTimeout(function () {
            res.status(200).redirect('/schedule');
        }, 750);
    } catch (e) {
        res.status(500).send("Internal server error");
        console.log(e);
    }
});



module.exports = router;
