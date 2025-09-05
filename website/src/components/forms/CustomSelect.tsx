import React, { useState } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import ErrorMessage from "./ErrorMessage";
import "./customInput.style.css";
type SelectPropsTypes = {
  field: any;
  options: any[];
  errors: any;
  name: string;
  isRequired: boolean;
  label: string;
  placeholder: string;
  register: any;
  isMulti: boolean;
  control: any;
  setFunction: any;
  labelVisible: Boolean | any;
  onChange: (value: ChangesValue) => void;
  defaultValue?: DefaultValue;
};

type ChangesValue = {
  value?: any;
  label?: any;
};

type DefaultValue = {
  value: any;
  label: any;
};

const CustomSelect = ({
  options,
  placeholder,
  isRequired,
  errors,
  name,
  register,
  isMulti,
  control,
  label,
  setFunction,
  onChange,
  labelVisible,
  ...props
}: SelectPropsTypes) => {
  const [selectedValue, setSelectedValue] = useState<any>();

  const validations = {};
  if (isRequired) {
    validations.required = "This field is required";
  }

  const l = label
    ? label
    : name?.replace("_", " ").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });

  const p = placeholder ? placeholder : l;

  const handleChange = (value, Change) => {
    Change(value);
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="mb20">
      {labelVisible !== false && <label className="text-text-secondary">{l}</label>}

      {control ? (
        <Controller
          name={name}
          control={control}
          // defaultValue={props.defaultValue ?? null}
          render={({ field }) => (
            <Select
              {...field}
              isSearchable
              options={options}
              isClearable
              placeholder={p}
              isDisabled={false}
              onChange={(value) => handleChange(value, field.onChange)}
              isMulti={isMulti}
            />
          )}
        />
      ) : (
        <Select
          isSearchable
          options={options}
          isClearable
          placeholder={p}
          isDisabled={false}
          onChange={(selectedOption) => onChange(selectedOption)}
        />
      )}
      {errors[name] && errors[name]?.message && <ErrorMessage text={errors[name]?.message} />}
    </div>
  );
};

export default CustomSelect;
