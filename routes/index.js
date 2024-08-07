const express = require('express');
const router = express.Router();
const encrypt = require('../logic/encryption');
const config = require(process.env.CONFIG_PATH || '../config');



// GET - page
router.get('/', (req, res) => {
    try {
        // If user is already logged in => redirect to schedule
        if (req.session.loggedIn || process.env.BYPASS_LOGIN == true) {
            res.status(200).redirect('/schedule');
        }
        else {
            // Not logged in => stay on index page
            res.status(200).render( 'pages/index');
        }
    } catch (e) {
        // Error => 500
        res.status(500).send("Internal server error: "+ e);
    }
});

// POST - Login
router.post('/', (req, res) => {
    let password;

    try {
        // Check if there's any password in body
        password = req.body.password;
    } catch (e) {
        // No password => bad req
        res.render('/', { msg : 'No password was: entered / received by the server'});
    }

    try {
        // Check if the password is correct
        if (encrypt(password) === config.password) {
            // Set session to loggedIn = true
            req.session.loggedIn = true;
            // Redirect to (now accessible) webpage
            res.status(200).redirect('/authentication');
        }
        else {
            // If the password is not correct, redirect back to index page with error message
            res.status(200).render( 'pages/index', { msg : 'Incorrect password'});
        }
    } catch (e) {
        // Error => 500
        res.status(500).send("Internal server error: "+ e);
    }

});



module.exports = router;
