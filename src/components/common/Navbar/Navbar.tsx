import { NavUserPill } from '@/components/shared';
import { useCurrentUser } from '@/hooks/useUser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import SearchBar from '../SearchBar';

const Navbar: FC = () => {
    const hiddenTo = ['/login', '/signup'];
    const router = useRouter();
    const { user, mutate } = useCurrentUser();

    return hiddenTo.includes(router.pathname) ? null : (
        <nav className="w-full h-16 bg-white fixed top-0 left-0 z-50 flex px-10 justify-between items-center shadow-sm">
            <ul className="flex items-center">
                <li className="py-3 px-4">
                    <Link href="/">
                        <img
                            className="w-14 h-14 object-contain"
                            id="title"
                            src="/logo.png"
                            alt="pet care logo"
                        />
                    </Link>
                </li>
                <li>
                    <SearchBar />
                </li>
            </ul>
            <ul className="flex items-center">
                <li className="py-3 px-4">
                    <Link href="/">
                        <a className="font-bold no-underline">Explore</a>
                    </Link>
                </li>
                {user ? (
                    <li className="py-3 px-4">
                        <NavUserPill user={user} mutate={mutate} />
                    </li>
                ) : (
                        <>
                            <li className="py-3 px-4">
                                <Link href="/login"><a className="font-bold no-underline">Login</a></Link>
                            </li>
                            <li className="py-3 px-4">
                                <Link href="/signup"><a className="button-accent">Sign Up</a></Link>
                            </li>
                        </>
                    )}
            </ul>
        </nav >
    );
};

export default Navbar;
