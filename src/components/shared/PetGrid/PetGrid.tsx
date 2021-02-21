import { IPet } from "@/types/types";
import { FC } from "react";
import PetCard from "../PetCard";
import styles from './PetGrid.module.css';

const PetGrid: FC<{ pets: IPet[] }> = ({ pets }) => (
    <div className={styles.grid}>
        {pets.map((pet: IPet) => (
            <PetCard key={pet._id} pet={pet} />
        ))}
    </div>
);

export default PetGrid;
