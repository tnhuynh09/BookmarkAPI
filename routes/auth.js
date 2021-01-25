/** Routes for authentication/authorization. */

const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const createToken = require('../helpers/createToken');

// Authenticate a user and return a JSON Web Token 
// which contains a payload with the username and is_admin values.
router.post("/login", async function (req, res, next) {
    console.log("AUTH - login", req.body);
    try {
        const user = await User.authenticate(req.body);
        console.log("AUTH - login user", user);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        console.log("AUTH - login - err", err);
        return next(err);
    }
});

module.exports = router;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNjExMjI3MTYyfQ.vfyVODyDYfA4RETqEgFRFQeNwvJ1fs2NFGJpXS3ZHRg