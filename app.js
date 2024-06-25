process.env.DEBUG = true;



// Set dependencies & declare constants
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

// Set routes => in /routes folder
const indexRouter = require("./routes/index");
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
    secret: 'SkakalPesPresOves',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: false } // Use true if HTTPS
}));



// Set routes
app.use('/', indexRouter);
app.use('/schedule', scheduleRouter);



// Server listen
app.listen(port = process.env.PORT || 3000, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
