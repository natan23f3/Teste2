import React, { Fragment, ReactNode, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do modal usando class-variance-authority
const modalVariants = cva(
  // Base styles
  "relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all",
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        '2xl': "max-w-2xl",
        '3xl': "max-w-3xl",
        '4xl': "max-w-4xl",
        '5xl': "max-w-5xl",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// Tipo para as variantes do modal
type ModalVariantProps = VariantProps<typeof modalVariants>;

// Definindo as props do modal
export interface ModalProps extends ModalVariantProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

// Componente Modal
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size,
  initialFocus,
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  footer,
}: ModalProps) => {
  // Impedir o scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnClickOutside ? onClose : () => {}}
        initialFocus={initialFocus}
      >
        {/* Overlay de fundo */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Conteúdo do modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={modalVariants({ size })}>
                {/* Botão de fechar */}
                {showCloseButton && (
                  <button
                    type="button"
                    className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    onClick={onClose}
                    aria-label="Fechar"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {/* Título e descrição */}
                {(title || description) && (
                  <div className={`${showCloseButton ? 'pr-8' : ''} mb-4`}>
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}

                {/* Conteúdo principal */}
                <div className="mt-2">{children}</div>

                {/* Rodapé */}
                {footer && (
                  <div className="mt-6 flex justify-end space-x-3">{footer}</div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { Modal, modalVariants };