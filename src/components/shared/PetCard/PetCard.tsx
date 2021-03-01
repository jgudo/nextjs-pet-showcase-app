import { IPet } from "@/types/types";
import Link from 'next/link';
import { useRouter } from "next/router";
import { FC } from "react";
import { FiEdit3, FiEye } from "react-icons/fi";
import styles from './PetCard.module.scss';

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
        <div className={styles.card}>
            <div className={styles.card_content}>
                {pet.country && (
                    <div
                        className={styles.country_badge}
                        style={{ background: `#f1f1f1 url(${`https://www.countryflags.io/${pet.country?.value}/shiny/64.png`})` }}
                        title={pet.country?.label || ""}
                    />
                )}
                <div className={styles.card_front}>
                    <img
                        className={styles.card_image}
                        src={pet.image_url || pet.image.url}
                    />
                </div>
                <div className={styles.card_back} style={{ background: `url(${pet.images[0]?.url || pet.image?.url})` }}>
                    <div className={styles.card_back_content}>
                        <div className={styles.card_info}>
                            <span className={styles.label}>Species</span>
                            <p className={styles.value}>{pet.species}</p>
                            <span className={styles.label}>Age</span>
                            <p className={styles.value}>{displayAge(pet.age)}</p>
                            <span className={styles.label}>From</span>
                            <p className={styles.value}>{pet.country?.label}</p>
                            <span className={styles.label}>Owner</span>
                            <p
                                className={`${styles.value} text-accent link`}
                                onClick={() => router.push(`/owner/${pet.owner?._id}`)}
                            >
                                {pet.owner?.name}
                            </p>
                        </div>
                        <div className={styles.card_actions}>
                            {pet.isOwnPet && (
                                <Link href="/pet/[id]/edit" as={`/pet/${pet._id}/edit`}>
                                    <a className="button--link button--accent">
                                        <FiEdit3 /> &nbsp; Edit
                                </a>
                                </Link>
                            )}
                            <Link href="/pet/[id]" as={`/pet/${pet._id}`}>
                                <a className="button--link button--icon button--accent-1">
                                    <FiEye /> &nbsp; More Details
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
