
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="author" content="Julius Guevarra" />
                    <meta name="keywords" content="nextjs, pawshow, pet, react-pet-site, nextjs-mongodb, pet-sharing" />
                    <meta name="title" content="PawShow - Show your pet to the world with PawShow" />
                    <meta name="description" content="Share and discover pets from around the globe" />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://paw-show-jgudo.vercel.app/" />
                    <meta property="og:title" content="PawShow - Show your pet to the world with PawShow" />
                    <meta property="og:description" content="Share and discover pets from around the globe" />
                    <meta property="og:image" content="https://paw-show-jgudo.vercel.app/thumbnail.jpg" />
                    <meta property="fb:app_id" content="217035993441109" />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://paw-show-jgudo.vercel.app" />
                    <meta property="twitter:title" content="PawShow - Show your pet to the world with PawShow" />
                    <meta property="twitter:description" content="Share and discover pets from around the globe" />
                    <meta property="twitter:image" content="https://paw-show-jgudo.vercel.app/thumbnail.jpg" />
                    <meta name="thumbnail" content="https://paw-show-jgudo.vercel.app/thumbnail.jpg" />
                    <link
                        href="https://cdn.rawgit.com/mfd/09b70eb47474836f25a21660282ce0fd/raw/e06a670afcb2b861ed2ac4a1ef752d062ef6b46b/Gilroy.css"
                        rel="stylesheet"
                    />
                    <link href="/favicon.png" rel="shortcut icon" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument