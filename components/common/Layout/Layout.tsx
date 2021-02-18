import Head from 'next/head';
import { FC } from 'react';
import Navbar from '../Navbar';

const Layout: FC = ({ children }) => {
    return (
        <>
            <Head>
                <title>Pet Care App</title>
            </Head>
            <Navbar />
            <main>{children}</main>
        </>
    );
};

export default Layout;
