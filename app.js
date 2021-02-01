const express = require("express");
const ExpressError = require("./helpers/expressError");
const app = express();
const cors = require("cors");
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const journalsRoutes = require('./routes/journals');
const newsfeedRoutes = require('./routes/newsfeed');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(cors());
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);
app.use('/journals', journalsRoutes);
app.use('/newsfeed', newsfeedRoutes);
app.use('/', authRoutes);


/** 404 handler */

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);

    // pass the error to the next piece of middleware
    console.log("General Error - err", err);
    return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);

    return res.json({
        status: err.status,
        message: err.message
    });
});


module.exports = app;