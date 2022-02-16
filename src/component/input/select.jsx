import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormLabel } from "@mui/material";
import InputErrorMsg from "./InputErrorMsg";

export default function SelectField({
  name,
  errMsg,
  className,
  required = true,
  selectOption,
  label,
  isDisabled,
  handleCustomChange,
  ...otherProps
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      sx={{ m: "10px 0" }}
      className={`form-group select-group ${className}`}
    >
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? errMsg : false }}
        render={({ field: { onChange, value = "", ref } }) => (
          <Select
            className="select-mui"
            ref={ref}
            value={value}
            onChange={(value) => {
              console.log(value.target.value);
              onChange(value);
              handleCustomChange && handleCustomChange(value.target.value);
            }}
            {...register(name, {
              required: required ? "This Field is required" : false,
            })}
            {...otherProps}
            displayEmpty
          >
            {selectOption.map((item, i) => {
              return (
                <MenuItem
                  key={`${item.value + i}`}
                  className="menu-item"
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        )}
      />
      {errMsg && errors[name] && (
        <InputErrorMsg errMsg={errors[name].message} />
      )}
    </FormControl>
  );
}
