import onNoMatch from '@/lib/onNoMatch';
import middlewares, { ensureAuth } from '@/middlewares/index';
import { Pet } from '@/models/index';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect<NextApiRequestExt, NextApiResponse>({ onNoMatch });

handler
  .use(middlewares)
  .get(async (req, res) => {
    try {
      const pets = await Pet.find({});
      res.status(200).json({ success: true, data: pets });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  })
  .post(
    ensureAuth,
    async (req, res) => {
      try {
        const pet = new Pet(req.body);
        await pet.save();

        res.status(201).json({ success: true, data: pet });
      } catch (error) {
        res.status(400).json({ success: false });
      }
    })

export default handler;

