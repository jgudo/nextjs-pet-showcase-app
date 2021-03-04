import { AddNewButton } from "@/components/shared";
import { useFilter } from "@/provider/FilterProvider";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Option } from "react-select/src/filters";
import { CountryDropDown } from "..";
import SpeciesDropDown from "../SpeciesDropDown";

const capitalize = (str: string) => str[0].toUpperCase().concat(str.slice(1));

const labelize = (str: string) => ({ label: capitalize(str), value: str.toLowerCase() });

const Sidebar = () => {
    const { filter, changeFilter, resetFilter } = useFilter();
    const [isVisibleFilter, setVisibleFilter] = useState(false);
    const router = useRouter();
    const isSmallScreen = typeof window !== 'undefined' && window.screen.width <= 1024;

    const handleCountryChange = (val: Option) => {
        changeFilter('country', val);
        setVisibleFilter(false);
    }

    const handleSpeciesChange = (val: Option) => {
        changeFilter('species', val.value);
        setVisibleFilter(false);
    }

    return (
        <aside className={`transition-all duration-500 w-full laptop:w-auto laptop:min-w-300px mb-4 fixed ${isVisibleFilter ? 'top-14 shadow-lg' : '-top-28'} left-0 z-30 px-4 laptop:px-0 bg-white laptop:bg-transparent laptop:mb-0 laptop:sticky laptop:top-20 laptop:mr-12 pt-5`}>
            {!isSmallScreen && (
                <div className="mb-8">
                    <AddNewButton />
                </div>
            )}
            <span className="text-subtle text-xs">Country</span>
            <CountryDropDown
                selected={filter.selected.country}
                onChange={handleCountryChange}
                defaultOptions={filter.filters.countries}
                defaultValue={filter.selected.country}
            />
            <br />
            <span className="text-subtle text-xs">Species</span>
            <SpeciesDropDown
                onChange={handleSpeciesChange}
                defaultValue={filter.selected.species ? labelize(filter.selected.species) : null}
                options={filter.filters.species.map(item => labelize(item))}
                selected={filter.selected.species ? labelize(filter.selected.species) : null}
            />
            <br />
            {Object.values(filter.selected).some(val => Boolean(val) && !isSmallScreen) && (
                <span
                    className="font-bold text-red-500 underline hover:cursor-pointer"
                    onClick={resetFilter}
                >
                    Reset Filters
                </span>
            )}
            {isSmallScreen && (
                <div
                    className="w-full py-2 flex items-center justify-between"
                    onClick={() => setVisibleFilter(!isVisibleFilter)}
                >
                    <div className="flex items-center space-x-4 text-primary-500 font-bold">
                        <span>{isVisibleFilter ? 'Hide Filters' : 'Show Filters'}</span>
                        {isVisibleFilter ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    {Object.values(filter.selected).some(val => Boolean(val)) && (
                        <span
                            className="font-bold text-red-500 hover:cursor-pointer"
                            onClick={resetFilter}
                        >
                            Reset Filters
                        </span>
                    )}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
