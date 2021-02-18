import dbConnect from '@/utils/dbConnect';
import nextConnect from 'next-connect';
import passport from './passport';
import session from './session';

const middlewares = nextConnect();
middlewares
    .use((req, res, next) => {
        dbConnect();
        next();
    })
    .use(session)
    .use(passport.initialize())
    .use(passport.session());

export { default as ensureAuth } from './ensureAuth';
export { middlewares as default, passport, session };

