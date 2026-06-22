import { forwardRef, type TextareaHTMLAttributes } from "react";
import { inputClass } from "@/components/ui/form-field";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={className ? `${inputClass} ${className}` : inputClass}
        {...props}
      />
    );
  },
);
