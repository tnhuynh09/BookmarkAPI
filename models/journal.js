const db = require("../db");
const bcrypt = require("bcrypt");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../helpers/ExpressError");
const { BCRYPT_WORK_FACTOR } = require("../config");


class Journal {
    static async findOrCreateOne(bookId) {
        // Try to find a journal based on bookId
        const result = await db.query(
            `SELECT bj.id, bj.users_books_id, bj.journal_id, j.is_public, j.date_started, j.date_finished, j.reading_status, j.my_rating, j.book_review, j.favorite_quote, j.final_thought
            FROM books_journals AS bj
            JOIN journals AS j ON bj.journal_id = j.id
            WHERE bj.users_books_id = $1`,
            [bookId]
        );

        console.log("JOURNAL - RESULT", result.rows);

        // const result = await db.query(
        //     `SELECT id, users_books_id, journal_id
        //     FROM books_journals 
        //     WHERE users_books_id = $1`,
        //     [bookId]
        // );

        // If there is nothing, create a new journal with empty data based on the bookId
        let journalRes = null;
        if (result.rows.length > 0) {
            journalRes = result.rows[0];
        }
        console.log("JOURNAL - RESULT - journalRes", journalRes);

        if (journalRes == null) {
            console.log("JOURNAL - RESULT - journalRes ==== null");
            const res = await db.query(
                `INSERT INTO journals 
                            (is_public, date_started, date_finished, reading_status, my_rating, book_review, favorite_quote, final_thought) 
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                          RETURNING *`,
                [true, null, null, null, null, null, null, null]
            );
            console.log("JOURNAL - RESULT - res INSERT", res);

            journalRes = res.rows[0];

            // Attach journal to User Journal table
            await db.query(
                `INSERT INTO books_journals
                (users_books_id, journal_id) 
                    VALUES($1, $2)`,
                [bookId, journalRes.id]
            );
        }

        // return the journal
        return journalRes;
    }

    static async editOne(data) {
        // Edit the journal based on the bookId
        console.log("TIGER --- journal editOne - start - data", data);

        const result = await db.query(
            `UPDATE journals 
                SET is_public = $1,
                    date_started = $2,
                    date_finished = $3,
                    reading_status = $4,
                    my_rating = $5,
                    book_review = $6,
                    favorite_quote = $7,
                    final_thought = $8
                WHERE id = $9
                RETURNING *`,
            [
                data.is_public,
                data.date_started,
                data.date_finished,
                data.reading_status,
                data.my_rating,
                data.book_review,
                data.favorite_quote,
                data.final_thought,
                data.id,
            ]
        );
        // AS ENUM ('reading', 'finished', 'will read', 'abandoned');

        console.log("TIGER --- journal editOne - result", result);
        let updatedJournalRes = result.rows[0];

        return updatedJournalRes;
    }
}

module.exports = Journal;