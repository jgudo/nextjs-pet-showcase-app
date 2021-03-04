import { IFilterState } from '@/provider/FilterProvider';
import { FC } from "react";

const NoPetFound: FC<{ appliedFilters: IFilterState['selected'] }> = ({ appliedFilters }) => {
    const { country, species, text } = appliedFilters;

    return (
        <div className="w-full px-5 flex justify-center items-center flex-col text-center">
            <h1 className="text-xl laptop:text-4xl">No Pet Found.</h1>
            <p className="text-gray-500">
                Make sure to apply necessary filter or use specific keyword.
            </p>
            <br />
            <br />
            {(country?.value || species || text) && (
                <div>
                    <span className="text-gray-500 mb-4 block">Filters you used:</span>
                    {country?.value && (
                        <p className="text-gray-400">
                            Country: <span className="text-accent-500 font-bold">{country.label}</span>
                        </p>
                    )}
                    {species && (
                        <p className="text-gray-400">
                            Species: <span className="text-accent-500 font-bold">{species}</span>
                        </p>
                    )}
                    {text && (
                        <p className="text-gray-400">
                            Keyword: <span className="text-accent-500 font-bold">{text}</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default NoPetFound;