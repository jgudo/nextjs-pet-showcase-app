import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";

const AddNewButton = () => {
    const router = useRouter();

    return (
        <button
            className={`flex items-center space-x-2 relative`}
            onClick={() => router.push('/new')}
        >
            <FiPlus />
            <span>Share my Pet</span>
        </button>
    )
};

export default AddNewButton;
