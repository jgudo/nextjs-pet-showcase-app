import { IFilterState } from '@/provider/FilterProvider';
import { FC } from "react";

const NoPetFound: FC<{ appliedFilters: IFilterState['selected'] }> = ({ appliedFilters }) => {
    const { country, species, text } = appliedFilters;

    return (
        <div className="container">
            <h1>No Pet Found.</h1>
            <p className="text-subtle">
                Make sure to apply necessary filter or use specific keyword.
            </p>
            <br />
            <br />
            {(country?.value || species || text) && (
                <div>
                    Filters you used:
                    {country?.value && (
                        <p className="text-subtle">
                            Country: <span className="text-primary text-bold">{country.label}</span>
                        </p>
                    )}
                    {species && (
                        <p className="text-subtle">
                            Species: <span className="text-primary text-bold">{species}</span>
                        </p>
                    )}
                    {text && (
                        <p className="text-subtle">
                            Keyword: <span className="text-primary text-bold">{text}</span>
                        </p>
                    )}
                </div>
            )}
            <style jsx>
                {`
                    .container {
                        width: 100%;
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        flex-direction: column;
                    }
                `}
            </style>
        </div>
    );
}

export default NoPetFound;