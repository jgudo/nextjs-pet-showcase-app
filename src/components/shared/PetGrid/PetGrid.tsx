import fetcher from "@/lib/fetcher";
import { useFilter } from "@/provider/FilterProvider";
import { IPet } from "@/types/types";
import { FC } from "react";
import useSWR from "swr";
import NoPetFound from "../Messages/NoPetFound";
import SomethingWentWrong from "../Messages/SomethingWentWrong";
import PetCard from "../PetCard";
import styles from './PetGrid.module.scss';

const PetGrid: FC = () => {
    const { filter } = useFilter();
    const query = `/api/pets?country=${filter.country?.value || ""}`;
    const { data: pets, error } = useSWR(query, fetcher);

    if (error) {
        return error?.statusCode === 404 ? <NoPetFound /> : <SomethingWentWrong />;
    }

    if (!pets) return <h1>Loading...</h1>

    return (
        <div className={styles.grid}>
            {pets.data.map((pet: IPet) => (
                <PetCard key={pet._id} pet={pet} />
            ))}
        </div>
    );
}


export default PetGrid;
