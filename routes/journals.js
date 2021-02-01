/** Routes for journals. */

const express = require('express');
const Journal = require('../models/journal');

const router = express.Router();

router.get('/', async function (req, res, next) {
    const bookId = req.query.bookId;

    try {
        let journal = await Journal.findOrCreateOne(bookId);
        return res.json({ journal });
    } catch (err) {
        return next(err);
    }
});

router.post('/edit', async function (req, res, next) {
    try {
        if (req.body.date_started === '') {
            req.body.date_started = null;
        }
        if (req.body.date_finished === '') {
            req.body.date_finished = null;
        }

        let journal = await Journal.editOne(req.body);

        return res.json({ journal });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;