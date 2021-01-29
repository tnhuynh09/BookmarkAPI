\c bookmark
-- \c bookmark-test

-- psql bookmark < data.sql

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



-- CREATE TABLE jobs(
--     id SERIAL PRIMARY KEY,
--     title TEXT NOT NULL,
--     salary FLOAT NOT NULL,
--     equity FLOAT CHECK(equity <= 1.0),
--     company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
	-- date_posted TIMESTAMP DEFAULT current_timestamp
-- );

-- CREATE TYPE progress AS ENUM ('interested', 'applied', 'accepted', 'rejected');
-- CREATE TABLE applications(
--     username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
--     job_id INTEGER NOT NULL REFERENCES jobs ON DELETE CASCADE,
--     state TEXT,
-- 	state progress,
--     created_at TIMESTAMP DEFAULT current_timestamp,
--     PRIMARY KEY(username, job_id)
-- );


-- INSERT INTO companies
-- 	(handle, name, num_employees, description)
-- VALUES
-- 	('apple', 'Apple Inc.', 111, 'Established in 2000.'),
-- 	('bananas', 'Bananas LLC', 222, 'Established in 2001.'),
-- 	('cornsyrup', 'Corn Syrup Inc.', 333, 'Established in 2002.'),
-- 	('dates', 'Dates Co.', 444, 'Established in 2003.');

-- INSERT INTO jobs
-- 	(title, salary, equity, company_handle)
-- VALUES
-- 	('project manager', 25000, 0.1, 'apple'),
-- 	('project assistant', 15000, 0.1, 'apple'),
-- 	('developer', 56000, 0.2, 'bananas'),
-- 	('designer', 35000, 0.3, 'cornsyrup'),
-- 	('data entry specialist', 21560, 0.4, 'dates');

-- INSERT INTO users
-- 	(username, password, first_name, last_name, email, is_admin)
-- VALUES
-- 	('testUser', 'testPassword', 'firstNameTest', 'lastNameTest', 'test@gmail.com', 'true'),
-- 	('Hakuna', 'hakPassword', 'hakFirst', 'hakLast', 'hak@gmail.com', 'false'),
-- 	('Ariel', 'arielPassword', 'arielFirst', 'arielLast', 'ariel@gmail.com', 'true'),
-- 	('Mulan', 'mulanPassword', 'mulanFirst', 'mulanLast', 'mulan@gmail.com', 'false'),
-- 	('Belle', 'bellePassword', 'belleFirst', 'belleLast', 'belle@gmail.com', 'false');

-- INSERT INTO applications
-- 	(username, job_id, state)
-- VALUES
-- 	('Ariel', 1, 'interested'),
-- 	('Ariel', 2, 'applied'),
-- 	('Mulan', 1, 'accepted'),
-- 	('Mulan', 3, 'rejected'),
-- 	('Mulan', 2, 'applied');
