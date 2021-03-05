import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

const PageNotFound = () => {
    const router = useRouter();

    return (
        <div className="mt-12 laptop:mt-20 py-5 px-5 laptop:px-12">
            <h1 className="text-2xl laptop:text-4xl">Authentication Failed</h1>
            <p className="text-gray-500 mt-4">The same email has been already linked to another social media authentication.</p>
            <br />
            <button
                className="flex items-center"
                onClick={() => router.push('/login')}
            >
                <FiArrowLeft /> &nbsp; Back to Login
                </button>
        </div>
    )
};

export default PageNotFound;

