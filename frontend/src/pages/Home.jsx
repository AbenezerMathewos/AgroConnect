import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { resolveImageUrl } from '../utils/imageUrl';

const STEPS = [
  {
    icon: '🌱',
    title: 'Farmers list their harvest',
    text: 'Add a crop, set a fair price, and share where it can be picked up.',
  },
  {
    icon: '🔎',
    title: 'Buyers browse & search',
    text: 'Filter by crop, location, and price to find exactly what they need.',
  },
  {
    icon: '🤝',
    title: 'Connect directly',
    text: 'Buyers send a request; farmers accept and arrange pickup or delivery.',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getAll({ limit: 3 })
      .then((data) => setFeatured(data.products))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <span className="eyebrow">Wolaita Zone &middot; Farmer to buyer</span>
        <h1>Connecting Farmers and Buyers Across Wolaita</h1>
        <p>
          A digital marketplace where farmers advertise their harvest directly to buyers —
          no middlemen, better prices, wider reach.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Browse Products
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <div className="page-intro">
          <span className="eyebrow">How it works</span>
          <h2>Three simple steps</h2>
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

      <section className="about">
        <h2>About the Platform</h2>
        <p>
          Wolaita AgroConnect helps farmers list their crops and helps buyers discover
          fresh, local produce — making agricultural trade in Wolaita simpler and fairer.
        </p>
      </section>

      <section className="featured-products">
        <div className="page-intro">
          <span className="eyebrow">Fresh off the farm</span>
          <h2>Featured Products</h2>
        </div>
        {loading ? (
          <div className="page-loading">Loading...</div>
        ) : featured.length === 0 ? (
          <div className="empty-card">No products listed yet — check back soon.</div>
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
                </div>
                <div className="product-card-body">
                  <span className="eyebrow">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p className="product-card-price">{product.price.toLocaleString()} ETB</p>
                  <p className="product-card-location">📍 {product.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="cta-banner">
        <h2>Ready to grow your reach?</h2>
        <p>Join as a farmer to list your harvest, or as a buyer to find fresh produce near you.</p>
        <Link to="/register" className="btn btn-primary">
          Create your free account
        </Link>
      </section>
    </div>
  );
}