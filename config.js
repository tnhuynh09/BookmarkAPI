/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET = process.env.SECRET_KEY || "test";

const API_KEY = process.env.BOOKMARK_GOOGLE_API_KEY;

const PORT = +process.env.PORT || 3001;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'bookmark-test'
// - else: 'bookmark'

let DB_URI;

console.log("process.env.NODE_ENV =", process.env.NODE_ENV);

if (process.env.NODE_ENV === "test") {
    DB_URI = "bookmark-test";
} else {
    DB_URI = process.env.DATABASE_URL || "bookmark";
}

console.log("Using database - DB_URI =", DB_URI);

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
    SECRET,
    API_KEY,
    PORT,
    DB_URI,
    BCRYPT_WORK_FACTOR
};
