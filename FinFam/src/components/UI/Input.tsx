import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do input usando class-variance-authority
const inputVariants = cva(
  // Base styles
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-blue-400",
        error: "border-red-500 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-400 text-red-600 dark:text-red-400 placeholder:text-red-400",
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

// Tipo para as variantes do input
type InputVariantProps = VariantProps<typeof inputVariants>;

// Definindo as props do input
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariantProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

// Componente Input
const Input = forwardRef<HTMLInputElement, InputProps>(
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
      leftIcon,
      rightIcon,
      isPassword = false,
      type = 'text',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = variant === 'error' || !!errorMessage;
    
    // Determinar o tipo de input com base na prop isPassword e no estado showPassword
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={inputType}
            className={inputVariants({
              variant: hasError ? 'error' : variant,
              size,
              fullWidth,
              rounded,
              className: `${leftIcon ? 'pl-10' : ''} ${rightIcon || isPassword ? 'pr-10' : ''} ${className || ''}`,
            })}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              helperText || errorMessage
                ? `${inputId}-description`
                : undefined
            }
            required={required}
            {...props}
          />
          {(rightIcon || isPassword) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {(helperText || errorMessage) && (
          <p
            id={`${inputId}-description`}
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

Input.displayName = 'Input';

export { Input, inputVariants };