import { createContext, useContext, useMemo, useState } from "react";

interface IFilterState {
    country: { value: string; label: string; }
}

interface IFilterContext {
    filter: IFilterState;
    changeFilter: (field: string, value: any) => void;
}

const initState = {
    country: null
}

const FilterContext = createContext<IFilterContext | undefined>(undefined);

const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState<IFilterState>(initState);

    const changeFilter = (field: string, value: any) => {
        setFilter({ ...filter, [field]: value });
    };

    const value = useMemo(() => ({ filter, changeFilter }), [filter]);

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};

export default FilterProvider;

export const useFilter = () => {
    const context = useContext<IFilterContext>(FilterContext);

    if (!context) {
        throw new Error(`useFilter must be used within a FilterProvider`)
    }

    const { filter, changeFilter } = context;
    return { filter, changeFilter };
}
