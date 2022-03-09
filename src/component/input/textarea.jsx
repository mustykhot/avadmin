import { useFormContext } from "react-hook-form";
import InputErrorMsg from "./InputErrorMsg";

import "./style.scss";

const trapSpacesForRequiredFields = (value, notRequired) => {
  if (notRequired !== true) {
    return !!value.trim();
  }
};

const Textarea = ({
  id,
  name,
  errMsg,
  className,
  notRequired,
  required = true,
  extraClass,
  placeholder,
  isDisabled,
  inputExtraClass,
  label,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`form-group  ${extraClass} ${className}`}>
      {label && (
        <label htmlFor={id}>
          {label}
          {!notRequired && <span className="clr-redClr">*</span>}
        </label>
      )}

      <textarea
        autoComplete="off"
        disabled={isDisabled}
        id={id}
        className={inputExtraClass}
        {...register(name, {
          required: required ? true : false,
          validate: (value) => trapSpacesForRequiredFields(value, notRequired),
        })}
        name={name}
        placeholder={placeholder}
      ></textarea>

      {errMsg && errors[name] && <InputErrorMsg errMsg={errMsg} />}
    </div>
  );
};

export default Textarea;
