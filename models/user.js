const db = require("../db");
const bcrypt = require("bcrypt");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../helpers/ExpressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {

    /** 
     * Return an object of the newly created user:
     * => {user: user}
     */

    static async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (
				username,
				first_name,
				last_name,
                email,
                password,
                image_url,
                is_admin)
		  	VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING username, first_name, last_name, email, password, image_url, is_admin`,
            [
                data.username,
                data.first_name,
                data.last_name,
                data.email,
                hashedPassword,
                data.image_url,
                data.is_admin
            ]
        );

        return result.rows[0];
    }

    /** 
     * Return an object of all users:
     * => {users: [{username, first_name, last_name, email}, ...]}
     */

    static async findAll() {
        const results = await db.query(
            `SELECT username, 
				first_name,  
				last_name, 
				email
		  	 FROM users
			 ORDER BY username`
        );

        return results.rows;
    }

    /** 
     * Return an object of a single user:
     * => {user: {username, first_name, last_name, email, image_url}}
     */

    static async findOne(username) {
        const result = await db.query(
            `SELECT username, 
			   first_name,  
			   last_name, 
			   email,
			   image_url
			 FROM users WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];
        if (!user) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }

        return user;
    }

    /** 
     * Return an object of the updated single user:
     * => {user: {username, first_name, last_name, email, image_url}}
     */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        let { query, values } = sqlForPartialUpdate("users", data, "username", username);
        const result = await db.query(query, values);
        const user = result.rows[0];

        if (result.rows.length === 0) {
            throw new ExpressError(`There is no user with the username: ${username}`, 404);
        }

        delete user.password;

        return result.rows[0];
    }


    /** 
     * Remove an existing user and return a message:
     * => {message: "User deleted"}
     */

    static async remove(username) {
        const result = await db.query(
            `DELETE FROM users 
                WHERE username = $1 
                RETURNING username`,
            [username]);

        if (result.rows.length === 0) {
            throw new ExpressError(`There is no username: ${username}`, 404);
        }
    }

    /** 
     * Authenticate user with username and password.
     * =>  {token: token}
     * */

    static async authenticate(data) {
        // try to find the user first
        const result = await db.query(
            `SELECT username, 
                first_name, 
                last_name, 
                email, 
                password, 
                image_url, 
                is_admin
             FROM users 
             WHERE username = $1`,
            [data.username]
        );

        const user = result.rows[0];
        if (user) {
            // compare hashed password to a new hash from password
            const validUser = await bcrypt.compare(data.password, user.password);
            if (validUser) {
                return user;
            }
        }

        throw new ExpressError("Invalid Credentials", 401);
    }
}

module.exports = User;