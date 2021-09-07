import React, { useState } from 'react';
import Modal from 'react-responsive-modal';
import { mutate } from 'swr';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
}

const LogoutModal: React.FC<IProps> = (props) => {
    const [isLoggingOut, setLogginOut] = useState(false);

    const handleLogOut = async () => {
        setLogginOut(true);
        await fetch('/api/auth', {
            method: 'DELETE',
            credentials: 'include'
        });
        mutate('/api/user');
        setLogginOut(false);

        window.location.replace('/login');
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={props.closeModal}
            closeOnOverlayClick={!isLoggingOut}
            closeOnEsc={!isLoggingOut}
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
                <div className="p-4">
                    <h3 className="text-gray-800">Confirm Logout</h3>
                    <br />
                    <p className="text-gray-600">Are you sure you want to logout?</p>
                    <div className="flex justify-between items-center mt-8">
                        <button
                            className="button-muted"
                            disabled={isLoggingOut}
                            onClick={props.closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="button-danger"
                            onClick={handleLogOut}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>

        </Modal>
    );
};

export default LogoutModal;