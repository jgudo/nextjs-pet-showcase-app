import { IUser } from "@/types/types";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
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
    const [isLoggingOut, setLogginOut] = useState(false);

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
                        disabled={isLoggingOut}
                        onClick={() => router.push('/owner/me')}
                    >
                        <FiUser />
                        <span>My Profile</span>
                    </button>
                    <button
                        className="bg-none w-full text-gray-800 rounded-none flex justify-between bg-white hover:text-white hover:bg-primary-600"
                        disabled={isLoggingOut}
                        onClick={handleLogOut}
                    >
                        {isLoggingOut ? <AiOutlineLoading className="spin" /> : <FiLogOut />}
                        &nbsp;
                        <span>{isLoggingOut ? 'Logging Out...' : 'Logout'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavUserPill;
