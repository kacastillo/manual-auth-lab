import bcrypt from "bcrypt";
import db from "../db/db.js";

const SALT_ROUNDS = 12;

export const findUserByUsername = async (username) => {
    const [results] = await db.query(
        "SELECT userId, username, password, role FROM users WHERE username = ? LIMIT 1",
        [username]
    );
    return results[0];
};

export const createUser = async (username, password, role = "user") => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role]
    );

    return {
        userId: result.insertId,
        username,
        role
    };
};

export const validatePassword = (plainPassword, hashedPassword) =>
    bcrypt.compare(plainPassword, hashedPassword);