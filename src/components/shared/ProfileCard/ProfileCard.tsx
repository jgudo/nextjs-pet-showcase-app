import { updateUser } from '@/lib/api';
import { IUser } from '@/types/types';
import { FC, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import { mutate } from 'swr';
import styles from './ProfileCard.module.scss';

interface IProps {
    user: IUser;
}

const ProfileCard: FC<IProps> = ({ user }) => {
    const [isEditMode, setEditMode] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [isLoading, setLoading] = useState(false);
    const [photo, setPhoto] = useState({ file: null, url: '' });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        const regex = /(\.jpg|\.jpeg|\.png)$/i;

        if (!file) return;
        if ((file.size / 1024 / 1024) > 4) return;
        if (!regex.exec(file.name)) return alert('File type must be jpg or png');

        setPhoto({
            file: file,
            url: URL.createObjectURL(file)
        });
    }

    const handleEditToggle = () => setEditMode(true);

    const handleCancelEdit = () => {
        URL.revokeObjectURL(photo.url);
        setPhoto({ file: null, url: '' });
        setEditMode(false);
    }

    const handleSubmitChanges = async () => {
        try {
            if (name || photo.file) {
                setLoading(true);
                const formData = new FormData();
                photo.file && formData.append('photo', photo.file);
                formData.append('name', name || user.name);

                const updated = await updateUser(user._id, formData);
                mutate(`/api/user/${user._id}`, { user: updated }, false);
                setLoading(false);
                setEditMode(false);
            }
        } catch (err) {
            setLoading(false);
            alert(err);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatar} style={{
                background: `#f1f1f1 url(${photo.url || user.photo?.url || 'https://i.pravatar.cc/150'})`
            }}>
                {isEditMode && (
                    <div className={styles.photo_overlay}>
                        <label className={styles.change_photo} htmlFor="photo">
                            <FiCamera /> Change Photo
                    </label>
                        <input
                            hidden
                            id="photo"
                            disabled={isLoading}
                            onChange={handlePhotoChange}
                            type="file"
                        />
                    </div>
                )}
            </div>
            <br />
            {isEditMode ? (
                <input
                    accept="image/*"
                    className={styles.input}
                    onChange={handleNameChange}
                    placeholder="Name"
                    required
                    disabled={isLoading}
                    type="text"
                    value={name}
                />
            ) : (
                    <h2>{user.name}</h2>
                )}
            <p className="text-xs">{user.email}</p>
            {isEditMode ? (
                <div>
                    <button
                        disabled={isLoading}
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </button>
                    <button
                        className="button--accent"
                        disabled={isLoading}
                        onClick={handleSubmitChanges}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                    <button onClick={handleEditToggle}>Edit Details</button>
                )}
        </div>
    )
};

export default ProfileCard;
