import connectMongo from 'connect-mongo';
import session from 'express-session';
import { connection } from 'mongoose';

const MongoStore = connectMongo(session);

const mongoStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'session',
});

const sessionInstance = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        secure: false, // HELP! setting true in production is not setting cookie
        sameSite: 'strict',
        httpOnly: process.env.NODE_ENV === "production"
    }
});

export default sessionInstance;
