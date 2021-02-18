import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import useSWR from 'swr';

const Navbar = () => {
    const { data: user, mutate } = useSWR('api/user', fetcher);

    console.log(user)
    return (
        <nav className="top-bar">
            <div className="nav">
                <Link href="/">
                    <a>Home</a>
                </Link>
                <Link href="/login">
                    <a>Login</a>
                </Link>
                <Link href="/register">
                    <a>Register</a>
                </Link>
                <Link href="/new">
                    <a>Add Pet</a>
                </Link>
                <button onClick={async () => {
                    await fetch('/api/auth', {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    mutate(null);
                    // window.location.replace('/login');
                }}>
                    Logout
                </button>
            </div>
            <img
                id="title"
                src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
                alt="pet care logo"
            ></img>
        </nav>
    );
};

export default Navbar;
