/** Routes for users. */

const express = require('express');
const ExpressError = require('../helpers/expressError');
const jsonschema = require('jsonschema');
const User = require('../models/user');
const newUserSchema = require("../schemas/newUserSchema.json")
const updateUserSchema = require("../schemas/updateUserSchema.json")
const createToken = require('../helpers/createToken');
const { authenticationRequired, correctUserRequired } = require('../middleware/auth');

const router = express.Router();

// Return the username, first_name, last_name and email of the user objects.
// router.get('/', authenticationRequired, async function (req, res, next) {
//     try {
//         const users = await User.findAll();
//         return res.json({ users });
//     } catch (err) {
//         return next(err);
//     }
// });

// Create a new user and return information on the newly created user.
router.post('/', async function (req, res, next) {
    try {
        console.log("Register - req.body", req.body);
        if (!req.body.image_url) {
            req.body.image_url = "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png";
        }
        console.log("Register - 1 ");
        const result = jsonschema.validate(req.body, newUserSchema);
        console.log("Register - result ", result);
        if (!result.valid) {
            const listOfErrors = result.errors.map(error => error.stack);
            console.log("Register - listOfErrors ", listOfErrors);
            const err = new ExpressError(listOfErrors, 400);
            console.log("Register - 1 err ", err);

            return next(err);
        }

        const user = await User.register(req.body);
        console.log("Register - user ", user);
        const token = createToken(user);
        console.log("Register - token", token);
        return res.status(201).json({ token });
    } catch (err) {
        console.log("Register - 2 err ", err);
        return next(err);
    }
});

// Return all the fields for a user excluding the password.
router.get('/', authenticationRequired, async function (req, res, next) {
    try {
        const user = await User.findOne(req.user.username);
        return res.json({ user: user });
    } catch (err) {
        return next(err);
    }
});

// Update an existing user and return the updated user excluding the password.
router.patch('/:username', correctUserRequired, async function (req, res, next) {
    try {
        if ('username' in req.body || 'is_admin' in req.body) {
            const err = new ExpressError("You are not allowed to change username or is_admin properties.", 400);

            return next(err);
        }

        const result = jsonschema.validate(req.body, updateUserSchema);
        if (!result.valid) {
            const listOfErrors = result.errors.map(error => error.stack);
            const err = new ExpressError(listOfErrors, 400);

            return next(err);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

// Remove an existing user and return a message.
router.delete('/:username', correctUserRequired, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ message: "User deleted" });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;