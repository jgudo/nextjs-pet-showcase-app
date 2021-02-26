import { useFilter } from "@/provider/FilterProvider";
import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";
import { CountryDropDown } from "..";
import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const { filter, changeFilter } = useFilter();
    const router = useRouter();

    const handleChange = (val: { label: string; value: string; }) => {
        changeFilter('country', val);
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.share}>
                <button className="button--icon" onClick={() => router.push('/new')}>
                    <FiPlus /> &nbsp;Share my Pet
                </button>
            </div>
            <br />
            <span className="text-subtle text-xs">Country</span>
            <CountryDropDown
                selected={filter.country}
                onChange={handleChange}
                defaultValue={filter.country}
            />
        </aside>
    );
};

export default Sidebar;
