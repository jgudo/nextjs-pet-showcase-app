import onNoMatch from '@/lib/onNoMatch';
import passport from "@/middlewares/passport";
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequestExt, NextApiResponse>({ onNoMatch });

handler
    .post(
        passport.authenticate('local-login'),
        (req, res) => {
            res.json({ success: true, data: req.user.toJSON() })
        }
    )
    .delete((req, res) => {
        console.log(req)
        req.logOut();
        res.status(204).end();
    })

export default handler;
