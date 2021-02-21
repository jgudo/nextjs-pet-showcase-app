import connectMongo from 'connect-mongo';
import session from 'express-session';
import { connection } from 'mongoose';

const MongoStore = connectMongo(session);

const sessionMiddleware = (req: any, res: any, next: any) => {
    const mongoStore = new MongoStore({
        mongooseConnection: connection,
        collection: 'session'
    });
    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoStore,
    })(req, res, next);
}

export default sessionMiddleware;
