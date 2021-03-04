import { useFilter } from "@/provider/FilterProvider";
import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";
import { Option } from "react-select/src/filters";
import { CountryDropDown } from "..";
import SpeciesDropDown from "../SpeciesDropDown";

const capitalize = (str: string) => str[0].toUpperCase().concat(str.slice(1));

const labelize = (str: string) => ({ label: capitalize(str), value: str.toLowerCase() });

const Sidebar = () => {
    const { filter, changeFilter, resetFilter } = useFilter();
    const router = useRouter();

    const handleCountryChange = (val: Option) => {
        changeFilter('country', val);
    }

    const handleSpeciesChange = (val: Option) => {
        changeFilter('species', val.value);
    }

    return (
        <aside className="min-w-300px sticky top-20 mr-12 pt-5">
            <div className="w-full flex justify-center">
                <button className="flex items-center" onClick={() => router.push('/new')}>
                    <FiPlus /> &nbsp;Share my Pet
                </button>
            </div>
            <br />
            <br />
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
            {Object.values(filter.selected).some(val => Boolean(val)) && (
                <span
                    className="font-medium text-base text-primary-500 underline hover:cursor-pointer"
                    onClick={resetFilter}
                >
                    Reset Filters
                </span>
            )}
        </aside>
    );
};

export default Sidebar;
