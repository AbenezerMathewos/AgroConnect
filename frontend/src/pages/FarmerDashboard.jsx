import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import ProductThumb from '../components/ProductThumb';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    productService
      .getMine()
      .then((data) => setProducts(data.products))
      .catch(() => setError('Could not load your products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Could not delete that product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="farmer-dashboard">
      <div className="page-intro">
        <span className="eyebrow">Farmer dashboard</span>
        <h1>Welcome back, {user?.name}</h1>
        <p>Manage your listings and keep them fresh so buyers can find your harvest.</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/farmer/products/add" className="btn btn-primary">
          + Add Product
        </Link>
        <Link to="/orders" className="btn btn-secondary">
          View buyer requests
        </Link>
      </div>

      <h2>My Products</h2>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <div className="empty-card">
          You haven't listed any products yet. Add your first harvest to start reaching buyers.
        </div>
      ) : (
        <table className="my-products-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <ProductThumb product={product} />
                </td>
                <td>
                  <Link to={`/products/${product._id}`}>{product.title}</Link>
                </td>
                <td>{product.category}</td>
                <td>{product.price} ETB</td>
                <td>
                  {product.quantity} {product.unit || 'Kg'}
                </td>
                <td>{product.location}</td>
                <td>
                  <span className={product.isAvailable ? 'badge badge-accepted' : 'badge badge-muted'}>
                    {product.isAvailable ? 'Available' : 'Sold out'}
                  </span>
                </td>
                <td className="row-actions">
                  <Link to={`/farmer/products/${product._id}/edit`}>Edit</Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}