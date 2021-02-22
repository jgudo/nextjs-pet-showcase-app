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
  <div className="input-fieldset">
    {touched[field.name] && errors[field.name] ? (
      <span className="label--error">{errors[field.name]}</span>
    ) : (
        <label className="label" htmlFor={field.name}>{label}</label>
      )}
    <input
      type="text"
      id={field.name}
      className={touched[field.name] && errors[field.name] && 'input--error'} {...field} {...props}
    />
  </div>
);


export default InputField