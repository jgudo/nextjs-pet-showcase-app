import { uploadImage } from '@/lib/cloudinary';
import middlewares, { ensureAuth, ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares/index';
import { User } from '@/models';
import { NextApiRequestExt } from '@/types/types';
import { IncomingForm } from 'formidable';
import { NextApiResponse } from 'next';
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware }
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

export const config = {
    api: {
        bodyParser: false,
    },
}

handler
    .use(middlewares)
    .get(async (req, res) => {
        const { uid } = req.query;

        if ((uid === 'me' && req.user) || uid === req.user?._id.toString()) {
            const me = { user: { ...req.user.toJSON(), isOwnProfile: true } };

            return res.status(200).json(me);
        }

        const user = await User.findById(req.query.uid);

        return res.status(200).json({ user: { ...user.toJSON(), isOwnProfile: false } });
    })
    .patch(
        ensureAuth,
        async (req, res, next) => {
            const { uid } = req.query;

            if (uid !== req.user._id.toString()) {
                return next(new ErrorHandler(401));
            }
            const promise = new Promise((resolve, reject) => {
                const form = new IncomingForm();

                form.onPart = function (part) {
                    if (!part.filename || part.filename.match(/\.(jpg|jpeg|png)$/i)) {
                        form.handlePart(part);
                    }
                    else {
                        return next(new ErrorHandler(400, 'File type of jpg,png,jpeg only allowed.'));
                    }
                }

                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve({ fields, files });
                });
            })

            return promise.then(async ({ fields, files }) => {
                try {
                    const imageSrc = files.photo ? await uploadImage(files.photo, 'profile') : req.user.photo; // single 

                    const updated = await User
                        .findByIdAndUpdate(
                            uid,
                            {
                                $set: {
                                    ...fields,
                                    photo: imageSrc
                                }
                            },
                            { new: true }
                        )

                    const result = { ...updated.toObject(), isOwnProfile: true };
                    res.status(201).json({ success: true, data: result });
                } catch (error) {
                    console.log('ERR ------------', error)
                    next(new ErrorHandler(500));
                }
            })
        })

export default handler;
