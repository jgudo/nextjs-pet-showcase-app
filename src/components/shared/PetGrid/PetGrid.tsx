import { IPet } from "@/types/types";
import { FC } from "react";
import PetCard from "../PetCard";

interface IProps {
    pets: IPet[];
    isLoading: boolean;
}

const PetGrid: FC<IProps> = ({ pets, isLoading }) => {
    return (
        <div className="w-full">
            <div className="w-full grid gap-5 grid-cols-2 laptop:grid-cols-fit">
                {isLoading ? new Array(6).fill({}).map((pet, index) => (
                    <PetCard key={(Math.random() + 1).toString(36).substring(7)} />
                )) : pets.map((pet: IPet) => (
                    <PetCard key={pet._id} pet={pet} />
                ))}
            </div>
        </div>
    );
}


export default PetGrid;
