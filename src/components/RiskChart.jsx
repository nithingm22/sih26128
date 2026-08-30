import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'

// Colors mapped 1:1 with RiskBadge / StatusBadge so a bar chart never
// introduces a new color meaning the rest of the app doesn't use.
// Dark mode uses brighter tints of the same three hues (readable on
// a dark background) — the semantics never change, only the shade.
const RISK_COLORS = {
  light: { Low: '#1e8e5a', Medium: '#b7791f', High: '#c2410c' },
  dark: { Low: '#34d399', Medium: '#fbbf24', High: '#fb7a4b' },
}

// Chrome (grid/axis/tooltip) colors per theme — kept separate from
// the CSS custom properties since Recharts renders to SVG attributes
// rather than the DOM's cascaded styles.
const CHROME = {
  light: { grid: '#e2e5e9', tick: '#5b6470', axisLine: '#e2e5e9', label: '#1a1d23', cursor: '#f7f8fa', tooltipBg: '#ffffff', tooltipBorder: '#e2e5e9' },
  dark: { grid: '#2a343c', tick: '#93a3ad', axisLine: '#2a343c', label: '#e7edf0', cursor: '#1c262b', tooltipBg: '#161e22', tooltipBorder: '#2a343c' },
}

// Single risk-distribution chart. Deliberately plain: thin bars,
// minimal horizontal-only gridlines, no 3D/shadow/gradient fill —
// per the approved chart styling.
export default function RiskChart({ data }) {
  const { theme } = useTheme()
  const riskColors = RISK_COLORS[theme]
  const chrome = CHROME[theme]

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
            dataKey="level"
            tick={{ fontSize: 13, fill: chrome.label }}
            axisLine={false}
            tickLine={false}
            width={64}
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
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((entry) => (
              <Cell key={entry.level} fill={riskColors[entry.level]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
