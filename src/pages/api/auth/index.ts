import middlewares, { ErrorHandler, errorMiddleware, onNoMatch, passport } from '@/middlewares';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
    .use(middlewares)
    .post((req, res, next) => {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) {
                return next(new ErrorHandler(500));
            }

            if (user) {
                req.logIn(user, (err: any) => { // <-- Log user in
                    if (err) {
                        return next(new ErrorHandler(500));
                    }

                    console.log(user)
                    res.json({ user: user.toJSON() });
                });
            } else {
                next(new ErrorHandler(401, info.message));
            }
        })(req, res, next);
    })
    .delete((req, res, next) => {
        // req.logOut(); not logging out so I have to destroy session explicitly :( 
        req.session.destroy((err: any) => {
            if (err) {
                return next(new ErrorHandler(500));
            }

            res.status(204).json({ user: null });
        });
    })

export default handler;
