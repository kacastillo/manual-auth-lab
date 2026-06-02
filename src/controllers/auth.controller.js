import {
    createUser,
    findUserByUsername,
    validatePassword
} from "../services/user.service.js";

const loginPage = (req, res) => {
    res.render("login", {
        title: "Login",
        errors: req.query.errors || null
    });
};

const registerPage = (req, res) => {
    res.render("register", {
        title: "Register",
        errors: req.query.errors || null
    });
};

const register = async (req, res) => {
    const { username, password, confirm, role } = req.body;

    if (!username || !password || password !== confirm) {
        return res.redirect("/register?errors=Invalid registration details");
    }

    const existing = await findUserByUsername(username);
    if (existing) {
        return res.redirect("/register?errors=Username already taken");
    }

    await createUser(username, password, role);
    return res.redirect("/login");
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if (!user) {
        return res.redirect("/login?errors=Invalid credentials");
    }

    const valid = await validatePassword(password, user.password);
    if (!valid) {
        return res.redirect("/login?errors=Invalid credentials");
    }

    // Store only a sanitized user — never the password or its hash.
    req.session.user = {
        userId: user.userId,
        username: user.username,
        role: user.role
    };

    return res.redirect("/dashboard");
};

// destroy the session so the server forgets the user.
const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};

//  only allow logged-in users through.
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        return next();
    }
    return res.redirect("/login?errors=Please log in to continue");
};

// only allow users with the required role through.
const hasRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        return next();
    }
    return res.redirect("/dashboard?errors=Access denied");
};

export default {
    loginPage,
    registerPage,
    register,
    login,
    logout,
    isLoggedIn,
    hasRole
};