import middlewares, { ensureAuth, ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares/index';
import { Pet } from '@/models/index';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

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
    async (req, res, next) => {
      try {
        const pet = await Pet.findById(req.query.id);

        if (!pet) next(new ErrorHandler(404));

        if (pet.owner.toString() === req.user._id.toString()) {
          const updatedPet = await Pet.findByIdAndUpdate(req.query.id, req.body, {
            new: true,
            runValidators: true,
          });

          await updatedPet.populate({ path: 'owner' }).execPopulate();
          res.status(200).json({ success: true, data: updatedPet })
        } else {
          next(new ErrorHandler(401));
        }
      } catch (error) {
        next(new ErrorHandler(400));
      }
    })
  .delete(
    ensureAuth,
    async (req, res, next) => {
      try {
        const pet = await Pet.findById(req.query.id);

        if (!pet) return next(new ErrorHandler(404, 'Pet not found'));

        if (pet.owner.toString() === req.user._id.toString()) {
          console.log('OWNER')
          const deletedPet = await Pet.deleteOne({ _id: req.query.id });

          if (!deletedPet) {
            return next(new ErrorHandler(422));
          }

          res.status(200).json({ success: true, data: {} })
        } else {
          next(new ErrorHandler(401));
        }
      } catch (error) {
        console.log('ERR', error)
        next(new ErrorHandler(400))
      }
    })


export default handler;
