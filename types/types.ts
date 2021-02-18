import { TUserDocument } from "@/models/User";
import { NextApiRequest } from "next";

export interface IPet {
    _id?: string;
    name: string;
    owner_name: string;
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
    email: string;
    password: string;
}

export interface NextApiRequestExt extends NextApiRequest {
    user: TUserDocument;
    logOut(): void;
    logIn(user: any, errorCallback: (err: any) => any): void;
    isAuthenticated(): boolean;
}