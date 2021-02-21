import { NextApiRequestExt } from "@/types/types";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";

const ensureAuth = (req: NextApiRequestExt, res: NextApiResponse, next: NextHandler) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({
        statusCode: 401,
        status: 'error',
        message: "You're unauthorized to make a request."
    });
}

export default ensureAuth;