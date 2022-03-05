import {useState} from "react";
import "./style.scss";
import InputErrorMsg from "./InputErrorMsg";
import {useFormContext} from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
export const trapSpacesForRequiredFields = (value, required) => {
  if (required) {
    // return !!value.trim();
  }
};

const InputField = ({
  type,
  id,
  name,
  placeholder,
  isDisabled,
  errMsg,
  iconPlaceholder,
  className,
  required = true,
  label,
  validatePassword,
  extraValidation,
  ...props
}) => {
  let pattern;
  switch (type) {
    case "text":
      pattern = /[a-zA-Z0-9]/;
      break;
    case "email":
      pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      break;

    default:
      pattern = "";
      break;
  }

  const [showPassword, setShowPassword] = useState(true);
  const {
    register,
    formState: {errors},
  } = useFormContext();

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="clr-redClr">*</span>}
        </label>
      )}
      <div
        className={`input-icon-wrap ${
          iconPlaceholder ? "icon-placeholder" : ""
        } ${errors[name] ? "is-invalid" : ""}`}
      >
        {iconPlaceholder && (
          <button disabled className="icon icon-left">
            {iconPlaceholder}
          </button>
        )}
        {type === "password" ? (
          <>
            <input
              autoComplete="off"
              name={name}
              disabled={isDisabled}
              type={showPassword ? "password" : "text"}
              id={id}
              {...register(name, {
                required: required ? "You must specify a password" : false,
                validate: value =>
                  validatePassword ? validatePassword(value) : null,
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
              {...props}
              placeholder={placeholder}
            />
            <button
              disabled={isDisabled}
              onClick={() => setShowPassword(prev => !prev)}
              type="button"
              className="icon icon-right"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </>
        ) : (
          <>
            <input
              autoComplete="off"
              disabled={isDisabled}
              {...props}
              type={type}
              id={id || name}
              {...register(name, {
                required: required ? "This Field is required" : false,
                validate: value => {
                  trapSpacesForRequiredFields(value, required);
                  extraValidation && extraValidation(value);
                },
                pattern: {
                  value: pattern,
                  message: `Please enter a valid ${type} field`,
                },
              })}
              name={name}
              placeholder={placeholder}
            />
          </>
        )}
      </div>

      {errors[name] && (
        <InputErrorMsg errMsg={errors[name].message || errMsg} />
      )}
    </div>
  );
};

export default InputField;
