import middlewares, { ensureAuth, ErrorHandler, onNoMatch } from '@/middlewares/index';
import { Pet } from '@/models/index';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect<NextApiRequestExt, NextApiResponse>({ onNoMatch });

handler
  .use(middlewares)
  .get(async (req, res) => {
    try {
      const pet = await Pet.findById(req.query.id).populate('owner');

      if (!pet) {
        return res.status(400).json({ success: false })
      }
      return res.status(200).json({ success: true, data: pet })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false })
    }
  })
  .put(
    ensureAuth,
    async (req, res) => {
      try {
        const pet = await Pet.findByIdAndUpdate(req.query.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!pet) {
          return res.status(400).json({ success: false })
        }

        await pet.populate({ path: 'owner' }).execPopulate();
        res.status(200).json({ success: true, data: pet })
      } catch (error) {
        res.status(400).json({ success: false })
      }
    })
  .delete(
    ensureAuth,
    async (req, res, next) => {
      try {
        const deletedPet = await Pet.deleteOne({ _id: req.query.id });

        if (!deletedPet) {
          return next(new ErrorHandler(400, 'Unable to process your request'))
        }

        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        next(new ErrorHandler(400, 'Unable to process your request'))
      }
    })


export default handler;
