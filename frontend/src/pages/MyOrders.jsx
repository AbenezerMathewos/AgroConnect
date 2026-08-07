import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import ProductThumb from '../components/ProductThumb';
import ReviewForm from '../components/ReviewForm';

const STATUS_LABEL = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
};

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status] || status}</span>;
}

export default function MyOrders() {
  const { user } = useAuth();
  const isFarmer = user?.role === 'farmer';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOrders = () => {
    setLoading(true);
    orderService
      .getMine()
      .then((data) => setOrders(data.orders))
      .catch(() => setError('Could not load your requests.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      const { order } = await orderService.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? order : o)));
    } catch {
      setError('Could not update that request. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const visibleOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="orders-page">
      <div className="page-intro">
        <span className="eyebrow">{isFarmer ? 'Incoming requests' : 'My requests'}</span>
        <h1>{isFarmer ? 'Manage buyer requests' : 'Track your buy requests'}</h1>
        <p>
          {isFarmer
            ? 'Buyers who want your harvest will show up here. Accept, decline, or mark a deal completed.'
            : 'Every request you send to a farmer is tracked here, along with its status.'}
        </p>
      </div>

      <div className="admin-tabs">
        {['all', 'pending', 'accepted', 'declined', 'completed'].map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)} disabled={filter === tab}>
            {tab === 'all' ? 'All' : STATUS_LABEL[tab]}
          </button>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : visibleOrders.length === 0 ? (
        <div className="empty-card">
          {isFarmer
            ? "No requests here yet. Once buyers request your harvest, they'll appear in this list."
            : "You haven't sent any requests yet. Browse products to find something you like."}
        </div>
      ) : (
        <div className="orders-list">
          {visibleOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <ProductThumb product={order.product} size={56} />
              <div className="order-card-main">
                <div className="order-card-heading">
                  <Link to={`/products/${order.product?._id}`}>
                    {order.product?.title || 'Product removed'}
                  </Link>
                  <StatusBadge status={order.status} />
                </div>
                <p className="order-card-meta">
                  {isFarmer ? `Buyer: ${order.buyer?.name}` : `Farmer: ${order.farmer?.name}`} &middot;{' '}
                  {order.quantity} {order.unit} &middot; {order.fulfillment}
                </p>
                <p className="order-card-meta">
                  📞 {order.contactPhone} &middot; requested {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {order.note && <p className="order-card-note">"{order.note}"</p>}
              </div>

              {isFarmer && order.status === 'pending' && (
                <div className="order-card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={busyId === order._id}
                    onClick={() => handleStatusChange(order._id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={busyId === order._id}
                    onClick={() => handleStatusChange(order._id, 'declined')}
                  >
                    Decline
                  </button>
                </div>
              )}

              {isFarmer && order.status === 'accepted' && (
                <div className="order-card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={busyId === order._id}
                    onClick={() => handleStatusChange(order._id, 'completed')}
                  >
                    Mark completed
                  </button>
                </div>
              )}

              {!isFarmer && order.status === 'completed' && (
                <div className="order-card-actions">
                  {order.reviewed ? (
                    <span className="badge badge-accepted">Reviewed</span>
                  ) : (
                    <ReviewForm
                      order={order}
                      onSubmitted={() =>
                        setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, reviewed: true } : o)))
                      }
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}