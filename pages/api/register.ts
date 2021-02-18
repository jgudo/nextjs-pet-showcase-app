import onNoMatch from '@/lib/onNoMatch';
import middlewares from '@/middlewares/index';
import passport from "@/middlewares/passport";
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequestExt, NextApiResponse>({ onNoMatch });

handler
    .use(middlewares)
    .post((req, res, next) => {
        passport.authenticate('local-register', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (user) {
                req.logIn(user, (err) => { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    return res.json({ success: true, data: user.toJSON() });
                });
            } else {
                res.status(400).send({ success: false, error: info });
            }
        })(req, res, next)
    })

export default handler;
