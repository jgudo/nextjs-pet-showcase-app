import { useFilter } from '@/provider/FilterProvider';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
    const [text, setText] = useState('');
    const { filter: { selected }, changeFilter } = useFilter();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setText(val);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = (e.target as HTMLInputElement).value
            setText(val)
            changeFilter('text', val);

            if (router.pathname !== '/') router.push('/');
        }
    }

    const handleClear = () => {
        changeFilter('text', '');
        setText('');
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
                value={text}
            />
            {selected.text && (
                <FiX
                    className={styles.search_clear}
                    onClick={handleClear}
                    title="Clear Text"
                />
            )}
        </div>
    );
};

export default SearchBar;
