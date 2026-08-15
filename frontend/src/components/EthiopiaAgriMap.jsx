import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const REGIONAL_AGRI_ZONES = [
  {
    id: 'south',
    name: 'South Ethiopia & Wolaita',
    amharic: 'ደቡብ ኢትዮጵያ እና ወላይታ',
    hubCity: 'Wolaita Sodo Central Hub',
    status: 'Peak Harvest Season',
    statusColor: '#10b981',
    activeLots: 168,
    specialties: ['Red Ginger', 'Enset (Kocho)', 'Hass Avocado', 'Boloso-1 Taro'],
    avgPriceRange: '4,500 – 11,500 ETB/Qtl',
    freightCapacity: '24 Return Isuzu Trucks Daily',
    climate: 'Highland Temperate (1,900m)',
    icon: '🌱',
    color: '#059669',
    pinX: 38,
    pinY: 68,
    path: 'M 28 60 Q 35 55 45 58 Q 50 66 45 78 Q 32 82 25 72 Z',
  },
  {
    id: 'oromia',
    name: 'Oromia (Jimma & Arsi Belt)',
    amharic: 'ኦሮሚያ (ጅማ እና አርሲ)',
    hubCity: 'Jimma / Adama Trade Center',
    status: 'Export Aggregation',
    statusColor: '#0ea5e9',
    activeLots: 245,
    specialties: ['Grade 1 Washed Coffee', 'Yellow Maize', 'Durum Wheat', 'Barley'],
    avgPriceRange: '3,800 – 14,000 ETB/Qtl',
    freightCapacity: '48 FSR & Isuzu Trucks Daily',
    climate: 'Sub-humid Agroforestry (1,750m)',
    icon: '☕',
    color: '#0284c7',
    pinX: 42,
    pinY: 48,
    path: 'M 20 45 Q 38 38 60 42 Q 68 55 58 68 Q 38 65 20 52 Z',
  },
  {
    id: 'amhara',
    name: 'Amhara (Gojjam & Gondar)',
    amharic: 'አማራ (ጎጃም እና ጎንደር)',
    hubCity: 'Bahir Dar / Debre Markos Depot',
    status: 'Wholesale Pooling',
    statusColor: '#f59e0b',
    activeLots: 194,
    specialties: ['Magna White Teff', 'Red Kidney Beans', 'Sesame', 'Chickpeas'],
    avgPriceRange: '6,200 – 11,800 ETB/Qtl',
    freightCapacity: '35 Return Isuzu Trucks Daily',
    climate: 'Mid-Highland Plains (2,100m)',
    icon: '🌾',
    color: '#d97706',
    pinX: 46,
    pinY: 26,
    path: 'M 32 15 Q 55 12 62 25 Q 58 40 40 42 Q 28 35 32 15 Z',
  },
  {
    id: 'sidama',
    name: 'Sidama & Yirgacheffe',
    amharic: 'ሲዳማ እና ይርጋጨፌ',
    hubCity: 'Hawassa Terminal Logistics Depot',
    status: 'ECX Specialty Certified',
    statusColor: '#8b5cf6',
    activeLots: 112,
    specialties: ['Yirgacheffe Arabica Coffee', 'Organic Forest Honey', 'Tropical Fruits'],
    avgPriceRange: '9,500 – 16,500 ETB/Qtl',
    freightCapacity: '18 Heavy Trucks Daily',
    climate: 'Moist Highland Mist (1,850m)',
    icon: '🍯',
    color: '#7c3aed',
    pinX: 52,
    pinY: 65,
    path: 'M 48 58 Q 62 56 65 68 Q 58 78 48 72 Z',
  },
  {
    id: 'tigray',
    name: 'Tigray & Raya Valley',
    amharic: 'ትግራይ እና ራያ',
    hubCity: 'Mekelle / Raya Sourcing Point',
    status: 'Active Supply Corridor',
    statusColor: '#10b981',
    activeLots: 86,
    specialties: ['White Sorghum', 'Highland Teff', 'Pure White Honey', 'Cumin'],
    avgPriceRange: '5,100 – 9,800 ETB/Qtl',
    freightCapacity: '14 Trucks Daily',
    climate: 'Semi-Arid Highland Valley (1,600m)',
    icon: '🌾',
    color: '#059669',
    pinX: 50,
    pinY: 14,
    path: 'M 42 5 Q 60 5 62 18 Q 50 24 38 18 Z',
  },
  {
    id: 'harar',
    name: 'Harar & Eastern Corridor',
    amharic: 'ሐረር እና ምሥራቅ ኮሪደር',
    hubCity: 'Dire Dawa Transit Depot',
    status: 'Trade Gateway',
    statusColor: '#0ea5e9',
    activeLots: 98,
    specialties: ['Harar Longberry Coffee', 'Export Onion', 'Groundnuts', 'Livestock Feed'],
    avgPriceRange: '4,200 – 13,200 ETB/Qtl',
    freightCapacity: '22 Freight Units Daily',
    climate: 'Warm Highland Transition (1,500m)',
    icon: '☕',
    color: '#0284c7',
    pinX: 72,
    pinY: 42,
    path: 'M 64 32 Q 85 30 88 48 Q 75 58 64 45 Z',
  },
];

export default function EthiopiaAgriMap() {
  const [selectedZone, setSelectedZone] = useState(REGIONAL_AGRI_ZONES[0]);
  const [hoveredZone, setHoveredZone] = useState(null);
  const navigate = useNavigate();

  const active = hoveredZone || selectedZone;

  return (
    <div className="agri-map-card">
      <div className="agri-map-header">
        <div>
          <div className="agri-map-badge-row">
            <span className="eyebrow">Interactive GIS Agricultural Heatmap</span>
            <span className="badge badge-discount">🇪🇹 National Harvest Radar</span>
          </div>
          <h2>Ethiopian Regional Sourcing & Production Corridors</h2>
          <p className="agri-map-subtitle">
            Click any regional corridor or hub to inspect live smallholder yields, commodity prices, and available Isuzu freight capacity.
          </p>
        </div>
        <div className="agri-map-stats-pill">
          <strong>903+</strong>
          <span>Aggregated Lots Nationwide</span>
        </div>
      </div>

      <div className="agri-map-grid">
        {/* Left: Interactive Vector Map View */}
        <div className="agri-vector-map-wrapper">
          <div className="map-view-box">
            {/* SVG Visual Map of Ethiopian Agricultural Regions */}
            <svg
              viewBox="0 0 100 90"
              className="ethiopia-svg-map"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Map Glow / Shadow */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(52, 211, 153, 0.15)" />
                  <stop offset="100%" stopColor="rgba(14, 165, 233, 0.05)" />
                </linearGradient>
              </defs>

              {/* Background Geographic Contour Base */}
              <path
                d="M 22 18 Q 45 4 64 6 Q 88 22 92 45 Q 85 70 65 82 Q 45 88 22 75 Q 12 55 22 18 Z"
                className="map-country-base"
              />

              {/* Interactive Regional Corridor Paths */}
              {REGIONAL_AGRI_ZONES.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                const isHovered = hoveredZone?.id === zone.id;
                return (
                  <path
                    key={zone.id}
                    d={zone.path}
                    className={`map-zone-path ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                    onClick={() => setSelectedZone(zone)}
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                    style={{
                      fill: isSelected || isHovered ? zone.color : 'rgba(52, 211, 153, 0.22)',
                      stroke: isSelected ? '#ffffff' : zone.color,
                    }}
                  />
                );
              })}

              {/* Central Addis Ababa Terminal Hub Beacon */}
              <g className="map-central-hub" transform="translate(48, 42)">
                <circle r="4.5" className="pulse-circle" fill="rgba(245, 158, 11, 0.35)" />
                <circle r="2.2" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
                <text x="3.5" y="1" className="map-label-addis">Addis Ababa (Merkato/Ehil Berenda)</text>
              </g>

              {/* Interactive Regional Hub Pins */}
              {REGIONAL_AGRI_ZONES.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <g
                    key={`pin-${zone.id}`}
                    transform={`translate(${zone.pinX}, ${zone.pinY})`}
                    className={`map-pin-group ${isSelected ? 'active-pin' : ''}`}
                    onClick={() => setSelectedZone(zone)}
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                  >
                    <circle
                      r={isSelected ? '4' : '2.8'}
                      className="pin-pulse"
                      fill={zone.color}
                      opacity={isSelected ? '0.4' : '0.2'}
                    />
                    <circle
                      r={isSelected ? '2.5' : '1.8'}
                      fill={zone.color}
                      stroke="#ffffff"
                      strokeWidth="0.6"
                    />
                    <text x="3" y="1.2" className="map-pin-label">
                      {zone.icon} {zone.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div className="map-legend-overlay">
              <span className="legend-item"><span className="legend-dot green"></span> Active Harvest</span>
              <span className="legend-item"><span className="legend-dot blue"></span> Export Hub</span>
              <span className="legend-item"><span className="legend-dot amber"></span> Wholesale Center</span>
            </div>
          </div>

          {/* Quick Regional Selector Pills */}
          <div className="map-pills-row">
            {REGIONAL_AGRI_ZONES.map((zone) => (
              <button
                key={zone.id}
                className={`map-quick-pill ${selectedZone.id === zone.id ? 'active' : ''}`}
                onClick={() => setSelectedZone(zone)}
              >
                <span>{zone.icon}</span>
                <span>{zone.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Sourcing Intelligence Details Panel */}
        <div className="agri-zone-details-panel">
          <div className="zone-details-header">
            <div className="zone-title-stack">
              <div className="zone-badge-row">
                <span className="zone-icon-lg">{active.icon}</span>
                <span
                  className="zone-status-badge"
                  style={{ background: `${active.statusColor}20`, color: active.statusColor, borderColor: `${active.statusColor}40` }}
                >
                  ● {active.status}
                </span>
              </div>
              <h3>{active.name}</h3>
              <p className="zone-amharic">{active.amharic}</p>
            </div>
            <div className="zone-lots-count">
              <strong>{active.activeLots}</strong>
              <small>Verified Lots</small>
            </div>
          </div>

          <div className="zone-metrics-grid">
            <div className="zone-metric-box">
              <span className="zone-metric-label">📍 Central Depot</span>
              <strong>{active.hubCity}</strong>
            </div>
            <div className="zone-metric-box">
              <span className="zone-metric-label">💰 Farmgate Price Spread</span>
              <strong className="text-gain">{active.avgPriceRange}</strong>
            </div>
            <div className="zone-metric-box">
              <span className="zone-metric-label">🚚 Freight Route Capacity</span>
              <strong>{active.freightCapacity}</strong>
            </div>
            <div className="zone-metric-box">
              <span className="zone-metric-label">⛅ Agro-Climate</span>
              <strong>{active.climate}</strong>
            </div>
          </div>

          <div className="zone-specialties-section">
            <span className="specialties-heading">Top Sourced Crops in this Corridor:</span>
            <div className="zone-specialties-tags">
              {active.specialties.map((item) => (
                <span key={item} className="zone-specialty-tag">
                  🌾 {item}
                </span>
              ))}
            </div>
          </div>

          <div className="zone-actions-row">
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate(`/products?region=${encodeURIComponent(active.id)}`)}
            >
              Browse {active.name.split(' ')[0]} Harvests ({active.activeLots} Lots) &rarr;
            </button>
            <button
              className="btn btn-secondary btn-block"
              onClick={() => navigate(`/market-prices`)}
            >
              📊 Compare {active.name.split(' ')[0]} Price Radar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
