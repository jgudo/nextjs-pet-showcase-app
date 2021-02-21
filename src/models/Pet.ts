import { Document, model, Model, models, Schema } from 'mongoose';
import { IPet } from '../types/types';

type IPetDocument = IPet & Document;

/* PetSchema will correspond to a collection in your MongoDB database. */
const PetSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this pet.'],
    maxlength: [20, 'Name cannot be more than 60 characters'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Please provide the pet owner"],
  },
  species: {

    type: String,
    required: [true, 'Please specify the species of your pet.'],
    maxlength: [30, 'Species specified cannot be more than 40 characters'],
  },
  age: {
    type: Number,
  },
  poddy_trained: {
    type: Boolean,
  },
  diet: {
    type: Array,
  },
  image_url: {
    required: [true, 'Please provide an image url for this pet.'],
    type: String,
  },
  likes: {
    type: Array,
  },
  dislikes: {
    type: Array,
  },
})

export default models.Pet as Model<IPetDocument> || model<IPetDocument>('Pet', PetSchema)
