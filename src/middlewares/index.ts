import dbConnect from '@/utils/dbConnect';
import nextConnect from 'next-connect';
import { ErrorHandler } from './errorMiddleware';
import passport from './passport';
import session from './session';

const middlewares = nextConnect();
middlewares
    .use(async (req, res, next) => {
        try {
            await dbConnect();
            next();
        } catch (err) {
            next(new ErrorHandler(500, 'Unable to connect to database'));
        }
    })
    .use(session)
    .use(passport.initialize())
    .use(passport.session());

export { default as ensureAuth } from './ensureAuth';
export { default as errorMiddleware, ErrorHandler } from './errorMiddleware';
export { default as onNoMatch } from './onNoMatchRoute';
export { middlewares as default, passport, session };

