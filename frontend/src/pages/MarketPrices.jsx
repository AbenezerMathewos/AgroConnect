import { useEffect, useState } from 'react';
import { marketPriceService } from '../services/marketPriceService';

export default function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [filters, setFilters] = useState({ crop: '', market: '' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    marketPriceService
      .getAll(filters)
      .then((data) => setPrices(data.prices))
      .catch(() => setPrices([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="market-page">
      <section className="page-intro">
        <span className="eyebrow">Market intelligence</span>
        <h1>Make every harvest count.</h1>
        <p>Recent local price ranges, in ETB per unit.</p>
      </section>

      <form
        className="filters-form price-filters"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          placeholder="Crop, e.g. Maize"
          value={filters.crop}
          onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
        />
        <input
          placeholder="Market, e.g. Sodo"
          value={filters.market}
          onChange={(e) => setFilters({ ...filters, market: e.target.value })}
        />
        <button className="btn btn-primary">Find prices</button>
      </form>

      {loading ? (
        <div className="page-loading">Loading prices...</div>
      ) : prices.length === 0 ? (
        <div className="empty-card">No records yet. Ask an administrator to add the latest market prices.</div>
      ) : (
        <div className="price-grid">
          {prices.map((price) => (
            <article className="price-card" key={price._id}>
              <span className="eyebrow">{price.market}</span>
              <h2>{price.crop}</h2>
              <strong>
                {price.lowPrice}&ndash;{price.highPrice} <small>ETB/{price.unit}</small>
              </strong>
              <p>Recorded {new Date(price.recordedAt).toLocaleDateString()}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
