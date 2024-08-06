const express = require('express');
const router = express.Router();
const encrypt = require('../logic/encryption');



// GET - page
router.get('/', (request, response) => {
    try {
        // If user is already logged in => redirect to schedule
        if (request.session.loggedIn) {
            response.status(200).redirect('/schedule');
        }
        else {
            // Not logged in => stay on index page
            response.status(200).render( 'pages/index');
        }
    } catch (e) {
        // Error => 500
        response.status(500).send("Internal server error", e);
    }
});

// POST - Login
router.post('/', (request, response) => {
    let password;

    try {
        // Check if there's any password in body
        password = request.body.password;
    } catch (e) {
        // No password => bad request
        response.render('/', { msg : 'No password was: entered / recieved by the server'});
    }

    try {
        // Check if the password is correct
        if (encrypt(password) === process.env.PASSWORD) {
            // Set session to loggedIn = true
            request.session.loggedIn = true;
            // Redirect to (now accessible) webpage
            response.status(200).redirect('/schedule');
        }
        else {
            // If the password is not correct, redirect back to index page with error message
            response.status(200).render( 'pages/index', { msg : 'Incorrect password'});
        }
    } catch (e) {
        // Error => 500
        response.status(500).send("Internal server error", e);
    }

});



module.exports = router;
