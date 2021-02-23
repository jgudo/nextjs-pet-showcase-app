import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { FileDrop } from "react-file-drop";
import { FaStar } from "react-icons/fa";
import { FiStar, FiX } from "react-icons/fi";
import styles from './PetImageSelector.module.scss';

interface IImageFile {
    file: File;
    url: string;
    id: string;
    isThumbnail: boolean;
}

interface IProps {
    imageFiles: IImageFile[];
    setImageFiles: Dispatch<SetStateAction<IImageFile[]>>;
}

const parseFiles = (files: FileList) => {
    const parsed = Array.from(files).map((file) => {
        const imageUrl = URL.createObjectURL(file);
        const randomString = Math.random().toString(36).substring(2);

        return {
            file,
            url: imageUrl,
            isThumbnail: false,
            id: randomString // to be used for deleting specific item from array
        }
    });

    return parsed;
}

const PetImageSelector: FC<IProps> = ({ imageFiles, setImageFiles }) => {
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (imageFiles.length > 1 && imageFiles.every(image => !image.isThumbnail)) {
            setError('Select an image as thumbnail ✰');
        } else {
            setError('');
        }

        return () => { // For freeing memory took up by createObjectURL
            if (imageFiles.length > 0) {
                imageFiles.forEach((file) => {
                    URL.revokeObjectURL(file.url);
                });
            }
        };
    }, [imageFiles]);

    const handleRemoveSelected = (id: string) => {
        const filtered = imageFiles.filter(image => image.id !== id);

        setImageFiles(filtered);
    }

    const handleSetThumbnail = (id: string) => {
        const mapped = imageFiles.map((image) => {
            if (image.id === id) {
                return { ...image, isThumbnail: true };
            }

            return { ...image, isThumbnail: false };
        });

        setImageFiles(mapped);
    }

    const validateFiles = (files: FileList | []) => {
        if (!files) return;
        if ((files.length + imageFiles.length) > 4) {
            if (!error) setError('Maximum of 4 images allowed.');
            throw new Error('Maximum of 4 photos allowed.');
        }
    }

    const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            validateFiles(files);

            const parsed = parseFiles(files);

            setError('');
            setImageFiles(state => [...state, ...parsed]);
        } catch (err) {
            console.info(err);
        }
    }

    const handleDrop = (files: FileList, event: React.DragEvent<HTMLDivElement>) => {
        try {
            validateFiles(files);

            const parsed = parseFiles(files);

            setError('');
            setImageFiles(state => [...state, ...parsed]);
        } catch (err) {
            console.info(err);
        }
    }

    return (
        <div>
            {error ? (
                <span className="label--error text-xs block">{error}</span>
            ) : (
                    <span className="text-subtle text-xs block">* Image(s)</span>
                )}
            <br />
            <div className={styles.wrapper} ref={imageContainerRef}>
                {imageFiles.length === 0 && (
                    <img
                        src="/paw_placeholder.jpg"
                        alt="placeholder"
                        className={styles.placeholder}
                    />
                )}
                <FileDrop
                    onDrop={handleDrop}
                >
                    {imageFiles.length === 0 && (
                        <>
                            <span className="text-subtle">Drop images here (4)</span>
                            <i className="text-subtle text-xs">or</i>
                            <label htmlFor="images" className={styles.button_manual}>Choose Manually</label>
                            <input
                                id="images"
                                hidden
                                multiple
                                onChange={handleManualSelect}
                                type="file"
                            />
                        </>
                    )}
                    {imageFiles.length > 0 && (
                        <div className={styles.image_grid}>
                            {imageFiles.map(image => (
                                <div className={styles.image_grid_item} key={image.id}>
                                    <button
                                        className={`${styles.button_action} ${styles.button_star}`}
                                        onClick={() => handleSetThumbnail(image.id)}
                                        style={{
                                            background: `${image.isThumbnail ? '#f3c234' : '#f1f1f1'}`,
                                            color: `${image.isThumbnail ? '#000' : '797878'}`
                                        }}
                                        title="Set as Thumbnail"
                                        type="button"
                                    >
                                        {image.isThumbnail ? <FaStar /> : <FiStar />}
                                    </button>
                                    <button
                                        className={`${styles.button_action} ${styles.button_remove}`}
                                        onClick={() => handleRemoveSelected(image.id)}
                                        title="Remove"
                                        type="button"
                                    >
                                        <FiX />
                                    </button>
                                    <img src={image.url} className={styles.grid_image} />
                                </div>
                            ))}
                        </div>
                    )}
                </FileDrop>
            </div>
            {imageFiles.length > 0 && imageFiles.length < 4 && (
                <div className={styles.choose_container}>
                    <span className="text-subtle text-xs">You can Drag and Drop your images above</span>
                    <br />
                    <label htmlFor="images" className={styles.button_manual}>
                        Choose More Images ({4 - imageFiles.length})
                    </label>
                    <input
                        type="file"
                        hidden
                        id="images"
                        multiple
                        onChange={handleManualSelect}
                    />
                </div>
            )}
        </div>
    );
};

export default PetImageSelector;
