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
        <nav className="w-full h-14 laptop:h-16 bg-white fixed top-0 left-0 z-50 flex px-4 laptop:px-10 justify-between items-center shadow-sm border-b border-solid border-gray-100">
            <ul className="flex items-center space-x-4">
                <li>
                    <Link href="/">
                        <img
                            className="w-10 h-10 laptop:w-14 laptop:h-14 object-contain"
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
            <ul className="flex items-center space-x-4 laptop:space-x-8">
                <li className="py-3">
                    <Link href="/">
                        <a className="font-bold no-underline text-gray-600">Explore</a>
                    </Link>
                </li>
                {user ? (
                    <li>
                        <NavUserPill user={user} mutate={mutate} />
                    </li>
                ) : (
                        <>
                            <li className="py-3">
                                <Link href="/login"><a className="font-bold no-underline text-gray-600">Login</a></Link>
                            </li>
                            <li className="py-3">
                                <Link href="/signup"><a className="button-accent">Sign Up</a></Link>
                            </li>
                        </>
                    )}
            </ul>
        </nav >
    );
};

export default Navbar;
