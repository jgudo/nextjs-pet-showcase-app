import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";
import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const router = useRouter();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.share}>
                <button className="button--icon" onClick={() => router.push('/new')}>
                    <FiPlus /> &nbsp;Share my Pet
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
