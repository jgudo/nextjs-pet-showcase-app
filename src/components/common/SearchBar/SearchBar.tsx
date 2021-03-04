import { useFilter } from '@/provider/FilterProvider';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

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
        <div className="relative">
            <FiSearch className="absolute top-0 bottom-0 left-1 my-auto text-gray-400" />
            <input
                className="!py-4 !px-6 w-60"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for pet..."
                type="text"
                value={text}
            />
            {text && (
                <FiX
                    className="text-gray-500 hover:text-gray-700 absolute top-0 bottom-0 right-0 my-auto"
                    onClick={handleClear}
                    title="Clear Text"
                />
            )}
        </div>
    );
};

export default SearchBar;
