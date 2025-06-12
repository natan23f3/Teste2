import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do loader usando class-variance-authority
const loaderVariants = cva(
  // Base styles
  "inline-block text-current",
  {
    variants: {
      variant: {
        default: "text-gray-500 dark:text-gray-400",
        primary: "text-blue-600 dark:text-blue-400",
        secondary: "text-gray-600 dark:text-gray-400",
        success: "text-green-600 dark:text-green-400",
        danger: "text-red-600 dark:text-red-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        info: "text-blue-600 dark:text-blue-400",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      type: {
        spinner: "",
        dots: "",
        pulse: "",
        ring: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      type: "spinner",
    },
  }
);

// Tipo para as variantes do loader
type LoaderVariantProps = VariantProps<typeof loaderVariants>;

// Definindo as props do loader
export interface LoaderProps extends LoaderVariantProps {
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

// Componente Loader
const Loader = ({
  variant,
  size,
  type = "spinner",
  className,
  label,
  fullScreen = false,
}: LoaderProps) => {
  // Renderizar o tipo de loader apropriado
  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <svg
            className={`animate-spin ${loaderVariants({ variant, size, className })}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden={label ? "true" : "false"}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case "dots":
        return (
          <div className={`flex space-x-1 ${loaderVariants({ variant, className })}`}>
            <div
              className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s] ${
                variant === "default"
                  ? "bg-gray-500 dark:bg-gray-400"
                  : variant === "primary"
                  ? "bg-blue-600 dark:bg-blue-400"
                  : variant === "secondary"
                  ? "bg-gray-600 dark:bg-gray-400"
                  : variant === "success"
                  ? "bg-green-600 dark:bg-green-400"
                  : variant === "danger"
                  ? "bg-red-600 dark:bg-red-400"
                  : variant === "warning"
                  ? "bg-yellow-600 dark:bg-yellow-400"
                  : "bg-blue-600 dark:bg-blue-400"
              }`}
            ></div>
            <div
              className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s] ${
                variant === "default"
                  ? "bg-gray-500 dark:bg-gray-400"
                  : variant === "primary"
                  ? "bg-blue-600 dark:bg-blue-400"
                  : variant === "secondary"
                  ? "bg-gray-600 dark:bg-gray-400"
                  : variant === "success"
                  ? "bg-green-600 dark:bg-green-400"
                  : variant === "danger"
                  ? "bg-red-600 dark:bg-red-400"
                  : variant === "warning"
                  ? "bg-yellow-600 dark:bg-yellow-400"
                  : "bg-blue-600 dark:bg-blue-400"
              }`}
            ></div>
            <div
              className={`h-2 w-2 rounded-full animate-bounce ${
                variant === "default"
                  ? "bg-gray-500 dark:bg-gray-400"
                  : variant === "primary"
                  ? "bg-blue-600 dark:bg-blue-400"
                  : variant === "secondary"
                  ? "bg-gray-600 dark:bg-gray-400"
                  : variant === "success"
                  ? "bg-green-600 dark:bg-green-400"
                  : variant === "danger"
                  ? "bg-red-600 dark:bg-red-400"
                  : variant === "warning"
                  ? "bg-yellow-600 dark:bg-yellow-400"
                  : "bg-blue-600 dark:bg-blue-400"
              }`}
            ></div>
          </div>
        );
      case "pulse":
        return (
          <div
            className={`${loaderVariants({
              variant,
              size,
              className,
            })} rounded-full animate-pulse`}
            style={{
              backgroundColor: "currentColor",
            }}
            aria-hidden={label ? "true" : "false"}
          ></div>
        );
      case "ring":
        return (
          <div className="relative">
            <div
              className={`${loaderVariants({
                variant,
                size,
                className,
              })} rounded-full border-2 border-solid border-t-transparent animate-spin`}
              style={{
                borderColor: `currentColor transparent transparent transparent`,
              }}
              aria-hidden={label ? "true" : "false"}
            ></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Se for fullScreen, renderizar em tela cheia
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex flex-col items-center space-y-2">
          {renderLoader()}
          {label && (
            <p className="text-sm font-medium text-white">{label}</p>
          )}
        </div>
      </div>
    );
  }

  // Renderização padrão
  return (
    <div className="flex items-center space-x-2">
      {renderLoader()}
      {label && (
        <span className="text-sm font-medium">{label}</span>
      )}
      {!label && <span className="sr-only">Carregando...</span>}
    </div>
  );
};

export { Loader, loaderVariants };