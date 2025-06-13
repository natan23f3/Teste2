import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do toast usando class-variance-authority
const toastVariants = cva(
  // Base styles
  "fixed flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform",
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-l-4 border-green-500",
        error: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border-l-4 border-red-500",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-l-4 border-blue-500",
      },
      position: {
        'top-right': "top-4 right-4",
        'top-left': "top-4 left-4",
        'bottom-right': "bottom-4 right-4",
        'bottom-left': "bottom-4 left-4",
        'top-center': "top-4 left-1/2 -translate-x-1/2",
        'bottom-center': "bottom-4 left-1/2 -translate-x-1/2",
      },
      visible: {
        true: "opacity-100 translate-y-0",
        false: "opacity-0 translate-y-8",
      },
    },
    defaultVariants: {
      variant: "info",
      position: "top-right",
      visible: false,
    },
  }
);

// Tipo para as variantes do toast
type ToastVariantProps = VariantProps<typeof toastVariants>;

// Definindo as props do toast
export interface ToastProps extends ToastVariantProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  showIcon?: boolean;
}

// Componente Toast
const Toast: React.FC<ToastProps> = ({
  message,
  variant = "info",
  position = "top-right",
  duration = 5000,
  onClose,
  showIcon = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Montar o componente
    setMounted(true);
    
    // Mostrar o toast após um pequeno delay para permitir a animação
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 10);
    
    // Esconder o toast após a duração especificada
    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, duration);
    
    // Remover o toast do DOM após a animação de saída
    const unmountTimeout = setTimeout(() => {
      setMounted(false);
      if (onClose) onClose();
    }, duration + 300); // 300ms é a duração da animação
    
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(unmountTimeout);
    };
  }, [duration, onClose]);

  // Não renderizar nada se o componente não estiver montado
  if (!mounted) return null;

  // Ícones para cada variante
  const icons = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  // Renderizar o toast no portal
  return createPortal(
    <div
      className={toastVariants({ variant, position, visible })}
      role="alert"
      aria-live="assertive"
    >
      {showIcon && variant && icons[variant]}
      <div className="flex-1">{message}</div>
      <button
        type="button"
        className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        onClick={() => {
          setVisible(false);
          setTimeout(() => {
            setMounted(false);
            if (onClose) onClose();
          }, 300);
        }}
        aria-label="Fechar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>,
    document.body
  );
};

// Gerenciador de toasts
export class ToastManager {
  private static instance: ToastManager;
  private toasts: Array<{ id: string; element: React.ReactElement }> = [];
  private listeners: Array<(toasts: Array<{ id: string; element: React.ReactElement }>) => void> = [];

  private constructor() {}

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public show(
    message: string,
    options: Omit<ToastProps, 'message' | 'onClose'> = {}
  ): string {
    const id = Math.random().toString(36).substring(2, 9);
    
    const handleClose = () => {
      this.remove(id);
    };
    
    const toast = (
      <Toast
        key={id}
        message={message}
        {...options}
        onClose={handleClose}
      />
    );
    
    this.toasts = [...this.toasts, { id, element: toast }];
    this.notifyListeners();
    
    return id;
  }

  public success(message: string, options: Omit<ToastProps, 'message' | 'variant' | 'onClose'> = {}): string {
    return this.show(message, { ...options, variant: 'success' });
  }

  public error(message: string, options: Omit<ToastProps, 'message' | 'variant' | 'onClose'> = {}): string {
    return this.show(message, { ...options, variant: 'error' });
  }

  public warning(message: string, options: Omit<ToastProps, 'message' | 'variant' | 'onClose'> = {}): string {
    return this.show(message, { ...options, variant: 'warning' });
  }

  public info(message: string, options: Omit<ToastProps, 'message' | 'variant' | 'onClose'> = {}): string {
    return this.show(message, { ...options, variant: 'info' });
  }

  public remove(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  public clear(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  public subscribe(listener: (toasts: Array<{ id: string; element: React.ReactElement }>) => void): () => void {
    this.listeners.push(listener);
    
    // Retorna uma função para cancelar a inscrição
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.toasts));
  }
}

// Hook para usar o ToastManager
export const useToast = () => {
  return ToastManager.getInstance();
};

// Componente para renderizar todos os toasts
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; element: React.ReactElement }>>([]);
  
  useEffect(() => {
    const unsubscribe = ToastManager.getInstance().subscribe(setToasts);
    return unsubscribe;
  }, []);
  
  if (toasts.length === 0) return null;
  
  return createPortal(
    <>{toasts.map(toast => toast.element)}</>,
    document.body
  );
};

export { Toast, toastVariants };