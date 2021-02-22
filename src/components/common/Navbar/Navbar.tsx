import { NavUserPill } from '@/components/shared';
import { useCurrentUser } from '@/hooks/useUser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import styles from './Navbar.module.scss';

const Navbar: FC = () => {
    const hiddenTo = ['/login', '/signup'];
    const router = useRouter();
    const [user, { mutate }] = useCurrentUser();

    return hiddenTo.includes(router.pathname) ? null : (
        <nav className={styles.navbar}>
            <ul className={styles.navbar__menu}>
                <li className={styles.navbar__menu_item}>
                    <img
                        className={styles.navbar__logo}
                        id="title"
                        src="/logo.png"
                        alt="pet care logo"
                    />
                </li>
                <li className={styles.navbar__menu_item}>
                    <Link href="/"><a>Explore</a></Link>
                </li>
            </ul>
            <ul className={styles.navbar__menu}>
                {user ? (
                    <li className={styles.navbar__menu_item}>
                        <NavUserPill user={user} mutate={mutate} />
                    </li>
                ) : (
                        <>
                            <li className={styles.navbar__menu_item}>
                                <Link href="/login"><a>Login</a></Link>
                            </li>
                            <li className={styles.navbar__menu_item}>
                                <Link href="/signup"><a className="button--link button--accent">Sign Up</a></Link>
                            </li>
                        </>
                    )}
            </ul>
        </nav >
    );
};

export default Navbar;
