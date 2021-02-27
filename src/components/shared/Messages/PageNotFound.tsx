import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

const PageNotFound = () => {
    const router = useRouter();

    return (
        <div className="container">
            <h1>Ooops. You seemed lost.</h1>
            <p>The page you're trying to load doesn't exist.</p>
            <br />
            <button
                className="button--link button--icon"
                onClick={() => router.push('/')}
            >
                <FiArrowLeft /> &nbsp; Back to Home
                </button>
            <style jsx>
                {`
                .container {
                    padding: 50px;
                    margin-top: 80px;
                }
                `}
            </style>
        </div>
    )
};

export default PageNotFound;

