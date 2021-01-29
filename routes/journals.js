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

const router = express.Router();

// Retrieve book information from external API (Google Books API) from search query
// GET REQUEST EXAMPLE: 
// https://www.googleapis.com/books/v1/volumes?q=twilight

router.get('/', async function (req, res, next) {
    const bookId = req.query.bookId;
    console.log("TIGER --- journal get or create", bookId);
    try {
        let journal = await Journal.findOrCreateOne(bookId);

        return res.json({ journal });
    } catch (err) {
        return next(err);
    }
});


router.post('/edit', async function (req, res, next) {
    // const searchParam = req.body.searchParam;
    console.log("TIGER --- journal edit req.body", req.body);
    try {
        let journal = await Journal.editOne(req.body);
        console.log("TIGER --- journal journal", journal);

        return res.json({ journal });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;