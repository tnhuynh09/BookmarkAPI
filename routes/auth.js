/** Routes for authentication/authorization. */

const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const createToken = require('../helpers/createToken');

// Authenticate a user and return a JSON Web Token 
// which contains a payload with the username and is_admin values.
router.post("/login", async function (req, res, next) {
    console.log("AUTH - login", req.body);
    try {
        const user = await User.authenticate(req.body);
        const token = createToken(user);

        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;