import { useEffect, useState } from 'react';
import { marketPriceService } from '../services/marketPriceService';
import { useLanguage } from '../context/LanguageContext';

export default function MarketPrices() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [arbitrage, setArbitrage] = useState([]);
  const [viewMode, setViewMode] = useState('prices'); // 'prices' | 'arbitrage'
  const [filters, setFilters] = useState({ crop: '', market: '', region: '' });
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      marketPriceService.getAll(filters),
      marketPriceService.getArbitrage(),
    ])
      .then(([pricesData, arbData]) => {
        setPrices(pricesData.prices || []);
        setArbitrage(arbData.arbitrage || []);
      })
      .catch(() => {
        setPrices([]);
        setArbitrage([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  return (
    <div className="market-page">
      <section className="page-intro">
        <span className="eyebrow">📈 National Market Intelligence & Transparency</span>
        <h1>{t('priceRadarHeadline')}</h1>
        <p>{t('arbitrageSubtitle')}</p>
      </section>

      {/* View Toggle */}
      <div className="market-view-toggle">
        <button
          className={viewMode === 'prices' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setViewMode('prices')}
        >
          📊 Live Market Board ({prices.length} Records)
        </button>
        <button
          className={viewMode === 'arbitrage' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setViewMode('arbitrage')}
        >
          ⚡ Arbitrage & Spread Radar ({arbitrage.length} Commodities)
        </button>
      </div>

      {viewMode === 'prices' ? (
        <>
          <form
            className="filters-form price-filters"
            onSubmit={(e) => {
              e.preventDefault();
              loadData();
            }}
          >
            <input
              placeholder="Crop, e.g. Teff, Coffee, Maize"
              value={filters.crop}
              onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
            />
            <input
              placeholder="Market, e.g. Ehil Berenda, Sodo, Adama"
              value={filters.market}
              onChange={(e) => setFilters({ ...filters, market: e.target.value })}
            />
            <button className="btn btn-primary">Find Prices</button>
          </form>

          {loading ? (
            <div className="page-loading">Loading market prices...</div>
          ) : prices.length === 0 ? (
            <div className="empty-card">No records match your search.</div>
          ) : (
            <div className="price-grid">
              {prices.map((price) => (
                <article className="price-card" key={price._id}>
                  <div className="price-card-top">
                    <span className="eyebrow">{price.market}</span>
                    <span className={`badge badge-trend badge-trend-${price.trend}`}>
                      {price.trend === 'rising' ? '▲ Rising' : price.trend === 'falling' ? '▼ Falling' : '● Stable'}
                    </span>
                  </div>
                  <h2>{price.crop}</h2>
                  <span className="price-market-type">{price.marketType} &middot; {price.region}</span>
                  <div className="price-card-figures">
                    <strong>
                      {price.lowPrice.toLocaleString()}&ndash;{price.highPrice.toLocaleString()}
                    </strong>
                    <small>ETB / {price.unit}</small>
                  </div>
                  <p className="price-date">Recorded {new Date(price.recordedAt).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Arbitrage Spread Radar View */
        <div className="arbitrage-view">
          {loading ? (
            <div className="page-loading">Calculating arbitrage spreads...</div>
          ) : arbitrage.length === 0 ? (
            <div className="empty-card">No arbitrage comparison data available.</div>
          ) : (
            <div className="arbitrage-table-wrapper">
              <table className="admin-table arbitrage-table">
                <thead>
                  <tr>
                    <th>Commodity</th>
                    <th>Lowest Source (Farmgate / Hub)</th>
                    <th>Highest Destination (Terminal Market)</th>
                    <th>Price Gap (Spread)</th>
                    <th>Gross Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {arbitrage.map((item) => (
                    <tr key={item.crop}>
                      <td>
                        <strong>{item.crop}</strong>
                      </td>
                      <td>
                        <span className="text-farmgate">📍 {item.lowestMarket.market} ({item.lowestMarket.region})</span>
                        <div><strong>{item.lowestMarket.price?.toLocaleString()} ETB</strong>/{item.lowestMarket.unit}</div>
                      </td>
                      <td>
                        <span className="text-terminal">🏢 {item.highestMarket.market} ({item.highestMarket.region})</span>
                        <div><strong>{item.highestMarket.price?.toLocaleString()} ETB</strong>/{item.highestMarket.unit}</div>
                      </td>
                      <td>
                        <span className="spread-number">+{item.spread?.toLocaleString()} ETB</span>
                        <small> per {item.lowestMarket.unit}</small>
                      </td>
                      <td>
                        <span className="badge badge-arbitrage">
                          +{item.spreadPercentage}% Gross
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

