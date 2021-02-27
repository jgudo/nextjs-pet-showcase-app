import { IPet } from "@/types/types";
import { FC } from "react";
import PetCard from "../PetCard";
import styles from './PetGrid.module.scss';

const PetGrid: FC<{ pets: IPet[] }> = ({ pets }) => {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {pets.map((pet: IPet) => (
                    <PetCard key={pet._id} pet={pet} />
                ))}
            </div>
        </div>
    );
}


export default PetGrid;
