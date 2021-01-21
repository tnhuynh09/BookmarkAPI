/** Start server for bookmark. */

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, function () {
    console.log(`Server starting on port ${PORT}!`);
});
