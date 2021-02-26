import middlewares, { ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares/index';
import passport from "@/middlewares/passport";
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
    .use(middlewares)
    .post((req, res, next) => {
        passport.authenticate('local-register', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (user) {
                req.logIn(user, (err: any) => { // <-- Log user in
                    if (err) {
                        return next(new ErrorHandler(500));
                    }

                    return res.json({ user: user.toJSON() });
                });
            } else {
                next(new ErrorHandler(400, info?.message || 'Unable to process request.'))
            }
        })(req, res, next)
    })

export default handler;
