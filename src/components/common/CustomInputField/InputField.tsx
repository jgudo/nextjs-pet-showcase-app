import { FieldProps } from "formik";
import { FC } from "react";

interface IProps extends FieldProps {
  label: string;
}

const InputField: FC<IProps> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors },
  label,
  ...props
}) => (
  <div className="flex flex-col">
    {touched[field.name] && errors[field.name] ? (
      <span className="text-red-500 text-xs">{errors[field.name]}</span>
    ) : (
        <label htmlFor={field.name}>{label}</label>
      )}
    <input
      type="text"
      id={field.name}
      className={`${touched[field.name] && errors[field.name] && '!border-red-500'}`} {...field} {...props}
    />
  </div>
);


export default InputField