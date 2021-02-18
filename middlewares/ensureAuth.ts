import { NextApiRequestExt } from "@/types/types";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";

const ensureAuth = (req: NextApiRequestExt, res: NextApiResponse, next: NextHandler) => {
    if (req.isAuthenticated) {
        next();
    }
}

export default ensureAuth;