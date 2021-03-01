import fetcher from "@/lib/fetcher";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Option } from "react-select/src/filters";
import useSWR from "swr";

export interface IFilterState {
    filters: {
        species: string[];
        countries: Option[];
    },
    selected: {
        country: Option;
        species: string;
        text: string;
    }
}

interface IFilterContext {
    filter: IFilterState;
    changeFilter: (field: string, value: any) => void;
    resetFilter: () => void;
}

const initState = {
    filters: {
        species: [],
        countries: []
    },
    selected: {
        country: null,
        species: '',
        text: ''
    }
}

const FilterContext = createContext<IFilterContext | undefined>(undefined);

const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState<IFilterState>(initState);
    const { data: filters } = useSWR('/api/filters', fetcher);

    useEffect(() => {
        if (filters) {
            setFilter({
                ...filter,
                filters: { ...filters.data }
            })
        }
    }, [filters]);

    const changeFilter = (field: string, value: any) => {
        setFilter({
            ...filter,
            selected: {
                ...filter.selected,
                [field]: value
            }
        });
    };

    const resetFilter = () => {
        setFilter({ ...filter, selected: initState.selected });
    }

    const value = useMemo(() => ({ filter, changeFilter, resetFilter }), [filter]);

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

    const { filter, changeFilter, resetFilter } = context;
    return { filter, changeFilter, resetFilter };
}
