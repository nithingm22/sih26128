import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowRight } from 'lucide-react'
import RiskBadge from './RiskBadge'
import StatusBadge from './StatusBadge'
import { useTheme } from '../context/ThemeContext'
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, getVetName } from '../services/mockData'

// Same hex values used by RiskChart for the two themes, so a marker
// on the map, a bar in the dashboard chart, and a RiskBadge pill are
// always showing the same color for the same risk level.
const RISK_COLORS = {
  light: { low: '#1e8e5a', medium: '#b7791f', high: '#c2410c' },
  dark: { low: '#34d399', medium: '#fbbf24', high: '#fb7a4b' },
}

// Muted, low-contrast basemaps (CartoDB) instead of default OSM
// tiles — keeps the colored risk markers as the clear focal point
// rather than competing with a busy, saturated basemap. Swapped by
// theme so the tile layer itself stays readable in dark mode too.
const TILE_URLS = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function buildMarkerIcon(riskLevel, theme) {
  const color = RISK_COLORS[theme][riskLevel] ?? RISK_COLORS[theme].low
  // High-risk markers are a little larger so they draw the eye first
  // while scanning the map — deliberately not animated/flashing.
  const size = riskLevel === 'high' ? 18 : riskLevel === 'medium' ? 15 : 12

  return L.divIcon({
    className: '',
    html: `<span style="
      display:block;
      width:${size}px;
      height:${size}px;
      border-radius:9999px;
      background:${color};
      border:2px solid ${theme === 'dark' ? '#0d1316' : '#ffffff'};
      box-shadow:0 0 0 1px ${color}55;
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Small internal component (must live inside <MapContainer>) that
// recenters the map when the parent's reset counter changes — lets
// the "Reset View" button work without fully remounting the map.
function ResetViewHandler({ resetSignal }) {
  const map = useMap()

  useEffect(() => {
    if (resetSignal > 0) {
      map.setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal])

  return null
}

export default function SurveillanceMap({ cases, resetSignal }) {
  const { theme } = useTheme()

  const icons = useMemo(
    () => ({
      low: buildMarkerIcon('low', theme),
      medium: buildMarkerIcon('medium', theme),
      high: buildMarkerIcon('high', theme),
    }),
    [theme],
  )

  return (
    <div className="h-[420px] md:h-[560px] rounded-card overflow-hidden border border-border">
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer url={TILE_URLS[theme]} attribution={TILE_ATTRIBUTION} />
        <ResetViewHandler resetSignal={resetSignal} />

        {cases.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={icons[c.risk_level]}>
            <Popup minWidth={220}>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Case #{c.id}
                  </p>
                  <p className="text-xs text-steel">
                    {c.animal.name} · {c.animal.species}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <RiskBadge level={c.risk_level} percent={c.risk_percent} />
                  <StatusBadge status={c.status} />
                </div>

                <dl className="text-xs text-steel space-y-0.5">
                  <div className="flex justify-between gap-3">
                    <dt>Location</dt>
                    <dd className="text-ink text-right">{c.location}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Reported</dt>
                    <dd className="text-ink text-right">{formatDate(c.created_at)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Vet</dt>
                    <dd className="text-ink text-right">
                      {getVetName(c.assigned_vet_id)}
                    </dd>
                  </div>
                </dl>

                <Link
                  to={`/cases/${c.id}`}
                  className="flex items-center justify-center gap-1 h-8 rounded-control bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
                >
                  View Case
                  <ArrowRight size={13} />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
