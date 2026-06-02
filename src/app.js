import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import defaultRouter from './routers/routes.js';

dotenv.config();

//configure Express.js app
const app = express();

//view engine
app.set("view engine", "ejs");
app.set("views", "src/views");

//static directories
app.use(express.static('public'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

app.use((req, res, next) => {
    req.user = req.session.user || null;
    next();
});

//routers
app.use("/", defaultRouter);

export default app;