import { FC, useMemo } from "react";
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import { SelectComponentsProps } from "react-select/src/Select";
import styles from './CountryDropDown.module.scss';

// Flags Preview
const Control: FC<SelectComponentsProps> = ({ children, ...props }) => {
    const { countryCode } = props.selectProps;

    return (
        <components.Control {...props as any}>
            {countryCode && (
                <img
                    src={`https://www.countryflags.io/${countryCode}/flat/64.png`}
                    style={{ marginRight: 0, marginLeft: '2px' }}
                />
            )}
            {children}
        </components.Control>
    );
};

interface IProps {
    onChange: (val: { value: string; label: string; }) => void;
    selected?: { value: string; label: string; };
    defaultValue?: any;
    placeholder?: string;
    [prop: string]: any;
}

const CountryDropDown: FC<IProps> = (props) => {
    const { onChange, selected, defaultValue, placeholder, ...rest } = props;
    const options = useMemo(() => [{ label: 'None', value: "" }, ...countryList().getData()], []);

    return (
        <div className={styles.select_country}>
            <Select
                {...rest}
                defaultValue={defaultValue}
                options={options}
                name="country"
                countryCode={selected?.value}
                components={{ Control }}
                id="country"
                placeholder={placeholder || "Select Country"}
                onChange={onChange}
            />
        </div>
    );
};

export default CountryDropDown;
