import { NextApiRequest } from "next";
import { SessionData } from "next-session";

export interface IPet {
    _id?: string;
    name: string;
    owner: IUser;
    country?: {
        value: string;
        label: string;
    }
    breed?: string;
    species: string;
    age: number;
    poddy_trained: boolean;
    diet: string[];
    image_url: string;
    description: string;
    image: Record<string, any>;
    images: Record<string, any>[];
    likes: string[];
    dislikes: string[];
    isOwnPet?: boolean;
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    provider: string;
    photo: Record<string, any>;
    isOwnProfile?: boolean;
}

export interface IError {
    status: string;
    statusCode: number;
    message: string;
    errors: any[];
}

export interface IImageFile {
    file: File;
    url: string;
    id: string;
    type: string,
    raw?: any; // the uploaded image that came from db to be used when setting thumbnail
    isThumbnail: boolean;
}

export type NextApiRequestExt = NextApiRequest & SessionData