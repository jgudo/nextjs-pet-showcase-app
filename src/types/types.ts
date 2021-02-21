import { NextApiRequest } from "next";
import { SessionData } from "next-session";

export interface IPet {
    _id?: string;
    name: string;
    owner: IUser;
    species: string;
    age: number;
    poddy_trained: boolean;
    diet: string[];
    image_url: string;
    likes: string[];
    dislikes: string[];
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
}

export interface IError {
    status: string;
    statusCode: number;
    message: string;
    errors: any[];
}

export type NextApiRequestExt = NextApiRequest & SessionData