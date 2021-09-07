import LogoutModal from '@/components/common/Modal/LogoutModal';
import { useModal } from '@/hooks';
import { IUser } from "@/types/types";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { mutateCallback } from "swr/dist/types";

interface IProps {
    user: IUser;
    mutate: mutateCallback;
}

const NavUserPill: FC<IProps> = ({ user, mutate }) => {
    const [isOpen, setOpen] = useState(false);
    const isOpenRef = useRef(isOpen);
    const router = useRouter();
    const modal = useModal();

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        const target = (e.target as HTMLDivElement).closest('.navbar__user');

        if (!target && isOpenRef.current) {
            setOpen(false);
        }
    }

    return (
        <>
            <div
                className="flex items-center p-1 pr-4 rounded-full relative hover:cursor-pointer hover:bg-accent-400"
                onClick={() => setOpen(true)}
            >
                <img
                    className="w-9 h-9 rounded-full object-cover mr-3 bg-gray-300"
                    alt="Avatar"
                    src={`${user.photo?.url || 'https://i.pravatar.cc/150'}`}
                />
                <h5 className="hidden laptop:inline-block">{user.name}</h5>
                &nbsp;
                <FiChevronDown />
                {isOpen && (
                    <div className="w-40 absolute right-0 top-11 bg-white rounded-lg shadow-lg overflow-hidden">
                        <button
                            className="bg-none w-full text-gray-800 rounded-none flex justify-between bg-white hover:text-white hover:bg-primary-600"
                            onClick={() => router.push('/owner/me')}
                        >
                            <FiUser />
                            <span>My Profile</span>
                        </button>
                        <button
                            className="bg-none w-full text-gray-800 rounded-none flex justify-between bg-white hover:text-white hover:bg-primary-600"
                            onClick={modal.openModal}
                        >
                            <FiLogOut />
                            &nbsp;
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
            <LogoutModal
                isOpen={modal.isOpen}
                closeModal={modal.closeModal}
                openModal={modal.openModal}
            />
        </>
    );
};

export default NavUserPill;
