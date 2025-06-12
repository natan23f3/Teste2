import React, { ReactNode } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { cva, type VariantProps } from 'class-variance-authority';

// Definindo as variantes do chart usando class-variance-authority
const chartVariants = cva(
  // Base styles
  "w-full overflow-hidden",
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
        sm: "h-40",
        md: "h-60",
        lg: "h-80",
        xl: "h-96",
        auto: "h-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Tipo para as variantes do chart
type ChartVariantProps = VariantProps<typeof chartVariants>;

// Cores padrão para os gráficos
const defaultColors = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
];

// Cores para o tema escuro
const darkColors = [
  '#60a5fa', // blue-400
  '#34d399', // green-400
  '#f87171', // red-400
  '#fbbf24', // amber-400
  '#a78bfa', // violet-400
  '#f472b6', // pink-400
  '#22d3ee', // cyan-400
  '#2dd4bf', // teal-400
  '#fb923c', // orange-400
  '#818cf8', // indigo-400
];

// Tipos de dados para os gráficos
export type ChartData = Array<Record<string, any>>;

// Definindo as props do chart
export interface ChartProps extends ChartVariantProps {
  className?: string;
  data: ChartData;
  type: 'line' | 'bar' | 'pie' | 'area';
  series: Array<{
    dataKey: string;
    name?: string;
    color?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
    strokeWidth?: number;
    fill?: string;
    fillOpacity?: number;
    stack?: string;
  }>;
  xAxisDataKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom';
  aspectRatio?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  customTooltip?: (props: TooltipProps<any, any>) => ReactNode;
  isDarkMode?: boolean;
}

// Componente Chart
const Chart = ({
  className,
  variant,
  size,
  data,
  type,
  series,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  legendPosition = 'bottom',
  aspectRatio = 16 / 9,
  margin = { top: 10, right: 30, left: 0, bottom: 0 },
  customTooltip,
  isDarkMode = false,
}: ChartProps) => {
  // Determinar as cores com base no tema
  const colors = isDarkMode ? darkColors : defaultColors;

  // Renderizar o tipo de gráfico apropriado
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xAxisDataKey}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: 'insideBottom',
                      offset: -5,
                    }
                  : undefined
              }
            />
            <YAxis
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                    }
                  : undefined
              }
            />
            {showTooltip &&
              (customTooltip ? (
                <Tooltip content={customTooltip} />
              ) : (
                <Tooltip />
              ))}
            {showLegend && <Legend align="center" verticalAlign={legendPosition} />}
            {series.map((s, index) => (
              <Line
                key={s.dataKey}
                type={s.type || 'monotone'}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || colors[index % colors.length]}
                strokeWidth={s.strokeWidth || 2}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xAxisDataKey}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: 'insideBottom',
                      offset: -5,
                    }
                  : undefined
              }
            />
            <YAxis
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                    }
                  : undefined
              }
            />
            {showTooltip &&
              (customTooltip ? (
                <Tooltip content={customTooltip} />
              ) : (
                <Tooltip />
              ))}
            {showLegend && <Legend align="center" verticalAlign={legendPosition} />}
            {series.map((s, index) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                fill={s.fill || s.color || colors[index % colors.length]}
                fillOpacity={s.fillOpacity || 0.8}
                stackId={s.stack}
              />
            ))}
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart margin={margin}>
            <Pie
              data={data}
              nameKey={xAxisDataKey}
              dataKey={series[0]?.dataKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip &&
              (customTooltip ? (
                <Tooltip content={customTooltip} />
              ) : (
                <Tooltip />
              ))}
            {showLegend && <Legend align="center" verticalAlign={legendPosition} />}
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xAxisDataKey}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: 'insideBottom',
                      offset: -5,
                    }
                  : undefined
              }
            />
            <YAxis
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                    }
                  : undefined
              }
            />
            {showTooltip &&
              (customTooltip ? (
                <Tooltip content={customTooltip} />
              ) : (
                <Tooltip />
              ))}
            {showLegend && <Legend align="center" verticalAlign={legendPosition} />}
            {series.map((s, index) => (
              <Area
                key={s.dataKey}
                type={s.type || 'monotone'}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || colors[index % colors.length]}
                fill={s.fill || s.color || colors[index % colors.length]}
                fillOpacity={s.fillOpacity || 0.3}
                stackId={s.stack}
              />
            ))}
          </AreaChart>
        );
      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };

  return (
    <div
      className={chartVariants({
        variant,
        size,
        className,
      })}
    >
      <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export { Chart, chartVariants };