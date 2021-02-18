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
    console.log('USER------', req.user)
    try {
      const pet = await Pet.findById(req.query.id)
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
        })
        if (!pet) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: pet })
      } catch (error) {
        res.status(400).json({ success: false })
      }
    })
  .delete(
    ensureAuth,
    async (req, res) => {
      try {
        const deletedPet = await Pet.deleteOne({ _id: req.query.id })
        if (!deletedPet) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
    })


export default handler;
