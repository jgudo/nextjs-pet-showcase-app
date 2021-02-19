import middlewares, { ensureAuth, ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares';
import { Pet } from '@/models/index';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handlerOptions = { onNoMatch, onError: errorMiddleware }
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
  .use(middlewares)
  .get(async (req, res) => {
    try {
      const pets = await Pet.find({}).populate('owner');

      res.status(200).json({ success: true, data: pets });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  })
  .post(
    ensureAuth,
    async (req, res, next) => {
      try {
        const pet = new Pet({ ...req.body, owner: req.user._id });
        await pet.save();

        await pet.populate('owner').execPopulate();
        res.status(201).json({ success: true, data: pet });
      } catch (error) {
        console.log(error)
        next(new ErrorHandler(400));
      }
    })

export default handler;

