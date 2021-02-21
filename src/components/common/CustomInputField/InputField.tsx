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
  <>
    {touched[field.name] && errors[field.name] ? (
      <span className="label--error">{errors[field.name]}</span>
    ) : (
        <label className="label">{label}</label>
      )}
    <input
      type="text"
      className={touched[field.name] && errors[field.name] && 'input--error'} {...field} {...props}
    />
  </>
);


export default InputField