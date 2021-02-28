import { uploadImage } from '@/lib/cloudinary';
import middlewares, { ensureAuth, ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares';
import { Pet } from '@/models/index';
import { IUser, NextApiRequestExt } from '@/types/types';
import { IncomingForm } from 'formidable';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handlerOptions = { onNoMatch, onError: errorMiddleware }
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

export const config = {
  api: {
    bodyParser: false,
  },
}

handler
  .use(middlewares)
  .get(async (req, res, next) => {
    try {
      const { country, species, text, owner } = req.query;
      const query: any = {};

      // query building
      if (country) query['country.value'] = { $regex: country, $options: 'i' };
      if (species) query.species = { $regex: species, $options: 'i' };
      if (text) query.name = { $regex: text, $options: 'i' };
      if (owner) {
        query.owner = (owner === 'me' ? req.user._id : owner);
      }

      const pets = await Pet.find(query).populate('owner');

      const result = pets.map(pet => ({
        ...pet.toObject(),
        isOwnPet: pet.owner._id.toString() === req.user?._id.toString()
      }));

      if (result.length === 0) {
        return next(new ErrorHandler(404, 'No pet found.'));
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  })
  .post(
    ensureAuth,
    async (req, res, next) => {
      const promise = new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.multiples = true;

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
          const { jsonProp, ...rest } = fields;
          const parsedFields = { ...rest, ...JSON.parse(jsonProp as string) }
          resolve({ fields: parsedFields, files });
        })
      })

      return promise.then(async ({ fields, files }) => {
        try {
          const userID = (req.user as IUser)._id;
          const imageSrc = await uploadImage(files.image, 'thumbnail'); // single 
          const imagesArraySrc = files.imageFiles ? await uploadImage(files.imageFiles, 'images') : []; // multiple

          const pet = new Pet({
            ...fields,
            owner: userID,
            image: imageSrc,
            images: imagesArraySrc
          });

          await pet.save();
          await pet.populate('owner').execPopulate();

          const result = { ...pet.toObject(), isOwnPet: pet.owner._id.toString() === userID.toString() };
          res.status(201).json({ success: true, data: result });
        } catch (error) {
          console.log(error)
          next(new ErrorHandler(500));
        }
      })
    }
  )

export default handler;