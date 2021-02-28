import { deleteImage, uploadImage } from '@/lib/cloudinary';
import middlewares, { ensureAuth, ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares/index';
import { Pet } from '@/models/index';
import { NextApiRequestExt } from '@/types/types';
import { IncomingForm } from 'formidable';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

export const config = {
  api: {
    bodyParser: false
  }
}

handler
  .use(middlewares)
  .get(async (req, res) => {
    try {
      const pet = await Pet.findById(req.query.id).populate('owner');

      if (!pet) {
        return res.status(400).json({ success: false })
      }

      // append  the isOwnPet property
      const result = {
        ...pet.toObject(),
        isOwnPet: pet.owner._id.toString() === req.user?._id.toString()
      };

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false })
    }
  })
  .put(
    ensureAuth,
    async (req, res, next) => {
      const promise = new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.multiples = true;

        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          const { jsonProp, ...rest } = fields;
          const parsedFields = { ...rest, ...JSON.parse(jsonProp as string) }

          resolve({ fields: parsedFields, files });
        })
      })

      return promise.then(async ({ fields, files }) => {
        try {
          const pet = await Pet.findById(req.query.id);

          if (!pet) next(new ErrorHandler(404));

          if (pet.owner.toString() === req.user._id.toString()) {
            const imageSrc = files.image ? await uploadImage(files.image, 'thumbnail') : fields.image; // single 
            const imagesArraySrc = files.imageFiles ? await uploadImage(files.imageFiles, 'images') : fields.images; // multiple

            const updatedPet = await Pet
              .findByIdAndUpdate(req.query.id, {
                $set: {
                  ...fields,
                  image: imageSrc,
                  images: imagesArraySrc,
                }
              },
                {
                  new: true,
                  runValidators: true,
                }
              );

            console.log(updatedPet)

            await updatedPet.populate({ path: 'owner' }).execPopulate();

            // append isOwnPet property
            const result = { ...updatedPet.toJSON(), isOwnPet: true };
            res.status(200).json({ success: true, data: result });
          } else {
            next(new ErrorHandler(401));
          }
        } catch (error) {
          next(new ErrorHandler(400));
        }
      })
    }
  )
  .delete(
    ensureAuth,
    async (req, res, next) => {
      try {
        const pet = await Pet.findById(req.query.id);

        if (!pet) return next(new ErrorHandler(404, 'Pet not found'));

        if (pet.owner.toString() === req.user._id.toString()) {
          const imageIDs = [pet.image, ...pet.images]  // array of image public_ids
            .filter(img => img?.public_id)
            .map(img => img.public_id);

          await deleteImage(imageIDs) // delete images

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
