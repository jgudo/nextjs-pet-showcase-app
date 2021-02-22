import { IUser } from "@/types/types";
import { FC, useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { mutateInterface } from "swr/dist/types";
import styles from './NavUserPill.module.scss';

interface IProps {
    user: IUser;
    mutate: mutateInterface;
}

const NavUserPill: FC<IProps> = ({ user, mutate }) => {
    const [isOpen, setOpen] = useState(false);
    const isOpenRef = useRef(isOpen);

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
        <div className={styles.navbar__user} onClick={() => setOpen(true)}>
            <img src="https://i.pravatar.cc/150" alt="Avatar" />
            <h5>{user.name}</h5>
            &nbsp;
            <FiChevronDown />
            {isOpen && (
                <div className={styles.navbar__user_dropdown}>
                    <button className="button--block button--icon" onClick={async () => {
                        await fetch('/api/auth', {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        mutate('/api/user');
                        window.location.replace('/login');
                    }}>
                        <FiLogOut /> &nbsp; Logout
                </button>
                </div>
            )}
        </div>
    );
};

export default NavUserPill;
