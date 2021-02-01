/** Routes for newsfeed. */

const express = require('express');
const Journal = require('../models/journal');
const { authenticationRequired } = require('../middleware/auth');
const db = require("../db");

const router = express.Router();

router.get('/', authenticationRequired, async function (req, res, next) {
    const isPublic = req.query.isPublic;

    try {
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

        // Get everything from journal vote result. 
        let journalVotesResult = await db.query(
            `SELECT id, username, journal_id
            FROM journals_votes `,
            []
        );

        let journalVotesCountMap = {}; // Key = journal_id, value = number of likes
        let journalUserLikesMap = {}; // Key = journal_id, value = if the particular user likes it or not. true or false
        for (let i = 0; i < journalVotesResult.rows.length; i++) { // Loop through all the rows from journalVotesResult
            const journalId = journalVotesResult.rows[i].journal_id;

            // Getting the amount of votes.
            if (journalVotesCountMap[journalId]) {
                journalVotesCountMap[journalId]++;
            } else {
                journalVotesCountMap[journalId] = 1;
            }

            // Figuring out if the user likes this item.
            if (req.user && journalVotesResult.rows[i].username == req.user.username) {
                journalUserLikesMap[journalId] = true;
            } else {
                journalUserLikesMap[journalId] = false;
            }
        }

        for (let i = 0; i < result.length; i++) { // Loop through the journal entries.
            const journalId = result[i].id;
            if (journalVotesCountMap[journalId]) {
                result[i].likesCount = journalVotesCountMap[journalId];
            } else {
                result[i].likesCount = 0;
            }

            result[i].isLiked = journalUserLikesMap[journalId];
        }

        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

router.post('/likesToggle', authenticationRequired, async function (req, res, next) {
    const journalId = req.body.journalId;
    const username = req.user.username;

    try {
        let result = await Journal.likesToggle(username, journalId);
        return res.json({ success: true, actionType: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;