import { updateUser } from '@/lib/api';
import { IUser } from '@/types/types';
import { FC, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { mutate } from 'swr';

interface IProps {
    user?: IUser;
}

const ProfileCard: FC<IProps> = ({ user }) => {
    const [isEditMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name || '');
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
        <SkeletonTheme
            color="#66a0fe"
            highlightColor="#99c0ff"
        >
            <div className="min-w-300px text-center flex items-center flex-col bg-primary-500 laptop:rounded-lg text-white p-5 shadow-lg">
                <div
                    className="w-20 h-20 laptop:w-52 laptop:h-52 !bg-cover !bg-no-repeat border-4 border-solid border-primary-500 shadow-solid relative rounded-full"
                    style={user ? {
                        background: `#f1f1f1 url(${photo.url || user.photo?.url || 'https://i.pravatar.cc/150'})`
                    } : {
                        background: '#66a0fe'
                    }}
                >
                    {(isEditMode && user) && (
                        <div className="w-full h-full absolute top-0 left-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center overflow-hidden hover:cursor-pointer">
                            <label className="w-full h-full text-white flex flex-col text-center justify-center items-center hover:opacity-80 hover:cursor-pointer" htmlFor="photo">
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
                <div>
                    {isEditMode ? (
                        <input
                            accept="image/*"
                            className="text-center font-medium !text-xl !bg-transparent text-white !border-accent-400"
                            onChange={handleNameChange}
                            placeholder="Name"
                            required
                            disabled={isLoading}
                            type="text"
                            value={name}
                        />
                    ) : (
                        <h2>{user?.name || <Skeleton width={200} height={15} />}</h2>
                    )}
                    {/* ----- -EMAIL -------- */}
                    {!user ? (
                        <Skeleton width={150} height={10} />
                    ) : (
                        <p className="text-xs mb-4 laptop:my-4">{user.email}</p>
                    )}
                    {/* ---- EDIT BUTTONS ---- */}
                    {(isEditMode && user) && (
                        <div className="flex space-x-2">
                            <button
                                disabled={isLoading}
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                            <button
                                className="button-accent"
                                disabled={isLoading}
                                onClick={handleSubmitChanges}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                    {user && !isEditMode && user?.isOwnProfile && (
                        <button onClick={handleEditToggle}>Edit Details</button>
                    )}
                </div>
            </div>
        </SkeletonTheme>
    )
};

export default ProfileCard;
