const express = require('express');
const router = express.Router();

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const config = require(process.env.CONFIG_PATH || '../config');

// OAuth2 client setup
const scope= 'https://www.googleapis.com/auth/calendar';
const oauth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uri
);



// Check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.loggedIn || process.env.BYPASS_LOGIN == true) {
        return next();
    } else {
        // Not logged in => redirect back to index page
        res.status(403).redirect('/');
    }
}


// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session.tokens) {
        if (req.session.tokens) oauth2Client.setCredentials(req.session.tokens);

        next();
    } else {
        res.redirect('/authenticate');
    }
}



// GET - page (also check if user is loggedIn to be able to access this page)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const state = crypto.randomBytes(32).toString('hex');
        req.session.state = state;

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scope,
            include_granted_scopes: true,
            state: state
        });

        res.redirect(authUrl);
    } catch (e) {
        res.status(500).send("Internal server error: "+ e);
        res.redirect('/');
    }
});

// OAuth2 callback
router.get('/oauth2callback', isAuthenticated, async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);
        req.session.tokens = tokens;

        res.status(200).redirect('/schedule');
    } catch (e) {
        res.status(500).send("Internal server error: "+ e);
    }
});



module.exports = { router, oauth2Client, ensureAuthenticated };




