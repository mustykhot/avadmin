import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import InputErrorMsg from "./InputErrorMsg";
import EyeClosedIcon from "../../assets/icons/EyeClosedIcon";
import "./style.scss";
import { useFormContext } from "react-hook-form";

const trapSpacesForRequiredFields = (value, notRequired) => {
  if (notRequired !== true) {
    return !!value.trim();
  }
};

const InputAmount = ({
  type,
  id,
  name,
  placeholder,

  isDisabled,
  errMsg,
  IconPlaceholder,
  className,
  notRequired,
  extraClass,
  inputExtraClass,

  label,
}) => {
  const [isTypePassword, setisTypePassword] = useState(true);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`form-group  ${extraClass} ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`input-icon-wrap ${
          IconPlaceholder ? "icon-placeholder" : ""
        } ${errors[name] ? "is-invalid" : ""}`}
      >
        <div className="currencyDiv">
          <p>₦</p>
        </div>
        <input
          autoComplete="off"
          disabled={isDisabled}
          type={type}
          id={id}
          className={inputExtraClass}
          {...register(name, {
            required: notRequired ? false : true,
            validate: (value) =>
              trapSpacesForRequiredFields(value, notRequired),
          })}
          name={name}
          placeholder={placeholder}
        />
      </div>

      {errMsg && errors[name] && <InputErrorMsg errMsg={errMsg} />}
    </div>
  );
};

export default InputAmount;
