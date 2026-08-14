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

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [arbitrage, setArbitrage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  // Interactive Arbitrage Simulator state
  const [simCrop, setSimCrop] = useState('Teff (White Magna)');
  const [simQuintals, setSimQuintals] = useState(50);

  useEffect(() => {
    Promise.all([
      productService.getAll({ limit: 4 }),
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
      {/* Premium Hero Section with Live Search & Interactive Quick Chips */}
      <section className="hero-premium">
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
                <span className="sim-live-tag">● Live Rates</span>
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
            <strong>50,000+</strong>
            <span>Quintals Facilitated</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>8+</strong>
            <span>National Market Hubs</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>100%</strong>
            <span>Telebirr Escrow Protected</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>5</strong>
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

      {/* Featured Harvests */}
      <section className="featured-section">
        <div className="section-header-flex">
          <div>
            <span className="eyebrow">Verified Quality Harvests</span>
            <h2>{t('featuredHarvests')}</h2>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm">
            {t('viewAllProducts')} &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="page-loading">Loading marketplace listings...</div>
        ) : featured.length === 0 ? (
          <div className="empty-card">No products listed yet.</div>
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id} className="product-card">
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
                    <span className="badge badge-grade">{product.grade}</span>
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