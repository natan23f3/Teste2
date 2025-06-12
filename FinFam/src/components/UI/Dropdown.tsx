import React, { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do dropdown usando class-variance-authority
const dropdownVariants = cva(
  // Base styles
  "relative inline-block text-left",
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

// Definindo as variantes do botão do dropdown
const dropdownButtonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus-visible:ring-gray-500",
        primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus-visible:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus-visible:ring-gray-500",
        success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus-visible:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus-visible:ring-red-500",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 focus-visible:ring-yellow-500",
        info: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 focus-visible:ring-blue-500",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus-visible:ring-gray-500",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

// Definindo as variantes do menu do dropdown
const dropdownMenuVariants = cva(
  // Base styles
  "absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700",
  {
    variants: {
      align: {
        start: "left-0 origin-top-left",
        center: "left-1/2 -translate-x-1/2 origin-top",
        end: "right-0 origin-top-right",
      },
      width: {
        auto: "",
        sm: "w-48",
        md: "w-56",
        lg: "w-64",
        full: "w-full",
      },
    },
    defaultVariants: {
      align: "start",
      width: "md",
    },
  }
);

// Definindo as variantes do item do dropdown
const dropdownItemVariants = cva(
  // Base styles
  "flex w-full items-center px-4 py-2 text-sm text-left transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "text-gray-700 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700",
        destructive: "text-red-600 hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:focus:bg-red-900/20",
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

// Tipo para as variantes do dropdown
type DropdownVariantProps = VariantProps<typeof dropdownVariants>;
type DropdownButtonVariantProps = VariantProps<typeof dropdownButtonVariants>;
type DropdownMenuVariantProps = VariantProps<typeof dropdownMenuVariants>;
type DropdownItemVariantProps = VariantProps<typeof dropdownItemVariants>;

// Definindo as props do dropdown
export interface DropdownProps extends DropdownVariantProps {
  className?: string;
  children: ReactNode;
}

// Definindo as props do botão do dropdown
export interface DropdownButtonProps extends DropdownButtonVariantProps {
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  showChevron?: boolean;
}

// Definindo as props do menu do dropdown
export interface DropdownMenuProps extends DropdownMenuVariantProps {
  className?: string;
  children: ReactNode;
  static?: boolean;
}

// Definindo as props do item do dropdown
export interface DropdownItemProps extends DropdownItemVariantProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

// Componente Dropdown
const Dropdown = ({ className, fullWidth, children }: DropdownProps) => {
  return (
    <Menu
      as="div"
      className={dropdownVariants({
        fullWidth,
        className,
      })}
    >
      {children}
    </Menu>
  );
};

// Componente DropdownButton
const DropdownButton = ({
  className,
  variant,
  size,
  fullWidth,
  children,
  icon,
  iconPosition = 'left',
  showChevron = true,
}: DropdownButtonProps) => {
  return (
    <Menu.Button
      className={dropdownButtonVariants({
        variant,
        size,
        fullWidth,
        className,
      })}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      {showChevron && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`h-4 w-4 ${
            iconPosition === 'right' && icon ? 'ml-1' : 'ml-2'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      )}
    </Menu.Button>
  );
};

// Componente DropdownMenu
const DropdownMenu = ({
  className,
  align,
  width,
  children,
  static: isStatic = false,
}: DropdownMenuProps) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      static={isStatic}
    >
      <Menu.Items
        className={dropdownMenuVariants({
          align,
          width,
          className,
        })}
      >
        <div className="py-1">{children}</div>
      </Menu.Items>
    </Transition>
  );
};

// Componente DropdownItem
const DropdownItem = ({
  className,
  variant,
  disabled = false,
  children,
  onClick,
  icon,
}: DropdownItemProps) => {
  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          className={dropdownItemVariants({
            variant,
            disabled,
            className: `${active ? 'bg-gray-100 dark:bg-gray-700' : ''} ${
              className || ''
            }`,
          })}
          onClick={onClick}
          disabled={disabled}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

// Componente DropdownSeparator
const DropdownSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      className={`my-1 h-px bg-gray-200 dark:bg-gray-700 ${className || ''}`}
    />
  );
};

// Componente DropdownLabel
const DropdownLabel = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={`px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 ${
        className || ''
      }`}
    >
      {children}
    </div>
  );
};

export {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  dropdownVariants,
  dropdownButtonVariants,
  dropdownMenuVariants,
  dropdownItemVariants,
};