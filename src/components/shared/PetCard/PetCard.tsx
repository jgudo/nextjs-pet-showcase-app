import { IPet } from "@/types/types";
import Link from 'next/link';
import { useRouter } from "next/router";
import { FC } from "react";
import { FiEdit3, FiEye } from "react-icons/fi";

interface IProps {
    pet: IPet
}

const displayAge = (age: number) => {
    const year = age > 1 ? 'years' : 'year';

    if (age >= 1) {
        return `${age} ${year} old`
    } else {
        return `< 1 year old`;
    }
}

const PetCard: FC<IProps> = ({ pet }) => {
    const router = useRouter();

    return (
        <div
            className="w-full h-60 laptop:h-94 relative text-white"
            onClick={() => window.screen.width <= 1024 && router.push(`/pet/${pet._id}`)}
        >
            <div className="w-full h-90% relative group">
                {pet.country && (
                    <div
                        className="w-10 h-10 rounded-full !bg-no-repeat !bg-center absolute -top-3 -right-3 z-10 shadow-lg !bg-size-flag"
                        style={{ background: `#f1f1f1 url(${`https://www.countryflags.io/${pet.country?.value}/shiny/64.png`})` }}
                        title={pet.country?.label || ""}
                    />
                )}
                {/* ------ FRONT CARD ----- */}
                <div className="transform transition-transform duration-500 ease-in-out w-full h-full rotate-y-0 laptop:group-hover:rotate-y-180 p-2 backface-hidden !bg-no-repeat !bg-cover !bg-center absolute top-0 left-0 rounded-lg overflow-hidden shadow-md">
                    <img
                        className="w-full h-full object-cover absolute top-0 right-0"
                        src={pet.image_url || pet.image.url}
                    />
                </div>
                {/* ------ BACK CARD ----- */}
                <div className="transform transition-transform duration-500 ease-in-out w-full h-full rotate-y-180 group-hover:rotate-y-0 p-2 backface-hidden !bg-no-repeat !bg-cover !bg-center absolute top-0 left-0 rounded-lg overflow-hidden shadow-md hidden laptop:block" style={{ background: `url(${pet.images[0]?.url || pet.image?.url})` }}>
                    <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-60" />
                    <div className="relative z-10 h-full flex flex-col justify-between flex-wrap">
                        <div className="flex flex-col space-y-2">
                            <div>
                                <span className="text-gray-300 text-xs">Species</span>
                                <p className="text-sm">{pet.species}</p>
                            </div>
                            <div>
                                <span className="text-gray-300 text-xs">Age</span>
                                <p className="text-sm">{displayAge(pet.age)}</p>
                            </div>
                            <div>
                                <span className="text-gray-300 text-xs">From</span>
                                <p className="text-sm">{pet.country?.label}</p>
                            </div>
                            <div>
                                <span className="text-gray-300 text-xs">Owner</span>
                                <p
                                    className="text-sm text-accent-400 underline cursor-pointer"
                                    onClick={() => router.push(`/owner/${pet.owner?._id}`)}
                                >
                                    {pet.owner?.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-evenly self-end w-full">
                            {pet.isOwnPet && (
                                <Link href="/pet/[id]/edit" as={`/pet/${pet._id}/edit`}>
                                    <a className="button-accent space-x-2">
                                        <FiEdit3 />
                                        <span className="hidden laptop:inline-block">Edit</span>
                                    </a>
                                </Link>
                            )}
                            <Link href="/pet/[id]" as={`/pet/${pet._id}`}>
                                <a className="button-accent-1 space-x-2">
                                    <FiEye />
                                    <span className="hidden laptop:inline-block">More Details</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <h4 className="mt-1 text-gray-800">{pet.name}</h4>
        </div>
    );
};

export default PetCard;
