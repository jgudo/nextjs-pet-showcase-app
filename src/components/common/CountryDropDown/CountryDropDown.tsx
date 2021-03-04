import { FC, useMemo } from "react";
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import { Option } from "react-select/src/filters";
import { SelectComponentsProps } from "react-select/src/Select";

// Flags Preview
const Control: FC<SelectComponentsProps> = ({ children, ...props }) => {
    const { countryCode } = props.selectProps;

    return (
        <components.Control {...props as any}>
            {countryCode && (
                <img
                    className="w-10 h-10 mx-2 flex-shrink-0"
                    src={`https://www.countryflags.io/${countryCode}/flat/64.png`}
                />
            )}
            {children}
        </components.Control>
    );
};

interface IProps {
    onChange: (val: Option) => void;
    selected?: Option;
    defaultValue?: any;
    placeholder?: string;
    defaultOptions?: any[];
    [prop: string]: any;
}

const CountryDropDown: FC<IProps> = (props) => {
    const {
        onChange,
        selected,
        defaultValue,
        placeholder,
        defaultOptions,
        ...rest
    } = props;
    const def = { label: 'All Country', value: "" };
    const options = useMemo(() => [...countryList().getData()], []);

    return (
        <div className="flex items-center">
            <Select
                {...rest}
                defaultValue={defaultValue || def}
                options={defaultOptions ? [def, ...defaultOptions] : [def, ...options]}
                name="country"
                countryCode={selected?.value}
                components={{ Control }}
                id="country"
                placeholder={placeholder || "Select Country"}
                onChange={onChange}
                value={selected || def}
                styles={{
                    container: (provided) => ({
                        ...provided,
                        width: '100%'
                    })
                }}
            />
        </div>
    );
};

export default CountryDropDown;
