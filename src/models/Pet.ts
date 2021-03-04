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
    lowercase: true,
    type: String,
    required: [true, 'Please specify the species of your pet.'],
    maxlength: [30, 'Species specified cannot be more than 40 characters'],
  },
  country: {
    value: String,
    label: String
  },
  image: {
    type: Object,
    required: [true, 'Pet image is required.']
  },
  images: {
    type: [Object]
  },
  breed: {
    type: String
  },
  description: String,
  age: {
    type: Number,
  },
  poddy_trained: {
    type: Boolean,
  },
  diet: {
    type: [String],
  },
  likes: {
    type: [String],
  },
  dislikes: {
    type: [String],
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    getters: true,
    virtuals: true,
  }
})

PetSchema.pre('save', function (this: IPetDocument, next) {
  if (this.images === null) this.images = [];
  if (this.image === null) this.image = {};

  next();
})

export default models.Pet as Model<IPetDocument> || model<IPetDocument>('Pet', PetSchema)
