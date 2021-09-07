import { deletePet } from '@/lib/api';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Modal from 'react-responsive-modal';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    petID: string;
}

const DeletePetModal: React.FC<IProps> = (props) => {
    const [isDeleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setErrorMessage('');
            setDeleting(true);

            await deletePet(props.petID);

            setDeleting(false);
            router.push('/')
        } catch (error) {
            setErrorMessage(error);
            setDeleting(false);
        }
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={props.closeModal}
            closeOnOverlayClick={!isDeleting}
            closeOnEsc={!isDeleting}
            showCloseIcon={false}
            classNames={{
                overlay: 'ModalOverlay',
                modal: 'Modal',
                modalContainer: 'ModalContainer',
                closeButton: 'ModalCloseButton',
                closeIcon: 'ModalCloseIcon',
            }}
        >
            <div className="relative w-full tablet:w-[400px]">
                {errorMessage && <p className="p-2 text-red-600 bg-red-100 font-bold">{errorMessage}</p>}
                <div className="p-4">
                    <h3 className="text-gray-800">Confirm Delete Pet</h3>
                    <br />
                    <p className="text-gray-600">Are you sure you want to delete this?</p>
                    <div className="flex justify-between items-center mt-8">
                        <button
                            className="button-muted"
                            disabled={isDeleting}
                            onClick={props.closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="button-danger"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>

        </Modal>
    );
};

export default DeletePetModal;