/** Routes for books. */

const express = require('express');
// const ExpressError = require('../helpers/ExpressError');
// const jsonschema = require('jsonschema');
const axios = require('axios')
const { API_KEY } = require("../config");
const GOOGLE_BOOK_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const Journal = require('../models/Journal');
// const newUserSchema = require("../schemas/newUserSchema.json")
// const updateUserSchema = require("../schemas/updateUserSchema.json")
// const createToken = require('../helpers/createToken');
const { authenticationRequired, correctUserRequired } = require('../middleware/auth');
const db = require("../db");

const router = express.Router();

// Retrieve book information from external API (Google Books API) from search query
// GET REQUEST EXAMPLE: 
// https://www.googleapis.com/books/v1/volumes?q=twilight

router.get('/', authenticationRequired, async function (req, res, next) {
    const isPublic = req.query.isPublic;
    console.log("TIGER --- newsfeed ", isPublic);
    try {
        // let journal = await Journal.findOrCreateOne(bookId);

        let result = [];
        if (isPublic) {
            const res = await db.query(
                `SELECT j.id, j.date_started, j.date_finished, j.reading_status, j.my_rating, j.book_review, j.favorite_quote, j.final_thought, ub.username, b.book_image, b.title, b.authors, b.description, b. average_rating, b.published_date, b.publisher, b.page_count, b.isbn
                FROM journals as j
                INNER JOIN books_journals AS bj ON j.id = bj.journal_id
                INNER JOIN users_books AS ub ON bj.users_books_id = ub.id 
                INNER JOIN books AS b ON ub.book_id = b.id 
                WHERE j.is_public = true`
            );

            result = res.rows;
            // Get all the journals that has the "isPublic" == true and dispaly it
        } else {
            // Get all the journals for that user, regardless if isPublic is false or true
            const res = await db.query(
                `SELECT j.id, j.date_started, j.date_finished, j.reading_status, j.my_rating, j.book_review, j.favorite_quote, j.final_thought, ub.username, b.book_image, b.title, b.authors, b.description, b. average_rating, b.published_date, b.publisher, b.page_count, b.isbn
                FROM journals as j
                INNER JOIN books_journals AS bj ON j.id = bj.journal_id
                INNER JOIN users_books AS ub ON bj.users_books_id = ub.id 
                INNER JOIN books AS b ON ub.book_id = b.id 
                WHERE ub.username = $1`,
                [username]
            );
            result = res.rows;
        }

        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;