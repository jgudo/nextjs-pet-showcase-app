import { IUser } from '@/types/types';
import bcrypt from 'bcryptjs';
import { Document, model, Model, models, Schema } from 'mongoose';

export type TUserDocument = IUser & Document;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        maxlength: 64,
        validate: {
            validator: (email: string) => {
                const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(email);
            },
            message: '{VALUE} is invalid.'
        }
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
        maxlength: 100
    },
    name: {
        type: String,
        required: [true, 'Name is required.'],
        maxlength: 40
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        getters: true,
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

UserSchema.pre('save', function (this: TUserDocument, next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next();
            });
        })
    } else {
        next();
    }
});

export default models.User as Model<TUserDocument> || model<TUserDocument>('User', UserSchema)