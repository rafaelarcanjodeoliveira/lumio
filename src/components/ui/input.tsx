import { forwardRef, type InputHTMLAttributes } from "react";
import { inputClass } from "@/components/ui/form-field";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={className ? `${inputClass} ${className}` : inputClass}
        {...props}
      />
    );
  },
);
