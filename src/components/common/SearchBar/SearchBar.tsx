import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
    const [text, setText] = useState('');

    const handleSearch = async () => {
        try {
            const req = await fetch(`/api/search?q=${text}`);

        } catch (err) {

        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setText(val);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && text) {
            handleSearch();
        }
    }

    return (
        <div className={styles.search_container}>
            <FiSearch className={styles.search_icon} />
            <input
                className={styles.search_input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for pet..."
                type="text"
            />
        </div>
    );
};

export default SearchBar;
