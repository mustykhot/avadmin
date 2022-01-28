import InputErrorMsg from "./InputErrorMsg";

import "./style.scss";

const trapSpacesForRequiredFields = (value, notRequired) => {
  if (notRequired !== true) {
    return !!value.trim();
  }
};

const Select = ({
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
}) => {
  return (
    <div className={`form-group  ${extraClass} ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`input-icon-wrap`}>
        <select
          className="selectClass"
          // onChange={(e) => {
          //   handleCode(e.target.value);
          // }}
          id={id}
          {...register(name, {
            required: notRequired ? false : true,
          })}
          name={name}
        >
          <option value={0} defaultValue={0}>
            Select
          </option>
          {selectOption.map((item) => {
            return (
              <option key={item.code} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>

      {errMsg && errors[name] && <InputErrorMsg errMsg={errMsg} />}
    </div>
  );
};

export default Select;
