import React, { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do card usando class-variance-authority
const cardVariants = cva(
  // Base styles
  "rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700",
  {
    variants: {
      variant: {
        default: "border-gray-200 dark:border-gray-700",
        primary: "border-blue-200 dark:border-blue-800",
        secondary: "border-gray-200 dark:border-gray-700",
        success: "border-green-200 dark:border-green-800",
        danger: "border-red-200 dark:border-red-800",
        warning: "border-yellow-200 dark:border-yellow-800",
        info: "border-blue-200 dark:border-blue-800",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-md",
        xl: "shadow-lg",
      },
      hover: {
        true: "transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-700/30",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      rounded: "lg",
      shadow: "sm",
      hover: false,
    },
  }
);

// Definindo as variantes do card header
const cardHeaderVariants = cva(
  // Base styles
  "border-b px-4 py-3 flex items-center justify-between",
  {
    variants: {
      variant: {
        default: "border-gray-200 dark:border-gray-700",
        primary: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
        secondary: "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50",
        success: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
        danger: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20",
        warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
        info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Definindo as variantes do card footer
const cardFooterVariants = cva(
  // Base styles
  "border-t px-4 py-3",
  {
    variants: {
      variant: {
        default: "border-gray-200 dark:border-gray-700",
        primary: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
        secondary: "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50",
        success: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
        danger: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20",
        warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
        info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Tipo para as variantes do card
type CardVariantProps = VariantProps<typeof cardVariants>;
type CardHeaderVariantProps = VariantProps<typeof cardHeaderVariants>;
type CardFooterVariantProps = VariantProps<typeof cardFooterVariants>;

// Definindo as props do card
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    CardVariantProps {
  as?: React.ElementType;
}

// Definindo as props do card header
export interface CardHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    CardHeaderVariantProps {
  as?: React.ElementType;
}

// Definindo as props do card footer
export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement>,
    CardFooterVariantProps {
  as?: React.ElementType;
}

// Componente Card
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      rounded,
      shadow,
      hover,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        className={cardVariants({
          variant,
          padding,
          rounded,
          shadow,
          hover,
          className,
        })}
        ref={ref}
        {...props}
      />
    );
  }
);

// Componente CardHeader
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { className, variant, as: Component = 'div', ...props },
    ref
  ) => {
    return (
      <Component
        className={cardHeaderVariants({
          variant,
          className,
        })}
        ref={ref}
        {...props}
      />
    );
  }
);

// Componente CardFooter
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    { className, variant, as: Component = 'div', ...props },
    ref
  ) => {
    return (
      <Component
        className={cardFooterVariants({
          variant,
          className,
        })}
        ref={ref}
        {...props}
      />
    );
  }
);

// Componente CardTitle
const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className || ''}`}
    {...props}
  />
));

// Componente CardDescription
const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 dark:text-gray-400 ${className || ''}`}
    {...props}
  />
));

// Componente CardContent
const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-4 ${className || ''}`}
    {...props}
  />
));

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  cardHeaderVariants,
  cardFooterVariants,
};