const db = require("../db");
// const bcrypt = require("bcrypt");
// const sqlForPartialUpdate = require("../helpers/partialUpdate");
// const ExpressError = require("../helpers/ExpressError");
// const { BCRYPT_WORK_FACTOR } = require("../config");


class Book {
    static async findOne(book) {
        const result = await db.query(
            `SELECT id, google_book_id, book_image, title, authors, description, average_rating, published_date, publisher, page_count, isbn
            FROM books 
            WHERE google_book_id = $1`,
            [book.googleBookId]
        );

        const bookRes = result.rows[0];

        return bookRes;
    }

    static async addOne(book) {
        const result = await db.query(
            `INSERT INTO books 
                        (google_book_id, book_image, title, authors, description, average_rating, published_date, publisher, page_count, isbn) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                      RETURNING id, google_book_id, book_image, title, authors, description, average_rating, published_date, publisher, page_count, isbn`,
            [
                book.googleBookId,
                book.bookImage,
                book.title,
                book.authors,
                book.description,
                book.averageRating,
                book.publishedDate,
                book.publisher,
                book.pageCount,
                book.isbn
            ]);

        let bookRes = result.rows[0];

        return bookRes;
    }

    static async addOneToBookshelf(username, book) {
        const result = await db.query(
            `INSERT INTO users_books 
                        (username, book_id) 
                      VALUES ($1, $2) 
                      RETURNING id, username, book_id`,
            [
                username,
                book.id,
            ]);

        let bookRes = result.rows[0];

        return bookRes;
    }

    static async getBookshelf(username) {
        const result = await db.query(
            `SELECT ub.id, b.book_image, b.title, b.authors, b.description, b.average_rating, b.published_date, b.publisher, b.page_count, b.isbn
            FROM users_books AS ub
            JOIN books AS b ON ub.book_id = b.id
            WHERE ub.username = $1`,
            [username]
        );

        let bookShelfRes = result.rows;

        return bookShelfRes;
    }

    static async deleteBook(userBooksId) {
        const result = await db.query(
            `DELETE FROM users_books 
                WHERE id = $1`,
            [userBooksId]);

        let bookShelfRes = result.rows;

        return (bookShelfRes.length == 0);
    }
}

module.exports = Book;