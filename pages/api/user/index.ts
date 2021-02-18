import onNoMatch from '@/lib/onNoMatch';
import middlewares from '@/middlewares/index';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequestExt, NextApiResponse>({ onNoMatch });

handler
    .use(middlewares)
    .get((req, res) => {
        if (!req.user) return res.json({ success: false, data: null });

        return res.json({ success: true, data: req.user.toJSON() });
    })

export default handler;
