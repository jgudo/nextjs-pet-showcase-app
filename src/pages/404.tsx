import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const PageNotFound = () => (
    <div className="container-404">
        <h1>Ooops. You seemed lost.</h1>
        <p>The page you're trying to load doesn't exist.</p>
        <br />
        <Link href="/">
            <a className="button--link button--icon">
                <FiArrowLeft /> &nbsp; Back to Home
            </a>
        </Link>
    </div>
);

export default PageNotFound;
