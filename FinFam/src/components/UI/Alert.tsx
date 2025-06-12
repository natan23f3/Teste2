import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do alert usando class-variance-authority
const alertVariants = cva(
  // Base styles
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",
        primary: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800",
        secondary: "bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",
        success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800",
        danger: "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:border-yellow-800",
        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800",
      },
      size: {
        sm: "text-xs p-2",
        md: "text-sm p-4",
        lg: "text-base p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Tipo para as variantes do alert
type AlertVariantProps = VariantProps<typeof alertVariants>;

// Definindo as props do alert
export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    AlertVariantProps {
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
}

// Ícones para os diferentes tipos de alertas
const AlertIcons = {
  default: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  ),
  primary: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  ),
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  danger: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  ),
};

// Componente Alert
const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      size,
      title,
      icon,
      onClose,
      dismissible = false,
      children,
      ...props
    },
    ref
  ) => {
    // Determinar o ícone a ser exibido
    const alertIcon = icon || (variant && AlertIcons[variant as keyof typeof AlertIcons]) || AlertIcons.default;

    return (
      <div
        ref={ref}
        role="alert"
        className={alertVariants({ variant, size, className })}
        {...props}
      >
        {/* Botão de fechar */}
        {dismissible && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md p-1 text-current hover:bg-opacity-10 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Fechar alerta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="flex">
          {/* Ícone */}
          {alertIcon && <div className="mr-3 mt-0.5 flex-shrink-0">{alertIcon}</div>}

          <div className={`${dismissible ? 'pr-7' : ''}`}>
            {/* Título */}
            {title && (
              <h5 className="mb-1 font-medium leading-5">{title}</h5>
            )}

            {/* Conteúdo */}
            <div className={`${title ? 'mt-1' : ''} text-sm opacity-90`}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert, alertVariants };