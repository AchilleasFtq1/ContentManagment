import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils"; // Assuming cn is a function for conditional class names

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  regex?: RegExp;
  value: string; // Value managed by the parent component
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Managed by the parent component
};

export interface CustomInputRef {
  validate: () => boolean;
}

export const Input = forwardRef<CustomInputRef, InputProps>(
  (
    {
      label,
      className,
      id,
      type = "text",
      required = false,
      minLength = 1,
      maxLength = 50,
      regex = /^[a-zA-Z0-9]+$/,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [error, setError] = useState("");

    const validate = useCallback(() => {
      if (required && value.trim() === "") {
        setError(`${label ? label + " is" : "Field is"} required`);
        return false;
      }
      if (minLength !== undefined && value.length < minLength) {
        setError(`Minimum length of ${minLength} is required`);
        return false;
      }
      if (maxLength !== undefined && value.length > maxLength) {
        setError(`Maximum length of ${maxLength} exceeded`);
        return false;
      }
      if (regex && !regex.test(value)) {
        setError(
          `${label ? label + " does" : "Field does"} not match the required format`,
        );
        return false;
      }
      setError("");
      return true;
    }, [value, required, minLength, maxLength, regex, label]);

    useImperativeHandle(
      ref,
      () => ({
        validate,
      }),
      [validate],
    );

    const inputClassName = cn(
      "flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none",
      error ? "border-red-500 text-red-900" : "border-gray-300",
      className,
    );

    return (
      <>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input
          id={id}
          type={type}
          className={inputClassName}
          value={value}
          onChange={onChange}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </>
    );
  },
);

Input.displayName = "Input";
