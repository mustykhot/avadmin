import * as React from "react";
import {Controller, useFormContext} from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {FormLabel} from "@mui/material";
import InputErrorMsg from "./InputErrorMsg";

export default function SelectField({
  name,
  errMsg,
  className,
  required = true,
  selectOption = [],
  label,
  isLoading,
  isDisabled,
  handleCustomChange,
  fetchErr,
  placeholder,
}) {
  const {
    control,
    formState: {errors},
  } = useFormContext();

  return (
    <FormControl
      sx={{m: "10px 0"}}
      className={`form-group select-group ${className}`}
    >
      {label && (
        <FormLabel htmlFor={name}>
          {label} {required && <span className="clr-redClr">*</span>}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={name}
        rules={{required: required ? errMsg : false}}
        render={({field: {onChange, value = "", ref}}) => (
          <Select
            className="select-mui"
            ref={ref}
            value={value}
            onChange={value => {
              onChange(value);
              handleCustomChange && handleCustomChange(value);
            }}
            disabled={isLoading || isDisabled}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            // error={errors[name]}
          >
            {isLoading && (
              <MenuItem value={""} disabled className="center">
                Loading...
              </MenuItem>
            )}
            {!isLoading && placeholder && (
              <MenuItem value={""} className="menu-item">
                {placeholder}
              </MenuItem>
            )}
            {!isLoading &&
              selectOption.map((option, i) => {
                return (
                  <MenuItem
                    key={`option-${i}`}
                    className="menu-item"
                    value={typeof option === "string" ? option : option?.value}
                  >
                    {typeof option === "string" ? option : option?.label}
                  </MenuItem>
                );
              })}

            {(fetchErr || selectOption.length === 0) && (
              <MenuItem value={null} disabled className="center">
                No Options
              </MenuItem>
            )}
          </Select>
        )}
      />
      {errMsg && errors[name] && (
        <InputErrorMsg errMsg={errors[name].message} />
      )}
    </FormControl>
  );
}
