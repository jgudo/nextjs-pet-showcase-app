import connectMongo from 'connect-mongo';
import session from 'express-session';
import { connection } from 'mongoose';

const MongoStore = connectMongo(session);

const sessionMiddleware = (req: any, res: any, next: any) => {
    const mongoStore = new MongoStore({
        mongooseConnection: connection,
        collection: 'session',
    });
    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: mongoStore,
        cookie: {
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            httpOnly: process.env.NODE_ENV === "production"
        }
    })(req, res, next);
}

export default sessionMiddleware;
