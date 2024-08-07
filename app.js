const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('./config');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 3000;



// Set routes => in /routes folder
const indexRouter = require("./routes/index");
const authenticationRouter = require('./routes/authentication');
const scheduleRouter = require('./routes/schedule')


// Set viewing engine (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware to parse JSON, URL-encoded data, CSS + JS + IMAGES
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: false } // Use true if HTTPS
}));


// Set routes
app.use('/', indexRouter);
app.use('/authentication', authenticationRouter.router);
app.use('/schedule', scheduleRouter);



// Server listen
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

