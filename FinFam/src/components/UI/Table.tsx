import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes da tabela usando class-variance-authority
const tableVariants = cva(
  // Base styles
  "w-full text-sm",
  {
    variants: {
      variant: {
        default: "text-gray-900 dark:text-gray-100",
        primary: "text-blue-900 dark:text-blue-100",
        secondary: "text-gray-900 dark:text-gray-100",
        success: "text-green-900 dark:text-green-100",
        danger: "text-red-900 dark:text-red-100",
        warning: "text-yellow-900 dark:text-yellow-100",
        info: "text-blue-900 dark:text-blue-100",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      bordered: {
        true: "border-collapse border border-gray-200 dark:border-gray-700",
        false: "border-collapse",
      },
      striped: {
        true: "",
        false: "",
      },
      hoverable: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      bordered: true,
      striped: false,
      hoverable: false,
    },
  }
);

// Tipo para as variantes da tabela
type TableVariantProps = VariantProps<typeof tableVariants>;

// Definindo as props da tabela
export interface TableProps
  extends HTMLAttributes<HTMLTableElement>,
    TableVariantProps {
  data?: Array<Record<string, any>>;
  columns?: Array<{
    header: string;
    accessor: string;
    cell?: (value: any, row: Record<string, any>) => React.ReactNode;
    className?: string;
  }>;
  caption?: string;
  stickyHeader?: boolean;
  responsive?: boolean;
  emptyMessage?: string;
}

// Componente Table
const Table = ({
  className,
  variant,
  size,
  bordered,
  striped,
  hoverable,
  data,
  columns,
  caption,
  stickyHeader = false,
  responsive = true,
  emptyMessage = "Nenhum dado disponível",
  children,
  ...props
}: TableProps) => {
  // Renderizar a tabela com base nos dados e colunas fornecidos
  const renderTable = () => {
    if (data && columns) {
      return (
        <table
          className={tableVariants({
            variant,
            size,
            bordered,
            striped,
            hoverable,
            className,
          })}
          {...props}
        >
          {caption && <caption className="p-2 text-left">{caption}</caption>}
          <thead className={`bg-gray-50 dark:bg-gray-800 ${stickyHeader ? 'sticky top-0' : ''}`}>
            <tr>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                    ${hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                    border-b border-gray-200 dark:border-gray-700
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.cell
                        ? column.cell(row[column.accessor], row)
                        : row[column.accessor]}
                    </TableCell>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </TableCell>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    // Se não houver dados ou colunas, renderizar a tabela com children
    return (
      <table
        className={tableVariants({
          variant,
          size,
          bordered,
          striped,
          hoverable,
          className,
        })}
        {...props}
      >
        {caption && <caption className="p-2 text-left">{caption}</caption>}
        {children}
      </table>
    );
  };

  // Envolver a tabela em um contêiner responsivo, se necessário
  return responsive ? (
    <div className="w-full overflow-x-auto rounded-lg">
      {renderTable()}
    </div>
  ) : (
    renderTable()
  );
};

// Componente TableHead
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <th
    className={`border-b border-gray-200 px-4 py-3 text-left font-medium dark:border-gray-700 ${className || ''}`}
    {...props}
  />
);

// Componente TableCell
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    className={`px-4 py-3 ${className || ''}`}
    {...props}
  />
);

// Componente TableHeader
const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={`bg-gray-50 dark:bg-gray-800 ${className || ''}`}
    {...props}
  />
);

// Componente TableBody
const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    className={className}
    {...props}
  />
);

// Componente TableFooter
const TableFooter = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot
    className={`bg-gray-50 dark:bg-gray-800 ${className || ''}`}
    {...props}
  />
);

// Componente TableRow
const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={`border-b border-gray-200 dark:border-gray-700 ${className || ''}`}
    {...props}
  />
);

// Componente TableCaption
const TableCaption = ({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={`p-2 text-left text-sm text-gray-500 dark:text-gray-400 ${className || ''}`}
    {...props}
  />
);

export {
  Table,
  TableHead,
  TableCell,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCaption,
  tableVariants,
};