import { IImageFile } from "@/types/types";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { FileDrop } from "react-file-drop";
import { FaStar } from "react-icons/fa";
import { FiStar, FiX } from "react-icons/fi";

interface IProps {
    imageFiles: IImageFile[];
    isSubmitting: boolean;
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
            type: 'local',
            raw: null,
            id: randomString // to be used for deleting specific item from array
        }
    });

    return parsed;
}

const PetImageSelector: FC<IProps> = ({ imageFiles, isSubmitting, setImageFiles }) => {
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (imageFiles.length > 1 && imageFiles.every(image => !image.isThumbnail)) {
            setError('Select an image as thumbnail ★');
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
        const regex = /(\.jpg|\.jpeg|\.png)$/i;
        if (!files) return;

        if ((files.length + imageFiles.length) > 4) {
            throw new Error('Maximum of 4 photos only allowed.');
        } else if (Array.from(files).some(file => !regex.exec(file.name))) {
            throw new Error('File type of jpg,png,jpeg only allowed.');
        } else if (Array.from(files).some(file => (file.size / 1024 / 1024) > 3)) {
            throw new Error('Max file size per image exceeded 3mb.');
        } else {
            setError('');
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
            setError(err?.message || 'File validation error.');
        }
    }

    const handleDrop = (files: FileList, event: React.DragEvent<HTMLDivElement>) => {
        if (isSubmitting) return;

        try {
            validateFiles(files);

            const parsed = parseFiles(files);

            setError('');
            setImageFiles(state => [...state, ...parsed]);
        } catch (err) {
            setError(err?.message || 'File validation error.');
        }
    }

    return (
        <div>
            {error ? (
                <span className="text-xs text-red-500">{error}</span>
            ) : (
                    <span className="text-xs text-gray-500">* Image(s)</span>
                )}
            <br />
            <div
                className="w-full h-80 bg-gray-100 border-2 border-dashed border-gray-300 relative mt-2"
                ref={imageContainerRef}
            >
                {imageFiles.length === 0 && (
                    <img
                        src="/paw_placeholder.jpg"
                        alt="placeholder"
                        className="w-full h-full absolute top-0 left-0 object-cover"
                    />
                )}
                <FileDrop
                    onDrop={handleDrop}
                >
                    {imageFiles.length === 0 && (
                        <>
                            <span className="text-gray-500">Drop images here (4)</span>
                            <i className="text-gray-500 text-xs">or</i>
                            <label htmlFor="images" className="bg-gray-200 border border-solid border-gray-300 py-1 px-3 rounded-full text-sm cursor-pointer hover:bg-gray-300 text-gray-700">Choose Manually</label>
                            <input
                                id="images"
                                hidden
                                multiple
                                accept="image/*"
                                disabled={isSubmitting}
                                onChange={handleManualSelect}
                                type="file"
                            />
                        </>
                    )}
                    {imageFiles.length > 0 && (
                        <div className="w-full h-full absolute top-0 left-0 grid grid-cols-minmax-fit grid-rows-minmax-fit">
                            {imageFiles.map(image => (
                                <div
                                    className="relative border border-dashed border-gray-300 h-full group"
                                    key={image.id}
                                >
                                    <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50 hidden group-hover:block" />
                                    <button
                                        className={`absolute bg-white text-gray-700 p-0 w-6 h-6 border border-solid border-gray-400 rounded-full flex items-center justify-center z-10 shadow-lg top-1 left-1 hover:bg-accent-300 hover:text-gray-800 ${image.isThumbnail && 'bg-accent-300 text-gray-800 w-7 h-7'}`}
                                        disabled={isSubmitting}
                                        onClick={() => handleSetThumbnail(image.id)}
                                        title="Set as Thumbnail"
                                        type="button"
                                    >
                                        {image.isThumbnail ? <FaStar /> : <FiStar />}
                                    </button>
                                    <button
                                        className="absolute bg-white text-gray-700 p-0 w-6 h-6 border border-solid border-gray-400 rounded-full flex items-center justify-center z-10 shadow-lg top-1 right-1 hover:bg-red-500 hover:text-white"
                                        disabled={isSubmitting}
                                        onClick={() => handleRemoveSelected(image.id)}
                                        title="Remove"
                                        type="button"
                                    >
                                        <FiX />
                                    </button>
                                    <img src={image.url} className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    )}
                </FileDrop>
            </div>
            {imageFiles.length > 0 && imageFiles.length < 4 && (
                <div className="mt-2 flex flex-col justify-center items-center">
                    <span className="text-gray-500 text-xs">You can Drag and Drop your images above</span>
                    <br />
                    <label htmlFor="images" className="bg-gray-200 border border-solid border-gray-300 py-1 px-3 rounded-full text-sm cursor-pointer hover:bg-gray-300 text-gray-700">
                        Choose More Images ({4 - imageFiles.length})
                    </label>
                    <input
                        disabled={isSubmitting}
                        hidden
                        id="images"
                        accept="image/*"
                        onChange={handleManualSelect}
                        multiple
                        type="file"
                    />
                </div>
            )}
        </div>
    );
};

export default PetImageSelector;
