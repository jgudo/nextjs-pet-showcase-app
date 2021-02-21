import { useCurrentUser } from '@/hooks/useUser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
    const hiddenTo = ['/login', '/signup'];
    const router = useRouter();
    const [user] = useCurrentUser();

    return hiddenTo.includes(router.pathname) ? null : (
        <nav className={styles.navbar}>
            <ul className={styles.navbar__menu}>
                <li className={styles.navbar__menu_item}>
                    <img
                        className={styles.navbar__logo}
                        id="title"
                        src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
                        alt="pet care logo"
                    />
                </li>
                <li className={styles.navbar__menu_item}>
                    <Link href="/"><a>Explore</a></Link>
                </li>
                <li className={styles.navbar__menu_item}>
                    <Link href="/new"><a>Add Pet</a></Link>
                </li>
            </ul>
            <ul className={styles.navbar__menu}>
                {user ? (
                    <li className={styles.navbar__menu_item}>
                        <h5>{user.name}</h5>
                    </li>
                ) : (
                        <>
                            <li className={styles.navbar__menu_item}>
                                <Link href="/login"><a>Login</a></Link>
                            </li>
                            <li className={styles.navbar__menu_item}>
                                <Link href="/signup"><a>Sign Up</a></Link>
                            </li>
                        </>
                    )}
                <li className={styles.navbar__menu_item}>
                    <button onClick={async () => {
                        await fetch('/api/auth', {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        window.location.replace('/login');
                    }}>
                        Logout
                </button>
                </li>
            </ul>
        </nav >
    );
};

export default Navbar;
