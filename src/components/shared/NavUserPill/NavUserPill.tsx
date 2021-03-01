import { IUser } from "@/types/types";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { mutateCallback } from "swr/dist/types";
import styles from './NavUserPill.module.scss';

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
        <div className={styles.navbar__user} onClick={() => setOpen(true)}>
            <img src={`${user.photo?.url || 'https://i.pravatar.cc/150'}`} alt="Avatar" />
            <h5>{user.name}</h5>
            &nbsp;
            <FiChevronDown />
            {isOpen && (
                <div className={styles.navbar__user_dropdown}>
                    <button
                        className={styles.menu_button}
                        disabled={isLoggingOut}
                        onClick={() => router.push('/owner/me')}
                    >
                        <FiUser />
                        <span>My Profile</span>
                    </button>
                    <button
                        className={styles.menu_button}
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
