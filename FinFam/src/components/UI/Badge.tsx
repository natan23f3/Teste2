import React, { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do badge usando class-variance-authority
const badgeVariants = cva(
  // Base styles
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        primary: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        outline: "bg-transparent text-gray-800 border border-gray-300 dark:text-gray-300 dark:border-gray-600",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
      rounded: {
        full: "rounded-full",
        md: "rounded-md",
        sm: "rounded-sm",
      },
      bordered: {
        true: "border",
        false: "",
      },
    },
    compoundVariants: [
      {
        bordered: true,
        variant: "default",
        className: "border-gray-200 dark:border-gray-600",
      },
      {
        bordered: true,
        variant: "primary",
        className: "border-blue-200 dark:border-blue-800",
      },
      {
        bordered: true,
        variant: "secondary",
        className: "border-gray-200 dark:border-gray-600",
      },
      {
        bordered: true,
        variant: "success",
        className: "border-green-200 dark:border-green-800",
      },
      {
        bordered: true,
        variant: "danger",
        className: "border-red-200 dark:border-red-800",
      },
      {
        bordered: true,
        variant: "warning",
        className: "border-yellow-200 dark:border-yellow-800",
      },
      {
        bordered: true,
        variant: "info",
        className: "border-blue-200 dark:border-blue-800",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "full",
      bordered: false,
    },
  }
);

// Tipo para as variantes do badge
type BadgeVariantProps = VariantProps<typeof badgeVariants>;

// Definindo as props do badge
export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    BadgeVariantProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
}

// Componente Badge
const Badge = ({
  className,
  variant,
  size,
  rounded,
  bordered,
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={badgeVariants({
        variant,
        size,
        rounded,
        bordered,
        className,
      })}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1 -ml-0.5">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-1 -mr-0.5">{icon}</span>
      )}
      {removable && (
        <button
          type="button"
          className={`ml-1 -mr-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-opacity-25 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'
          }`}
          onClick={onRemove}
          aria-label="Remover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-full w-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export { Badge, badgeVariants };