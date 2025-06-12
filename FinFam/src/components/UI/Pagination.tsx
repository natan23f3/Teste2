import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes da paginação usando class-variance-authority
const paginationVariants = cva(
  // Base styles
  "flex items-center",
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
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Definindo as variantes do botão de paginação
const paginationButtonVariants = cva(
  // Base styles
  "flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-500",
        primary: "hover:bg-blue-100 dark:hover:bg-blue-900/20 focus-visible:ring-blue-500",
        secondary: "hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-500",
        success: "hover:bg-green-100 dark:hover:bg-green-900/20 focus-visible:ring-green-500",
        danger: "hover:bg-red-100 dark:hover:bg-red-900/20 focus-visible:ring-red-500",
        warning: "hover:bg-yellow-100 dark:hover:bg-yellow-900/20 focus-visible:ring-yellow-500",
        info: "hover:bg-blue-100 dark:hover:bg-blue-900/20 focus-visible:ring-blue-500",
      },
      size: {
        sm: "h-7 w-7 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        variant: "default",
        className: "bg-gray-200 dark:bg-gray-700",
      },
      {
        active: true,
        variant: "primary",
        className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      },
      {
        active: true,
        variant: "secondary",
        className: "bg-gray-200 dark:bg-gray-700",
      },
      {
        active: true,
        variant: "success",
        className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      },
      {
        active: true,
        variant: "danger",
        className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      },
      {
        active: true,
        variant: "warning",
        className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      },
      {
        active: true,
        variant: "info",
        className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      active: false,
    },
  }
);

// Tipo para as variantes da paginação
type PaginationVariantProps = VariantProps<typeof paginationVariants>;
type PaginationButtonVariantProps = VariantProps<typeof paginationButtonVariants>;

// Definindo as props da paginação
export interface PaginationProps extends PaginationVariantProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  disabled?: boolean;
}

// Função para gerar o intervalo de páginas
const generatePaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
) => {
  // Calcular o número total de itens a serem exibidos
  const totalPageNumbers = siblingCount * 2 + 3; // siblings + currentPage + first + last

  // Caso 1: Se o número de páginas for menor ou igual ao número total de itens
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Calcular os índices dos irmãos à esquerda e à direita
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  // Determinar se devemos mostrar os pontos de elipse
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  // Caso 2: Mostrar os pontos de elipse à direita
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  // Caso 3: Mostrar os pontos de elipse à esquerda
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, "...", ...rightRange];
  }

  // Caso 4: Mostrar os pontos de elipse em ambos os lados
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, "...", ...middleRange, "...", totalPages];
};

// Componente Pagination
const Pagination = ({
  className,
  variant,
  size,
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
}: PaginationProps) => {
  // Gerar o intervalo de páginas
  const paginationRange = generatePaginationRange(
    currentPage,
    totalPages,
    siblingCount
  );

  // Se houver apenas uma página, não renderizar a paginação
  if (totalPages <= 1) {
    return null;
  }

  // Manipuladores de eventos
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  // Renderizar o botão de paginação
  const renderPaginationButton = (
    content: React.ReactNode,
    page: number | null,
    active: boolean = false,
    ariaLabel: string
  ) => {
    return (
      <button
        className={paginationButtonVariants({
          variant,
          size,
          active,
        })}
        onClick={() => page !== null && onPageChange(page)}
        disabled={disabled || page === null}
        aria-label={ariaLabel}
        aria-current={active ? "page" : undefined}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      className={paginationVariants({ variant, size, className })}
      aria-label="Paginação"
    >
      <ul className="flex items-center space-x-1">
        {/* Botão Primeira Página */}
        {showFirstLast && (
          <li>
            {renderPaginationButton(
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
                  d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                />
              </svg>,
              currentPage === 1 ? null : 1,
              false,
              "Ir para a primeira página"
            )}
          </li>
        )}

        {/* Botão Página Anterior */}
        {showPrevNext && (
          <li>
            {renderPaginationButton(
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>,
              currentPage === 1 ? null : currentPage - 1,
              false,
              "Ir para a página anterior"
            )}
          </li>
        )}

        {/* Botões de Páginas */}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <li key={`ellipsis-${index}`} className="px-2">
                <span className="text-gray-500 dark:text-gray-400">...</span>
              </li>
            );
          }

          return (
            <li key={`page-${pageNumber}`}>
              {renderPaginationButton(
                pageNumber,
                pageNumber as number,
                currentPage === pageNumber,
                `Ir para a página ${pageNumber}`
              )}
            </li>
          );
        })}

        {/* Botão Próxima Página */}
        {showPrevNext && (
          <li>
            {renderPaginationButton(
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>,
              currentPage === totalPages ? null : currentPage + 1,
              false,
              "Ir para a próxima página"
            )}
          </li>
        )}

        {/* Botão Última Página */}
        {showFirstLast && (
          <li>
            {renderPaginationButton(
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
                  d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5"
                />
              </svg>,
              currentPage === totalPages ? null : totalPages,
              false,
              "Ir para a última página"
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export { Pagination, paginationVariants, paginationButtonVariants };