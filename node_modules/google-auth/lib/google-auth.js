#! /usr/bin/env node

/*
 * google-auth
 * http://github.com/mathisonian/google-auth
 *
 * Copyright (c) 2014 Matthew Conlen
 * Licensed under the MIT license.
 */

'use strict';

var express = require('express');
var googleapis = require('googleapis');
var _ = require('lodash');
var OAuth2 = googleapis.auth.OAuth2;
var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));


var client_id = argv.id || process.env.GOOGLE_CLIENT_ID;
var client_secret = argv.secret || process.env.GOOGLE_CLIENT_SECRET;

var oauth2Client = new OAuth2(client_id, client_secret, 'http://localhost:42890/oauthcallback');

// generates a url that allows offline access and asks permissions
// for Google+ scope.


var scopes = _.map(argv._, function(scope) {
    return 'https://www.googleapis.com/auth/' + scope
});

var app = express();
var port = 42890;
var server = app.listen(port);


var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes.join(" ") // space delimited string of scopes
});

exec('open \'' + url + '\'');

app.get('/oauthcallback', function(req, res) {

    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
        // contains an access_token and optionally a refresh_token.
        // save them permanently.
        if(err) {
            res.json(err);
            
        } else {
            res.json(tokens)
        }
    });
});




