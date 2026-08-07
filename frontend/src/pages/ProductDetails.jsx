import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import OrderPanel from '../components/OrderPanel';
import ReviewList from '../components/ReviewList';
import { resolveImageUrl } from '../utils/imageUrl';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);
  const [chatError, setChatError] = useState('');

  const messageSeller = async () => {
    if (!user) return navigate('/login');
    setMessaging(true);
    setChatError('');
    try {
      const { conversation } = await chatService.startConversation(product._id);
      navigate(`/messages/${conversation._id}`);
    } catch {
      setChatError('Could not start a conversation right now.');
    } finally {
      setMessaging(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    productService
      .getById(id)
      .then((data) => setProduct(data.product))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading">Loading...</div>;
  if (error) return <p className="form-error">{error}</p>;
  if (!product) return null;

  const image = product.images?.[0] ? resolveImageUrl(product.images[0]) : '';

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        &larr; Back to products
      </Link>

      <div className="product-details-grid">
        <div className="product-details-media">
          {image ? (
            <img src={image} alt={product.title} onError={(e) => (e.target.style.display = 'none')} />
          ) : (
            <div className="product-details-media placeholder-media">
              <span>🌾</span>
            </div>
          )}
        </div>

        <div className="product-details-main">
          <div className="product-details-heading">
            <span className="eyebrow">{product.category}</span>
            {!product.isAvailable && <span className="badge badge-muted">Sold out</span>}
          </div>
          <h1>{product.title}</h1>
          <p className="product-details-price">
            {product.price.toLocaleString()} ETB <span>/ {product.unit || 'Kg'}</span>
          </p>

          <dl className="product-detail-list">
            <dt>Quantity available</dt>
            <dd>
              {product.quantity} {product.unit || 'Kg'}
            </dd>

            <dt>Location</dt>
            <dd>📍 {product.location}</dd>

            <dt>Seller</dt>
            <dd>{product.owner?.name}</dd>

            {product.description && (
              <>
                <dt>Description</dt>
                <dd>{product.description}</dd>
              </>
            )}
          </dl>

          {(!user || user.role === 'buyer') && user?._id !== product.owner?._id && (
            <button className="btn btn-secondary btn-sm" onClick={messageSeller} disabled={messaging}>
              💬 {messaging ? 'Starting chat...' : 'Message seller'}
            </button>
          )}
          {chatError && <p className="form-error">{chatError}</p>}
        </div>

        <div className="product-details-side">
          <OrderPanel product={product} />
        </div>
      </div>

      <ReviewList productId={product._id} />
    </div>
  );
}