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
      {label && <label htmlFor={id}>{label}</label>}

      <textarea
        autoComplete="off"
        disabled={isDisabled}
        id={id}
        className={inputExtraClass}
        {...register(name, {
          required: notRequired ? false : true,
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
