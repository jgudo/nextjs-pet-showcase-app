import { useField } from 'formik';
import { FC } from 'react';
import CreatableSelect from 'react-select/creatable';
import { SelectComponentsProps } from 'react-select/src/Select';
import { OptionsType } from 'react-select/src/types';

interface IProps extends SelectComponentsProps {
    [x: string]: any;
    name: string;
    label: string;
    placeholder?: string;
    options?: OptionsType<any>;
}

const CustomMultiSelect: FC<IProps> = (props) => {
    const [field, meta, helpers] = useField(props);
    const { options, defaultValues, label, placeholder } = props;
    const { touched, error, value } = meta;
    const { setValue } = helpers;

    const handleChange = (newValue: OptionsType<any>) => {
        const arrOfValues = newValue.map((word: any) => word.value);

        setValue(arrOfValues);
    };

    return (
        <div>
            <label className="label" htmlFor={field.name}>{label}</label>
            <CreatableSelect
                isMulti
                placeholder={placeholder}
                name={field.name}
                onChange={handleChange}
                defaultValue={defaultValues}
                options={options}
                instanceId={props.iid}
                styles={{
                    menu: (provided: any) => ({
                        ...provided,
                        zIndex: 10,
                    }),
                    input: (provided: any) => ({
                        ...provided,
                        background: 'transparent'
                    }),
                    multiValueLabel: (provided: any) => ({
                        ...provided,
                        fontWeight: 700
                    })
                }}
            />
        </div>
    );
};

export default CustomMultiSelect;