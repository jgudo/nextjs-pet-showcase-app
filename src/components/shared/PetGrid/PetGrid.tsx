import { IPet } from "@/types/types";
import { FC } from "react";
import PetCard from "../PetCard";

const PetGrid: FC<{ pets: IPet[] }> = ({ pets }) => {
    return (
        <div className="w-full">
            <div className="w-full grid gap-5 grid-cols-2 laptop:grid-cols-fit">
                {pets.map((pet: IPet) => (
                    <PetCard key={pet._id} pet={pet} />
                ))}
            </div>
        </div>
    );
}


export default PetGrid;
