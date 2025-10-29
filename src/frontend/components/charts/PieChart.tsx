import React from 'react'
import styled from 'styled-components'
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts'

interface PieChartData {
    name: string
    value: number
    color?: string
}

interface PieChartProps {
    data: PieChartData[]
    title?: string
    height?: number
    showLegend?: boolean
    innerRadius?: number
    outerRadius?: number
    animate?: boolean
}

const ChartContainer = styled.div`
  width: 100%;
  
  .recharts-tooltip-wrapper {
    .recharts-default-tooltip {
      background: var(--bg-card) !important;
      border: 1px solid var(--border) !important;
      border-radius: var(--radius-sm) !important;
      box-shadow: 0 10px 30px var(--shadow) !important;
      
      .recharts-tooltip-label {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        margin-bottom: 0.5rem !important;
      }
      
      .recharts-tooltip-item {
        color: var(--color-primary) !important;
        font-weight: 500 !important;
      }
    }
  }
  
  .recharts-legend-wrapper {
    .recharts-legend-item {
      .recharts-legend-item-text {
        color: var(--text-secondary) !important;
        font-size: 0.875rem !important;
      }
    }
  }
`

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
`

const defaultColors = [
    '#00ff88', // Primary green
    '#00cc6a', // Secondary green
    '#ffaa00', // Warning orange
    '#00aaff', // Info blue
    '#ff4444', // Danger red
    '#9333ea', // Purple
    '#f59e0b', // Amber
    '#10b981', // Emerald
]

export const PieChart: React.FC<PieChartProps> = ({
    data,
    title,
    height = 300,
    showLegend = true,
    innerRadius = 0,
    outerRadius = 80,
    animate = true
}) => {
    const dataWithColors = data.map((item, index) => ({
        ...item,
        color: item.color || defaultColors[index % defaultColors.length]
    }))

    const formatTooltip = (value: number, name: string) => {
        const total = data.reduce((sum, item) => sum + item.value, 0)
        const percentage = ((value / total) * 100).toFixed(1)
        return [`${value} (${percentage}%)`, name]
    }

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        if (percent < 0.05) return null // Don't show labels for slices smaller than 5%

        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="var(--text-primary)"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <ChartContainer>
            {title && <ChartTitle>{title}</ChartTitle>}

            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={dataWithColors}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={animate ? 800 : 0}
                    >
                        {dataWithColors.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="var(--bg-primary)"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>

                    <Tooltip formatter={formatTooltip} />

                    {showLegend && (
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    )}
                </RechartsPieChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}