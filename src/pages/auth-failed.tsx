import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

const PageNotFound = () => {
    const router = useRouter();

    return (
        <div className="container">
            <h1>Authentication Failed</h1>
            <p>The same email has been already linked to another social media authentication.</p>
            <br />
            <button
                className="button--link button--icon"
                onClick={() => router.push('/login')}
            >
                <FiArrowLeft /> &nbsp; Back to Login
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

