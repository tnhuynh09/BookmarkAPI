/** Routes for books. */

const express = require('express');
const axios = require('axios')
const { API_KEY } = require("../config");
const Book = require('../models/book');
const { authenticationRequired } = require('../middleware/auth');

const GOOGLE_BOOK_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const router = express.Router();

// Retrieve book information from external API (Google Books API) from search query
// GET REQUEST EXAMPLE: 
// https://www.googleapis.com/books/v1/volumes?q=twilight

router.get('/', async function (req, res, next) {
    const searchParam = req.query.searchParam;

    try {
        let books = await axios.get(`${GOOGLE_BOOK_API_BASE_URL}/${searchParam}&key=${API_KEY}`);
        let result = [];

        if (books.data.items) {
            for (let i = 0; i < books.data.items.length; i++) {
                const currentItem = books.data.items[i];
                let bookImage = "";
                let title = "";
                let isbn = "";
                try {
                    bookImage = currentItem.volumeInfo.imageLinks.thumbnail;
                    title = currentItem.volumeInfo.title;
                    isbn = currentItem.volumeInfo.industryIdentifiers[0].identifier;
                } catch (error) {
                    return next(err);
                }

                let authors = "";

                if (currentItem.volumeInfo.authors && currentItem.volumeInfo.authors.length > 0) {
                    for (let i = 0; i < currentItem.volumeInfo.authors.length; i++) {
                        if (i == 0) {
                            authors += currentItem.volumeInfo.authors[i];
                        } else {
                            authors += ", " + currentItem.volumeInfo.authors[i];
                        }
                    }
                }

                result.push({
                    googleBookId: currentItem.id,
                    bookImage: bookImage,
                    title: title,
                    authors: authors,
                    description: currentItem.volumeInfo.description,
                    averageRating: currentItem.volumeInfo.averageRating,
                    publishedDate: currentItem.volumeInfo.publishedDate,
                    publisher: currentItem.volumeInfo.publisher,
                    pageCount: currentItem.volumeInfo.pageCount,
                    isbn: isbn
                });
            }
        }

        return res.json({ books: result });
    } catch (err) {
        return next(err);
    }
});

// Add a single book to the bookshelf
router.post('/add', authenticationRequired, async function (req, res, next) {
    try {
        let book = await Book.findOne(req.body);

        if (!book) {
            book = await Book.addOne(req.body);
        }

        await Book.addOneToBookshelf(req.user.username, book);

        return res.json({ success: true });
    } catch (err) {
        return next(err);
    }
});

// Get request for all the books on the bookshelf
// Books the user added to their account
router.get('/bookshelf', authenticationRequired, async function (req, res, next) {
    try {
        let users_books = await Book.getBookshelf(req.user.username);
        return res.json({ users_books });
    } catch (err) {
        return next(err);
    }
});

// Post request to delete a book from bookshelf
router.post('/delete', authenticationRequired, async function (req, res, next) {
    try {
        let isDeleteBookSuccess = await Book.deleteBook(req.body.usersBooksId);
        return res.json({ success: isDeleteBookSuccess });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;