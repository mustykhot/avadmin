import PhoneInput from "react-phone-input-2";
import InputErrorMsg from "./InputErrorMsg";
import "react-phone-input-2/lib/style.css";
import "./style.scss";

const trapSpacesForRequiredFields = (value, notRequired) => {
  if (notRequired !== true) {
    return !!value.trim();
  }
};

const Phone = ({
  id,
  name,
  errors,
  register,
  errMsg,
  className,
  notRequired,
  extraClass,
  selectOption,
  handleCode,
  label,
  telVal,
  setTelVal,
}) => {
  return (
    <div className={`form-group  ${extraClass} ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`input-icon-wrap`}>
        <PhoneInput
          country={"us"}
          value={telVal}
          onChange={(phone) => {
            setTelVal(phone);
          }}
        />
      </div>

      {errMsg && errors[name] && <InputErrorMsg errMsg={errMsg} />}
    </div>
  );
};

export default Phone;
