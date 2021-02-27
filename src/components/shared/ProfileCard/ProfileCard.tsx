import { IUser } from '@/types/types';
import { FC } from 'react';
import styles from './ProfileCard.module.scss';

interface IProps {
    user: IUser;
}

const ProfileCard: FC<IProps> = ({ user }) => {
    return (
        <div className={styles.container}>
            <div className={styles.avatar} style={{
                background: `#f1f1f1 url(https://i.pravatar.cc/150)`
            }} />
            <br />
            <h2>{user.name}</h2>
            <p className="text-xs">{user.email}</p>
        </div>
    )
};

export default ProfileCard;
