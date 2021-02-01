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
    DB_URI = process.env.DATABASE_URL + "?ssl=true" || "bookmark";
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

// 2021-02-01T11:18:22.052424+00:00 app[web.1]: (node:21) UnhandledPromiseRejectionWarning: error: no pg_hba.conf entry for host "3.93.197.197", user "ipcqbmkjnlkdho", database "d5jsuf6mbenj9p", SSL off
// 2021-02-01T11:18:22.052426+00:00 app[web.1]:     at Parser.parseErrorMessage (/app/node_modules/pg-protocol/dist/parser.js:278:15)
// 2021-02-01T11:18:22.052427+00:00 app[web.1]:     at Parser.handlePacket (/app/node_modules/pg-protocol/dist/parser.js:126:29)
// 2021-02-01T11:18:22.052428+00:00 app[web.1]:     at Parser.parse (/app/node_modules/pg-protocol/dist/parser.js:39:38)
// 2021-02-01T11:18:22.052428+00:00 app[web.1]:     at Socket.<anonymous> (/app/node_modules/pg-protocol/dist/index.js:10:42)
// 2021-02-01T11:18:22.052429+00:00 app[web.1]:     at Socket.emit (events.js:314:20)
// 2021-02-01T11:18:22.052430+00:00 app[web.1]:     at addChunk (_stream_readable.js:297:12)
// 2021-02-01T11:18:22.052431+00:00 app[web.1]:     at readableAddChunk (_stream_readable.js:272:9)
// 2021-02-01T11:18:22.052431+00:00 app[web.1]:     at Socket.Readable.push (_stream_readable.js:213:10)
// 2021-02-01T11:18:22.052432+00:00 app[web.1]:     at TCP.onStreamRead (internal/stream_base_commons.js:188:23)
// 2021-02-01T11:18:22.052575+00:00 app[web.1]: (node:21) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
// 2021-02-01T11:18:22.052649+00:00 app[web.1]: (node:21) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.