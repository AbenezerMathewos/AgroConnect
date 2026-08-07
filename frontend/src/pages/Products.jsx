import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { resolveImageUrl } from '../utils/imageUrl';

const initialFilters = {
  search: '',
  category: '',
  location: '',
  minPrice: '',
  maxPrice: '',
};

export default function Products() {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback((page = 1) => {
    setLoading(true);
    setError('');

    // Strip empty fields so we don't send blank query params
    const params = Object.fromEntries(
      Object.entries(appliedFilters).filter(([, value]) => value !== '')
    );
    params.page = page;

    productService
      .getAll(params)
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters(filters);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <div className="products-page">
      <div className="page-intro">
        <span className="eyebrow">Marketplace</span>
        <h1>Browse Products</h1>
        <p>Search fresh harvests listed directly by Wolaita farmers.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="filters-form">
        <input
          name="search"
          placeholder="Search by name or category"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="page-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-card">No products match your search. Try widening your filters.</div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
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
                  {!product.isAvailable && <span className="badge badge-muted card-badge">Sold out</span>}
                </div>
                <div className="product-card-body">
                  <span className="eyebrow">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p className="product-card-price">
                    {product.price.toLocaleString()} ETB
                    <span> / {product.unit || 'Kg'} &middot; {product.quantity} available</span>
                  </p>
                  <p className="product-card-location">📍 {product.location}</p>
                  <p className="product-seller">Seller: {product.owner?.name}</p>
                </div>
              </Link>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.page <= 1}
                onClick={() => loadProducts(pagination.page - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => loadProducts(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}