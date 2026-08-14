import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { marketPriceService } from '../services/marketPriceService';
import { useLanguage } from '../context/LanguageContext';
import { resolveImageUrl } from '../utils/imageUrl';

export default function Home() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [arbitrage, setArbitrage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getAll({ limit: 4 }),
      marketPriceService.getArbitrage(),
    ])
      .then(([prodData, arbData]) => {
        setFeatured(prodData.products || []);
        setArbitrage((arbData.arbitrage || []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STEPS = [
    {
      icon: '🌱',
      title: t('step1Title'),
      text: t('step1Text'),
    },
    {
      icon: '📈',
      title: t('step2Title'),
      text: t('step2Text'),
    },
    {
      icon: '🔒',
      title: t('step3Title'),
      text: t('step3Text'),
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <span className="eyebrow">🇪🇹 AgroConnect Ethiopia &middot; Farmgate to Terminal Markets</span>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSubtitle')}</p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            {t('getStarted')}
          </Link>
          <Link to="/products" className="btn btn-secondary">
            {t('browseProducts')}
          </Link>
          <Link to="/market-prices" className="btn btn-ghost">
            📊 {t('marketPrices')}
          </Link>
        </div>
      </section>

      {/* Live Arbitrage & Price Spread Ticker */}
      {arbitrage.length > 0 && (
        <section className="arbitrage-ticker-section">
          <div className="ticker-header">
            <span className="ticker-badge">🔴 LIVE ARBITRAGE RADAR</span>
            <span>Real-time price spreads across Ethiopia:</span>
          </div>
          <div className="arbitrage-ticker-cards">
            {arbitrage.map((item) => (
              <div className="ticker-card" key={item.crop}>
                <strong>{item.crop}</strong>
                <div className="ticker-spread-row">
                  <span className="ticker-low">
                    {item.lowestMarket.market}: {item.lowestMarket.price} ETB
                  </span>
                  <span className="ticker-arrow">➔</span>
                  <span className="ticker-high">
                    {item.highestMarket.market}: {item.highestMarket.price} ETB
                  </span>
                </div>
                <span className="ticker-gain">
                  +{item.spreadPercentage}% Gross Spread ({item.spread} ETB/{item.lowestMarket.unit})
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="page-intro">
          <span className="eyebrow">Modernizing Ethiopian Agriculture</span>
          <h2>{t('threeStepsTitle')}</h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <div className="step-card" key={step.title}>
              <span className="step-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Pillars Highlight */}
      <section className="pillars-grid">
        <div className="pillar-item">
          <span className="pillar-icon">🤝</span>
          <h3>Direct & Fair Trade</h3>
          <p>Bypassing unfair local brokers so smallholder producers earn full market worth.</p>
        </div>
        <div className="pillar-item">
          <span className="pillar-icon">🌾</span>
          <h3>Cooperative Pooling</h3>
          <p>Smallholders aggregate into standard bulk lots (50-200 Quintals) for wholesale buyers.</p>
        </div>
        <div className="pillar-item">
          <span className="pillar-icon">🔒</span>
          <h3>Telebirr Escrow</h3>
          <p>Funds remain secured in mobile escrow until produce is inspected at destination.</p>
        </div>
        <div className="pillar-item">
          <span className="pillar-icon">🚚</span>
          <h3>Isuzu Freight Sharing</h3>
          <p>Matching return-trip empty trucks cuts rural transport expenses by up to 40%.</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="page-intro">
          <span className="eyebrow">Verified Quality Harvests</span>
          <h2>{t('featuredHarvests')}</h2>
        </div>
        {loading ? (
          <div className="page-loading">Loading harvests...</div>
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
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="center-action">
          <Link to="/products" className="btn btn-secondary">
            {t('viewAllProducts')} &rarr;
          </Link>
        </div>
      </section>

      {/* Freight Call to Action Banner */}
      <section className="cta-banner freight-cta">
        <h2>{t('freightBannerTitle')}</h2>
        <p>{t('freightBannerSubtitle')}</p>
        <div className="hero-actions">
          <Link to="/freight" className="btn btn-primary">
            Explore Freight Routes
          </Link>
          <Link to="/advisory" className="btn btn-secondary">
            View Crop Health Guide
          </Link>
        </div>
      </section>
    </div>
  );
}