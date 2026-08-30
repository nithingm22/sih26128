import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { STATUS_LABELS } from './StatusBadge'

// Chrome (grid/axis/tooltip) colors per theme — same values used by
// RiskChart, kept in sync so every chart on the app reads the same
// way in both themes.
const CHROME = {
  light: {
    grid: '#e2e5e9',
    tick: '#5b6470',
    axisLine: '#e2e5e9',
    label: '#1a1d23',
    cursor: '#f7f8fa',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e2e5e9',
    bar: '#0f6b5c',
  },
  dark: {
    grid: '#2a343c',
    tick: '#93a3ad',
    axisLine: '#2a343c',
    label: '#e7edf0',
    cursor: '#1c262b',
    tooltipBg: '#161e22',
    tooltipBorder: '#2a343c',
    bar: '#2dd4bf',
  },
}

// Case Status Overview chart. Uses a single neutral brand color for
// every bar (rather than per-status colors) — status already has its
// own color vocabulary via StatusBadge, and reusing those hues here
// for a *count* chart would suggest a meaning (e.g. severity) that
// isn't what this chart shows.
export default function StatusOverviewChart({ data }) {
  const { theme } = useTheme()
  const chrome = CHROME[theme]

  const chartData = data.map((d) => ({
    ...d,
    label: STATUS_LABELS[d.status] ?? d.status,
  }))

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
        >
          <CartesianGrid horizontal={false} stroke={chrome.grid} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: chrome.tick }}
            axisLine={{ stroke: chrome.axisLine }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: chrome.label }}
            axisLine={false}
            tickLine={false}
            width={92}
          />
          <Tooltip
            cursor={{ fill: chrome.cursor }}
            contentStyle={{
              fontSize: 13,
              borderRadius: 8,
              border: `1px solid ${chrome.tooltipBorder}`,
              background: chrome.tooltipBg,
              color: chrome.label,
            }}
          />
          <Bar dataKey="count" fill={chrome.bar} radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
