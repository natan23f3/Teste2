import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do select usando class-variance-authority
const selectVariants = cva(
  // Base styles
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-blue-400",
        error: "border-red-500 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-400 text-red-600 dark:text-red-400",
        success: "border-green-500 focus-visible:ring-green-500 dark:border-green-500 dark:focus-visible:ring-green-400",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: true,
      rounded: "md",
    },
  }
);

// Tipo para as variantes do select
type SelectVariantProps = VariantProps<typeof selectVariants>;

// Definindo as props do select
export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    SelectVariantProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  groups?: Array<{
    label: string;
    options: Array<{
      value: string;
      label: string;
      disabled?: boolean;
    }>;
  }>;
  placeholder?: string;
}

// Componente Select
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      label,
      helperText,
      errorMessage,
      options,
      groups,
      placeholder,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = variant === 'error' || !!errorMessage;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={selectVariants({
              variant: hasError ? 'error' : variant,
              size,
              fullWidth,
              rounded,
              className,
            })}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              helperText || errorMessage
                ? `${selectId}-description`
                : undefined
            }
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {groups
              ? groups.map((group, groupIndex) => (
                  <optgroup key={groupIndex} label={group.label}>
                    {group.options.map((option, optionIndex) => (
                      <option
                        key={`${groupIndex}-${optionIndex}`}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))
              : options.map((option, index) => (
                  <option
                    key={index}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
        </div>
        {(helperText || errorMessage) && (
          <p
            id={`${selectId}-description`}
            className={`text-xs ${
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, selectVariants };