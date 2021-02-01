\c bookmark
-- \c bookmark-test

-- psql bookmark < data.sql

DROP TYPE IF EXISTS journals_votes;
DROP TABLE IF EXISTS books_journals;
DROP TABLE IF EXISTS users_books;
DROP TABLE IF EXISTS journals;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS progress;

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    image_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    google_book_id TEXT UNIQUE NOT NULL,
    book_image TEXT,
    title TEXT,
    authors TEXT,
    description TEXT,
    average_rating FLOAT,
    published_date TEXT,
    publisher TEXT,
    page_count INTEGER,
    isbn TEXT
);

CREATE TABLE users_books(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books ON DELETE CASCADE
);

CREATE TYPE progress AS ENUM ('reading', 'finished', 'will read', 'abandoned');
CREATE TABLE journals(
    id SERIAL PRIMARY KEY,
    is_public BOOLEAN DEFAULT TRUE,
    date_started DATE,
    date_finished DATE,
    reading_status progress,
    my_rating FLOAT,
    book_review TEXT, 
    favorite_quote TEXT,
    final_thought TEXT
);


CREATE TABLE books_journals(
    id SERIAL PRIMARY KEY,
    users_books_id INTEGER NOT NULL REFERENCES users_books ON DELETE CASCADE,
    journal_id INTEGER NOT NULL REFERENCES journals ON DELETE CASCADE
);

CREATE TABLE journals_votes(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    journal_id INTEGER NOT NULL REFERENCES journals ON DELETE CASCADE
);