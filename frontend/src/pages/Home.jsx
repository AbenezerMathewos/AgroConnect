import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { marketPriceService } from '../services/marketPriceService';
import { useLanguage } from '../context/LanguageContext';
import { resolveImageUrl } from '../utils/imageUrl';

const CROP_CHIPS = [
  { label: '🌾 White Teff', query: 'Teff' },
  { label: '☕ Arabica Coffee', query: 'Coffee' },
  { label: '🥑 Hass Avocado', query: 'Avocado' },
  { label: '🌽 Maize', query: 'Maize' },
  { label: '🫚 Red Ginger', query: 'Ginger' },
  { label: '🌾 Enset / Kocho', query: 'Enset' },
];

const REGIONAL_HUBS = [
  {
    id: 'south',
    name: 'South Ethiopia & Wolaita',
    specialties: ['Red Ginger', 'Enset (Kocho)', 'Avocado', 'Boloso-1 Taro'],
    hub: 'Sodo Terminal Hub',
    status: 'Active Harvest Season',
    icon: '🌱',
  },
  {
    id: 'oromia',
    name: 'Oromia & Jimma',
    specialties: ['Grade 1 Washed Coffee', 'Yellow Maize', 'Wheat'],
    hub: 'Jimma / Adama Hub',
    status: 'Export Aggregation',
    icon: '☕',
  },
  {
    id: 'amhara',
    name: 'Amhara & Gojjam',
    specialties: ['Magna White Teff', 'Red Kidney Beans', 'Sesame'],
    hub: 'Bahir Dar / Gondar Hub',
    status: 'Wholesale Pooling',
    icon: '🌾',
  },
  {
    id: 'sidama',
    name: 'Sidama & Yirgacheffe',
    specialties: ['Yirgacheffe Specialty Coffee', 'Organic Honey', 'Fruits'],
    hub: 'Hawassa Terminal Hub',
    status: 'ECX Certified Lot',
    icon: '🍯',
  },
];

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [arbitrage, setArbitrage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState(REGIONAL_HUBS[0]);

  // Interactive Arbitrage Simulator state
  const [simCrop, setSimCrop] = useState('Teff (White Magna)');
  const [simQuintals, setSimQuintals] = useState(50);

  useEffect(() => {
    Promise.all([
      productService.getAll({ limit: 12 }),
      marketPriceService.getArbitrage(),
    ])
      .then(([prodData, arbData]) => {
        setFeatured(prodData.products || []);
        setArbitrage(arbData.arbitrage || []);
        if (arbData.arbitrage?.[0]?.crop) {
          setSimCrop(arbData.arbitrage[0].crop);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);


  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const selectedArb = arbitrage.find((a) => a.crop === simCrop) || arbitrage[0];
  const simGain = selectedArb ? Math.round(selectedArb.spread * simQuintals) : 0;
  const simFarmgateTotal = selectedArb ? Math.round(selectedArb.lowestMarket.price * simQuintals) : 0;
  const simTerminalTotal = selectedArb ? Math.round(selectedArb.highestMarket.price * simQuintals) : 0;

  const STEPS = [
    {
      icon: '🌱',
      stepNum: '01',
      title: t('step1Title'),
      text: t('step1Text'),
    },
    {
      icon: '📈',
      stepNum: '02',
      title: t('step2Title'),
      text: t('step2Text'),
    },
    {
      icon: '🔒',
      stepNum: '03',
      title: t('step3Title'),
      text: t('step3Text'),
    },
  ];

  return (
    <div className="home-page">
      {/* Floating Animated Particle Canopy in Hero */}
      <section className="hero-premium">
        <div className="hero-particles">
          <span className="particle particle-1">🌱</span>
          <span className="particle particle-2">✨</span>
          <span className="particle particle-3">🌾</span>
          <span className="particle particle-4">💫</span>
          <span className="particle particle-5">☕</span>
        </div>

        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <span className="pill-dot"></span>
              <span>🇪🇹 Ethiopia's Digital Agriculture Infrastructure</span>
            </div>
            <h1>{t('heroTitle')}</h1>
            <p className="hero-lead">{t('heroSubtitle')}</p>

            {/* Quick Hero Search Input */}
            <form onSubmit={handleHeroSearch} className="hero-search-box">
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search Magna Teff, Jimma Coffee, Wolaita Ginger..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Search
              </button>
            </form>

            {/* Popular Crop Quick Chips */}
            <div className="hero-chips-row">
              <span className="chips-label">Popular:</span>
              <div className="chips-container">
                {CROP_CHIPS.map((chip) => (
                  <button
                    key={chip.query}
                    className="crop-chip"
                    onClick={() => navigate(`/products?search=${encodeURIComponent(chip.query)}`)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                {t('browseProducts')} &rarr;
              </Link>
              <Link to="/market-prices" className="btn btn-glass btn-lg">
                📊 {t('marketPrices')}
              </Link>
              <Link to="/freight" className="btn btn-ghost btn-lg">
                🚚 {t('logistics')}
              </Link>
            </div>
          </div>

          {/* Right Hero: Live Spread Simulator Card */}
          {selectedArb && (
            <div className="hero-simulator-card">
              <div className="simulator-header">
                <span className="badge badge-discount">⚡ Arbitrage Profit Calculator</span>
                <span className="sim-live-tag">
                  <span className="pulse-dot-small"></span> Live Rates
                </span>
              </div>

              <div className="sim-field">
                <label>Select Commodity</label>
                <select
                  value={simCrop}
                  onChange={(e) => setSimCrop(e.target.value)}
                  className="sim-select"
                >
                  {arbitrage.map((a) => (
                    <option key={a.crop} value={a.crop}>
                      {a.crop} (+{a.spreadPercentage}% spread)
                    </option>
                  ))}
                </select>
              </div>

              <div className="sim-field">
                <div className="sim-label-row">
                  <label>Volume</label>
                  <strong>{simQuintals} Quintals</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={simQuintals}
                  onChange={(e) => setSimQuintals(Number(e.target.value))}
                  className="sim-slider"
                />
              </div>

              <div className="sim-breakdown-box">
                <div className="sim-row">
                  <span>Farmgate Value ({selectedArb.lowestMarket.market}):</span>
                  <strong>{simFarmgateTotal.toLocaleString()} ETB</strong>
                </div>
                <div className="sim-row">
                  <span>Terminal Market Value ({selectedArb.highestMarket.market}):</span>
                  <strong>{simTerminalTotal.toLocaleString()} ETB</strong>
                </div>
                <div className="sim-row sim-gain-row">
                  <span>Potential Gross Spread:</span>
                  <strong className="text-gain">+{simGain.toLocaleString()} ETB</strong>
                </div>
              </div>

              <Link to="/market-prices" className="btn btn-primary btn-block btn-sm">
                View Full Arbitrage Radar &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Live Metrics Trust Bar */}
        <div className="hero-metrics-bar">
          <div className="metric-item">
            <strong className="metric-glow">50,000+</strong>
            <span>Quintals Facilitated</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong className="metric-glow">8+</strong>
            <span>National Market Hubs</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong className="metric-glow">100%</strong>
            <span>Telebirr Escrow Protected</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong className="metric-glow">5</strong>
            <span>Languages Supported</span>
          </div>
        </div>
      </section>

      {/* Live Arbitrage & Price Spread Ticker */}
      {arbitrage.length > 0 && (
        <section className="arbitrage-ticker-section">
          <div className="ticker-header">
            <div className="ticker-badge-live">
              <span className="pulse-dot"></span>
              <span>LIVE ARBITRAGE RADAR</span>
            </div>
            <span className="ticker-sub">Real-time farmgate to terminal market price spreads across Ethiopia:</span>
          </div>
          <div className="arbitrage-ticker-cards">
            {arbitrage.map((item) => (
              <div className="ticker-card" key={item.crop}>
                <div className="ticker-card-top">
                  <strong className="ticker-crop-name">{item.crop}</strong>
                  <span className="ticker-gain-badge">+{item.spreadPercentage}%</span>
                </div>
                <div className="ticker-spread-row">
                  <div className="spread-node">
                    <span className="node-market">📍 {item.lowestMarket.market}</span>
                    <span className="node-price">{item.lowestMarket.price} ETB</span>
                  </div>
                  <span className="spread-arrow">➔</span>
                  <div className="spread-node">
                    <span className="node-market">🏢 {item.highestMarket.market}</span>
                    <span className="node-price font-bold">{item.highestMarket.price} ETB</span>
                  </div>
                </div>
                <div className="ticker-footer-gain">
                  Gross Spread: <strong>+{item.spread} ETB</strong>/{item.lowestMarket.unit}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Regional Harvest Hub Explorer */}
      <section className="regional-hub-section">
        <div className="section-header-flex">
          <div>
            <span className="eyebrow">Interactive Nationwide Network</span>
            <h2>Regional Agricultural Production Hubs</h2>
          </div>
          <span className="hub-status-badge">🇪🇹 Connected to ECX & Regional Cooperatives</span>
        </div>

        <div className="hub-tabs-row">
          {REGIONAL_HUBS.map((hub) => (
            <button
              key={hub.id}
              className={`hub-tab-btn ${activeRegion.id === hub.id ? 'active' : ''}`}
              onClick={() => setActiveRegion(hub)}
            >
              <span>{hub.icon}</span>
              <strong>{hub.name}</strong>
            </button>
          ))}
        </div>

        <div className="hub-spotlight-card">
          <div className="hub-spotlight-left">
            <div className="hub-badge-row">
              <span className="badge badge-coop">{activeRegion.hub}</span>
              <span className="badge badge-discount">● {activeRegion.status}</span>
            </div>
            <h3>{activeRegion.name} Supply Corridor</h3>
            <p>
              Directly connected with smallholder farmer unions and primary cooperatives for quality-certified bulk lots.
            </p>
            <div className="hub-specialties">
              <span className="specialties-title">Key Hub Crops:</span>
              <div className="specialties-pills">
                {activeRegion.specialties.map((crop) => (
                  <span key={crop} className="specialty-pill">
                    ✓ {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="hub-spotlight-right">
            <Link
              to={`/products?region=${encodeURIComponent(activeRegion.id === 'south' ? 'South Ethiopia' : activeRegion.name.split(' ')[0])}`}
              className="btn btn-primary btn-block"
            >
              Browse {activeRegion.name} Harvests &rarr;
            </Link>
            <Link to="/freight" className="btn btn-secondary btn-block">
              Find Freight in {activeRegion.hub.split(' ')[0]}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Harvests — Infinite Smooth Marquee Carousel */}
      <section className="featured-section">
        <div className="section-header-flex">
          <div>
            <div className="carousel-eyebrow-row">
              <span className="eyebrow">Direct from Smallholders & Unions</span>
              <span className="badge badge-discount">● Live Streaming Feed</span>
            </div>
            <h2>{t('featuredHarvests')}</h2>
          </div>
          <div className="carousel-controls-header">
            <span className="carousel-pause-hint">⚡ Live Non-Stop Stream</span>
            <Link to="/products" className="btn btn-secondary btn-sm">
              {t('viewAllProducts')} &rarr;
            </Link>
          </div>

        </div>

        {loading ? (
          <div className="page-loading">Loading marketplace listings...</div>
        ) : featured.length === 0 ? (
          <div className="empty-card">No products listed yet.</div>
        ) : (
          <div className="marquee-carousel-wrapper">
            <div className="marquee-track">
              {/* Render two duplicated sets for seamless 100% gapless infinite loop */}
              {[...featured, ...featured].map((product, idx) => (
                <Link
                  to={`/products/${product._id}`}
                  key={`${product._id}-${idx}`}
                  className="product-card carousel-product-card"
                >
                  <div className="product-card-media">
                    {product.images?.[0] ? (
                      <img
                        src={resolveImageUrl(product.images[0])}
                        alt={product.title}
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <span className="product-card-media-fallback">🌾</span>
                    )}
                    {product.isCooperativePooled && (
                      <span className="badge badge-coop card-badge">Cooperative Lot</span>
                    )}
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-tags">
                      <span className="eyebrow">{product.category}</span>
                      <span className="badge badge-grade">{product.grade || 'Grade 1'}</span>
                    </div>
                    <h3>{product.title}</h3>
                    <p className="product-card-price">
                      {product.price.toLocaleString()} ETB
                      <span> / {product.unit || 'Kg'}</span>
                    </p>
                    <p className="product-card-location">📍 {product.location} ({product.region})</p>
                    <p className="product-seller">
                      {product.cooperativeName ? `🏢 ${product.cooperativeName}` : `👨‍🌾 ${product.owner?.name}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>


      {/* 4 Pillars Highlight */}
      <section className="pillars-section">
        <div className="page-intro text-center">
          <span className="eyebrow">Enterprise Agricultural Infrastructure</span>
          <h2>Solving Structural Market Inefficiencies</h2>
        </div>
        <div className="pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon-box">🤝</div>
            <h3>Direct & Fair Trade</h3>
            <p>Bypassing predatory local broker cartels so smallholder producers earn true market value.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon-box">🌾</div>
            <h3>Cooperative Bulk Pooling</h3>
            <p>Aggregating smallholder yields into standardized 50–200 Quintal lots for commercial buyers.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon-box">🔒</div>
            <h3>Telebirr Escrow Protection</h3>
            <p>Funds remain secured in mobile escrow until the buyer inspects quality at destination.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon-box">🚚</div>
            <h3>Freight Matchmaker</h3>
            <p>Matching return-trip empty Isuzu trucks to reduce rural agricultural freight costs by up to 40%.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="page-intro text-center">
          <span className="eyebrow">Simple & Frictionless</span>
          <h2>{t('threeStepsTitle')}</h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <div className="step-card" key={step.title}>
              <span className="step-watermark">{step.stepNum}</span>
              <span className="step-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Freight Call to Action Banner */}
      <section className="cta-banner freight-cta">
        <h2>{t('freightBannerTitle')}</h2>
        <p>{t('freightBannerSubtitle')}</p>
        <div className="hero-actions">
          <Link to="/freight" className="btn btn-primary btn-lg">
            Explore Freight Routes &rarr;
          </Link>
          <Link to="/advisory" className="btn btn-secondary btn-lg">
            View Crop Health Guide
          </Link>
        </div>
      </section>
    </div>
  );
}