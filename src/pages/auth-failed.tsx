import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

const PageNotFound = () => {
    const router = useRouter();

    return (
        <div className="mt-12 laptop:mt-20 py-5 px-5 laptop:px-12">
            <h1 className="text-2xl laptop:text-4xl">Authentication Failed</h1>
            <p className="text-gray-600 mt-4">It could be the cause of any of the following:</p>
            <br />
            <ul className="text-gray-500">
                <li className="block ml-8">• The same email has been linked to another social media auth.</li>
                <li className="block ml-8">• The user has denied access to basic information of social media auth.</li>
            </ul>
            <br />
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

