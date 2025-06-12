import React, { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import { cva, type VariantProps } from 'class-variance-authority';
import 'react-datepicker/dist/react-datepicker.css';

// Registrando o locale pt-BR
import { registerLocale } from 'react-datepicker';
registerLocale('pt-BR', ptBR);

// Definindo as variantes do datepicker usando class-variance-authority
const datePickerVariants = cva(
  // Base styles
  "w-full",
  {
    variants: {
      appearance: {
        default: "text-gray-900 dark:text-gray-100",
        primary: "text-blue-600 dark:text-blue-400",
        secondary: "text-gray-600 dark:text-gray-400",
        success: "text-green-600 dark:text-green-400",
        danger: "text-red-600 dark:text-red-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        info: "text-blue-600 dark:text-blue-400",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      appearance: "default",
      size: "md",
    },
  }
);

// Definindo as variantes do input do datepicker
const datePickerInputVariants = cva(
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

// Tipo para as variantes do datepicker
type DatePickerVariantProps = VariantProps<typeof datePickerVariants>;
type DatePickerInputVariantProps = VariantProps<typeof datePickerInputVariants>;

// Definindo as props do datepicker
export interface CustomDatePickerProps {
  className?: string;
  appearance?: DatePickerVariantProps['appearance'];
  size?: DatePickerVariantProps['size'];
  inputVariant?: DatePickerInputVariantProps['variant'];
  fullWidth?: DatePickerInputVariantProps['fullWidth'];
  rounded?: DatePickerInputVariantProps['rounded'];
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
  locale?: string;
  isClearable?: boolean;
  isRangeSelection?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onRangeChange?: (dates: [Date | null, Date | null]) => void;
  id?: string;
  required?: boolean;
  placeholderText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Componente CustomDatePicker
const CustomDatePicker = forwardRef<HTMLInputElement, CustomDatePickerProps>(
  (
    {
      className,
      appearance,
      size,
      inputVariant = 'default',
      fullWidth = true,
      rounded = 'md',
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      selected,
      onChange,
      dateFormat = 'dd/MM/yyyy',
      showTimeSelect = false,
      showTimeSelectOnly = false,
      timeIntervals = 15,
      timeCaption = 'Hora',
      locale = 'pt-BR',
      isClearable = false,
      isRangeSelection = false,
      startDate,
      endDate,
      onRangeChange,
      id,
      required,
      placeholderText,
      disabled,
      minDate,
      maxDate,
    },
    ref
  ) => {
    const inputId = id || `datepicker-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = inputVariant === 'error' || !!errorMessage;

    // Manipulador de alteração de intervalo de datas
    const handleRangeChange = (dates: [Date | null, Date | null]) => {
      if (onRangeChange) {
        onRangeChange(dates);
      }
    };

    // Componente personalizado para o input
    const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      ({ value, onClick, onChange: onInputChange, ...inputProps }, inputRef) => (
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={inputRef}
            className={datePickerInputVariants({
              variant: hasError ? 'error' : inputVariant,
              size,
              fullWidth,
              rounded,
              className: `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className || ''}`,
            })}
            value={value as string}
            onClick={onClick}
            onChange={onInputChange}
            readOnly
            {...inputProps}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
      )
    );

    CustomInput.displayName = 'CustomInput';

    return (
      <div
        className={datePickerVariants({
          appearance,
          size,
          className: "space-y-1.5",
        })}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        
        {isRangeSelection ? (
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleRangeChange as any}
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeIntervals={timeIntervals}
            timeCaption={timeCaption}
            locale={locale}
            isClearable={isClearable}
            customInput={<CustomInput id={inputId} aria-invalid={hasError} />}
            wrapperClassName="w-full"
            calendarClassName="bg-white dark:bg-gray-800 dark:text-gray-100 border dark:border-gray-700 shadow-lg"
            placeholderText={placeholderText}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
          />
        ) : (
          <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeIntervals={timeIntervals}
            timeCaption={timeCaption}
            locale={locale}
            isClearable={isClearable}
            customInput={<CustomInput id={inputId} aria-invalid={hasError} />}
            wrapperClassName="w-full"
            calendarClassName="bg-white dark:bg-gray-800 dark:text-gray-100 border dark:border-gray-700 shadow-lg"
            placeholderText={placeholderText}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}

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

CustomDatePicker.displayName = 'CustomDatePicker';

export { CustomDatePicker as DatePicker, datePickerVariants, datePickerInputVariants };