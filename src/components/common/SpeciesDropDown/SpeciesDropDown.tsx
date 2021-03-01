import { FC } from "react";
import Select from 'react-select';
import { Option } from "react-select/src/filters";
import styles from './SpeciesDropDown.module.scss';

interface IProps {
    onChange: (val: Option) => void;
    defaultValue?: any;
    placeholder?: string;
    defaultOptions?: any[];
    [prop: string]: any;
    selected: Omit<Option, 'data'>;
}

const SpeciesDropDown: FC<IProps> = (props) => {
    const {
        onChange,
        defaultValue,
        placeholder,
        options,
        selected,
        ...rest
    } = props;
    const def = { label: 'All Species', value: "" }

    return (
        <div className={styles.select_species}>
            <Select
                {...rest}
                defaultValue={defaultValue || def}
                options={[def, ...options]}
                name="species"
                id="species"
                value={selected || def}
                placeholder={placeholder || "Select Species"}
                onChange={onChange}
            />
        </div>
    );
};

export default SpeciesDropDown;
