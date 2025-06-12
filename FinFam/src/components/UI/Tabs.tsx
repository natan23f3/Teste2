import React, { useState, createContext, useContext, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes das tabs usando class-variance-authority
const tabsVariants = cva(
  // Base styles
  "w-full",
  {
    variants: {
      variant: {
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
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

// Definindo as variantes dos botões de tab
const tabButtonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "hover:text-gray-700 dark:hover:text-gray-300 focus-visible:ring-gray-500",
        primary: "hover:text-blue-700 dark:hover:text-blue-300 focus-visible:ring-blue-500",
        secondary: "hover:text-gray-700 dark:hover:text-gray-300 focus-visible:ring-gray-500",
        success: "hover:text-green-700 dark:hover:text-green-300 focus-visible:ring-green-500",
        danger: "hover:text-red-700 dark:hover:text-red-300 focus-visible:ring-red-500",
        warning: "hover:text-yellow-700 dark:hover:text-yellow-300 focus-visible:ring-yellow-500",
        info: "hover:text-blue-700 dark:hover:text-blue-300 focus-visible:ring-blue-500",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      active: {
        true: "",
        false: "",
      },
      fullWidth: {
        true: "flex-1",
        false: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        variant: "default",
        className: "text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100",
      },
      {
        active: true,
        variant: "primary",
        className: "text-blue-700 dark:text-blue-300 border-b-2 border-blue-700 dark:border-blue-300",
      },
      {
        active: true,
        variant: "secondary",
        className: "text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100",
      },
      {
        active: true,
        variant: "success",
        className: "text-green-700 dark:text-green-300 border-b-2 border-green-700 dark:border-green-300",
      },
      {
        active: true,
        variant: "danger",
        className: "text-red-700 dark:text-red-300 border-b-2 border-red-700 dark:border-red-300",
      },
      {
        active: true,
        variant: "warning",
        className: "text-yellow-700 dark:text-yellow-300 border-b-2 border-yellow-700 dark:border-yellow-300",
      },
      {
        active: true,
        variant: "info",
        className: "text-blue-700 dark:text-blue-300 border-b-2 border-blue-700 dark:border-blue-300",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      active: false,
      fullWidth: false,
    },
  }
);

// Tipo para as variantes das tabs
type TabsVariantProps = VariantProps<typeof tabsVariants>;
type TabButtonVariantProps = VariantProps<typeof tabButtonVariants>;

// Definindo o contexto das tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant?: TabsVariantProps['variant'];
  size?: TabsVariantProps['size'];
  fullWidth?: TabsVariantProps['fullWidth'];
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Hook para usar o contexto das tabs
const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext deve ser usado dentro de um TabsProvider');
  }
  return context;
};

// Definindo as props das tabs
export interface TabsProps extends TabsVariantProps {
  className?: string;
  defaultTab?: string;
  onChange?: (id: string) => void;
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

// Componente Tabs
const Tabs = ({
  className,
  variant,
  size,
  fullWidth,
  defaultTab,
  onChange,
  children,
  orientation = 'horizontal',
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || '');

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange && onChange(id);
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleTabChange,
        variant,
        size,
        fullWidth,
      }}
    >
      <div
        className={tabsVariants({
          variant,
          size,
          fullWidth,
          className: `${orientation === 'vertical' ? 'flex' : ''} ${className || ''}`,
        })}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Definindo as props da lista de tabs
export interface TabListProps {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

// Componente TabList
const TabList = ({ className, children, ariaLabel = 'Tabs' }: TabListProps) => {
  const { variant, size, fullWidth } = useTabsContext();

  return (
    <div
      className={`flex ${
        fullWidth ? 'w-full' : ''
      } border-b border-gray-200 dark:border-gray-700 ${className || ''}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

// Definindo as props do botão de tab
export interface TabButtonProps extends TabButtonVariantProps {
  className?: string;
  id: string;
  disabled?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

// Componente TabButton
const TabButton = ({
  className,
  id,
  disabled = false,
  children,
  icon,
}: TabButtonProps) => {
  const { activeTab, setActiveTab, variant, size, fullWidth } = useTabsContext();
  const isActive = activeTab === id;

  return (
    <button
      className={tabButtonVariants({
        variant,
        size,
        active: isActive,
        fullWidth,
        className,
      })}
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && setActiveTab(id)}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Definindo as props do painel de tab
export interface TabPanelProps {
  className?: string;
  id: string;
  children: ReactNode;
  keepMounted?: boolean;
}

// Componente TabPanel
const TabPanel = ({
  className,
  id,
  children,
  keepMounted = false,
}: TabPanelProps) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === id;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <div
      className={`py-4 ${isActive ? 'block' : 'hidden'} ${className || ''}`}
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

// Definindo as props dos painéis de tab
export interface TabPanelsProps {
  className?: string;
  children: ReactNode;
}

// Componente TabPanels
const TabPanels = ({ className, children }: TabPanelsProps) => {
  return <div className={className}>{children}</div>;
};

export { Tabs, TabList, TabButton, TabPanel, TabPanels, tabsVariants, tabButtonVariants };