import { cn } from "@/src/lib/redirect/utils";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ErrorMessage from "./ErrorMessage";

type InputPropsType = {
  register: any;
  selectData: any[];
  errors: any;
  name: string;
  isRequired: boolean;
  type: string | undefined;
  label: string;
  placeholder: string;
  isTextArea?: boolean;
  isSelect?: boolean;
  row: number;
  minDate: string;
  cols: number;
  disabled: boolean;
  ref?: any;
  value?: any;
  setValue?: any;
  textareaClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  labelVisible?: boolean;
  control?: any;
};

export default function Input({
  register,
  errors,
  name,
  isRequired,
  type,
  label,
  placeholder,
  isTextArea,
  row,
  cols,
  minDate,
  value,
  setValue,
  isSelect,
  selectData,
  disabled = false,
  ref,
  textareaClassName,
  control,
  inputClassName,
  labelClassName,
  labelVisible,
}: InputPropsType) {
  const validations = {};
  if (isRequired) {
    validations.required = "This field is required";
  }

  const l = label
    ? label
    : name.replace("_", " ").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });

  const p = placeholder ? placeholder : l;

  return (
    <>
      <div className="input-component-wrap">
        {labelVisible !== false && (
          <label className={`text-text-secondary text-sm font-medium  ${["input-label"]}`}>{l}</label>
        )}

        {isTextArea ? (
          <textarea
            ref={ref}
            disabled={disabled ?? false}
            className={`border border-gray-300 focus:border-primary focus:outline-none w-full p-2 ${
              errors[name] && errors[name]?.message ? "has-error" : ""
            }`}
            cols={cols}
            rows={row}
            placeholder={p}
            {...register(name, validations)}
          />
        ) : (
          // <Controller
          //   name={name}
          //   control={control}
          //   defaultValue=""
          //   render={({ field }) => (
          //     <ReactQuill
          //       {...field}
          //       modules={{
          //         toolbar: [
          //           ["bold", "italic"],
          //           [{ list: "ordered" }, { list: "bullet" }],
          //         ],
          //       }}
          //     />
          //   )}
          // />
          <input
            ref={ref}
            className={`border border-gray-300 focus:border-primary focus:outline-none w-full p-2 ${
              errors[name] && errors[name]?.message ? "has-error" : ""
            }`}
            type={type}
            min={minDate && minDate}
            placeholder={p}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled ?? false}
            {...register(name, validations, {
              valueAsDate: type === "date" && true,
            })}
          />
        )}
        {errors[name] && errors[name]?.message && (
          <ErrorMessage text={errors[name]?.message} />
        )}
      </div>
    </>
  );
}
