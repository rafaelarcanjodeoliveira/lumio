import { forwardRef, type SelectHTMLAttributes } from "react";
import { inputClass } from "@/components/ui/form-field";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={className ? `${inputClass} ${className}` : inputClass}
        {...props}
      />
    );
  },
);
