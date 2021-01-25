/** Middleware for handling req authorization for routes. */

const ExpressError = require("../helpers/ExpressError");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");


// Ensure that the user is logged in and authenticated.
function authenticationRequired(req, res, next) {
    console.log("TIGER --- authenticationRequired - start", req.headers.authorization);
    try {
        const { authorization } = req.headers;
        const accessToken = authorization.split(" ")[1];
        console.log("TIGER --- tokenFromBody", accessToken);
        const payload = jwt.verify(accessToken, SECRET);
        console.log("TIGER --- payload", payload);
        req.user = payload;

        return next();
    } catch (err) {
        // console.log("TIGER --- tokenFromBody --- err", req.body._token);
        // console.log("TIGER --- payload --- err", jwt.verify(tokenFromBody, SECRET));
        console.log("TIGER --- authenticationRequired err", err);
        return next(new ExpressError("Authentication required", 401));
    }
}

// Ensure the user is authorized and has permission.
function correctUserRequired(req, res, next) {
    try {
        const { authorization } = req.headers;
        const accessToken = authorization.split(" ")[1];
        const payload = jwt.verify(accessToken, SECRET);
        req.user = payload;

        if (req.user.username === req.params.username) {
            return next();
        } else {
            return next(new ExpressError("Authorization required", 401));
        }
    } catch (err) {
        return next(new ExpressError("Authorization required", 401));
    }
}

// Ensure the user has admin permission.
function adminRequired(req, res, next) {
    try {
        const { authorization } = req.headers;
        const accessToken = authorization.split(" ")[1];
        const payload = jwt.verify(accessToken, SECRET);
        req.user = payload;

        // if (!req.user || req.user.is_admin != true) {
        if (!req.user || !req.user.is_admin) {
            const err = new ExpressError("Admin access required", 401);
            return next(err);
        } else {
            return next();
        }
    } catch (err) {
        return next(new ExpressError("Admin access required", 401));
    }
}


module.exports = {
    authenticationRequired,
    correctUserRequired,
    adminRequired
};
