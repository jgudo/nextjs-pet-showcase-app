import { IPet } from "@/types/types";
import Link from 'next/link';
import { FC } from "react";
import { FiEdit3, FiEye } from "react-icons/fi";
import styles from './PetCard.module.scss';

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
                <div className={styles.card_back} style={{ background: `url(${pet.image_url})` }}>
                    <div className={styles.card_back_content}>
                        <div className={styles.card_info}>
                            <span className={styles.label}>Owner</span>
                            <p className={styles.value}>{pet.owner?.name}</p>

                            <span className={styles.label}>Age</span>
                            <p className={styles.value}>{pet.age > 1 ? 'years' : '< 1 year'} old</p>
                        </div>
                        <div className={styles.card_actions}>
                            <Link href="/pet/[id]/edit" as={`/pet/${pet._id}/edit`}>
                                <a className="button--link button--accent">
                                    <FiEdit3 /> &nbsp; Edit
                                </a>
                            </Link>
                            <Link href="/pet/[id]" as={`/pet/${pet._id}`}>
                                <a className="button--link button--icon button--accent-1">
                                    <FiEye /> &nbsp; View
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <h3 className={styles.pet_name}>{pet.name}</h3>
        </div>
    );
};

export default PetCard;
