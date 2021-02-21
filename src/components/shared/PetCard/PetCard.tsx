import { IPet } from "@/types/types";
import Link from 'next/link';
import { FC } from "react";
import styles from './PetCard.module.css';

interface IProps {
    pet: IPet
}

const PetCard: FC<IProps> = ({ pet }) => {
    return (
        <div className={styles.card}>
            <div className={styles.card_content}>
                <div className={styles.card_front}>
                    <img className={styles.card_image} src={pet.image_url} />
                </div>
                <div className={styles.card_back}>
                    <p className="pet-name">{pet.name}</p>
                    <p className="owner">Owner: {pet.owner?.name}</p>

                    {/* Extra Pet Info: Likes and Dislikes */}
                    <div className="likes info">
                        <p className="label">Likes</p>
                        <ul>
                            {pet.likes.map((data, index) => (
                                <li key={index}>{data} </li>
                            ))}
                        </ul>
                    </div>
                    <div className="dislikes info">
                        <p className="label">Dislikes</p>
                        <ul>
                            {pet.dislikes.map((data, index) => (
                                <li key={index}>{data} </li>
                            ))}
                        </ul>
                    </div>
                    <div className="btn-container">
                        <Link href="/pets/[id]/edit" as={`/pet/${pet._id}/edit`}>
                            <button className="btn edit">Edit</button>
                        </Link>
                        <Link href="/pet/[id]" as={`/pet/${pet._id}`}>
                            <button className="btn view">View</button>
                        </Link>
                    </div>
                </div>
            </div>
            <h3 className={styles.pet_name}>{pet.name}</h3>
        </div>
    );
};

export default PetCard;
