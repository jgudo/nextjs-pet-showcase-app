import { useMediaQuery } from '@/hooks';
import { IPet } from "@/types/types";
import { useRouter } from 'next/router';
import { FC } from "react";
import { FiPlus } from 'react-icons/fi';
import PetCard from "../PetCard";

interface IProps {
    pets: IPet[];
    isLoading: boolean;
}

const PetGrid: FC<IProps> = ({ pets, isLoading }) => {
    const isSmallScreen = useMediaQuery(1024);
    const router = useRouter();

    const addNew = () => {
        router.push('/new');
    }

    return (
        <div className="w-full">
            <div className="w-full grid gap-5 grid-cols-2 laptop:grid-cols-fit">
                {isLoading ? new Array(6).fill({}).map((pet, index) => (
                    <PetCard key={(Math.random() + 1).toString(36).substring(7)} />
                )) : pets.map((pet: IPet) => (
                    <PetCard key={pet._id} pet={pet} />
                ))}
            </div>
            {isSmallScreen && (
                <div
                    className="w-12 h-12 rounded-full bg-red-600 fixed bottom-4 right-4 z-20 shadow-md flex items-center justify-center"
                    onClick={addNew}
                >
                    <FiPlus className="text-white" size={30} />
                </div>
            )}
        </div>
    );
}


export default PetGrid;
