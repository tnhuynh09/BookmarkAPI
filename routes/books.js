/** Routes for books. */

const express = require('express');
// const ExpressError = require('../helpers/ExpressError');
// const jsonschema = require('jsonschema');
const axios = require('axios')
const { API_KEY } = require("../config");
const GOOGLE_BOOK_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const Book = require('../models/Book');
// const newUserSchema = require("../schemas/newUserSchema.json")
// const updateUserSchema = require("../schemas/updateUserSchema.json")
// const createToken = require('../helpers/createToken');
const { authenticationRequired, correctUserRequired } = require('../middleware/auth');

const router = express.Router();

// Retrieve book information from external API (Google Books API) from search query
// GET REQUEST EXAMPLE: 
// https://www.googleapis.com/books/v1/volumes?q=twilight

router.get('/', async function (req, res, next) {
    const searchParam = req.query.searchParam;
    console.log("TIGER --- searchParam", searchParam);
    try {
        // const books = await Book.findAll(searchParam);
        console.log("BOOK MODEL - findAll() - query", searchParam);
        let books = await axios.get(`${GOOGLE_BOOK_API_BASE_URL}/${searchParam}&key=${API_KEY}`);
        console.log("BOOK MODEL - findAll() - books", books.data.items);

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
        console.log("TIGER --- username", req.user.username);
        console.log("TIGER --- googleBookId", req.body.googleBookId);
        console.log("TIGER --- bookImage", req.body.bookImage);
        console.log("TIGER --- title", req.body.title);
        console.log("TIGER --- authors", req.body.authors);
        // 1 - Try to find the book in the book table based on googleBookId
        // 2 - If no book exists, add the book to the table and grab the book id (note: not googleBookId)
        // 3 - If book exists, just grab the book id (not google book id)
        // 4 - Add the book and username to the users_books table
        // 5 - Make randy a cake

        let book = await Book.findOne(req.body);
        if (!book) {
            book = await Book.addOne(req.body);
        }

        await Book.addOneToBookshelf(req.user.username, book);

        console.log("BOOK - POST ROUTE - book", book);

        return res.json({ success: true });
        // return ({ book });

    } catch (err) {
        return next(err);
    }
});

// Get request for all the books on the bookshelf
// Books the user added to their account
router.get('/bookshelf', authenticationRequired, async function (req, res, next) {
    console.log("BOOK ROUTE - get bookshelf");

    try {
        console.log("BOOK - ROUTES");
        let users_books = await Book.getBookshelf(req.user.username);
        console.log("BOOK ROUTES - users_books", users_books);

        return res.json({ users_books });

    } catch (err) {
        return next(err);
    }
});

// Post request to delete a book from bookshelf
router.post('/delete', authenticationRequired, async function (req, res, next) {
    console.log("BOOK ROUTE - delete a book from bookshelf");
    console.log("DELETE - BOOK ROUTE - res - usersBooksId", req.body.usersBooksId);

    try {
        console.log("BOOK - ROUTES");
        let isDeleteBookSuccess = await Book.deleteBook(req.body.usersBooksId);
        console.log("BOOK ROUTES - isDeleteBookSuccess", isDeleteBookSuccess);

        return res.json({ success: isDeleteBookSuccess });

    } catch (err) {
        return next(err);
    }
});

module.exports = router;