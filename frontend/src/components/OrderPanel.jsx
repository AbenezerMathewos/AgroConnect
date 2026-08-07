import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const emptyOrderForm = { quantity: '', fulfillment: 'pickup', contactPhone: '', note: '' };

export default function OrderPanel({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyOrderForm);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [busy, setBusy] = useState(false);

  if (!product.isAvailable) {
    return (
      <div className="order-panel muted">
        <span className="eyebrow">Buy direct</span>
        <strong>Currently unavailable</strong>
        <p>This harvest is marked sold out. Check back later or browse other listings.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="order-panel">
        <span className="eyebrow">Buy direct</span>
        <h2>Interested in this harvest?</h2>
        <p>Sign in to send the farmer a request.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Sign in to request
        </button>
      </div>
    );
  }

  if (user.role !== 'buyer') return null;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await orderService.create({ ...form, productId: product._id });
      setMessage('Request sent! The farmer will contact you using your number.');
      setMessageType('success');
      setForm(emptyOrderForm);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not send request.');
      setMessageType('error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="order-panel" onSubmit={submit}>
      <span className="eyebrow">Buy direct</span>
      <h2>Request this harvest</h2>

      <div className="compact-fields">
        <input
          required
          type="number"
          min="1"
          placeholder={`Quantity (${product.unit || 'Kg'})`}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <select
          value={form.fulfillment}
          onChange={(e) => setForm({ ...form, fulfillment: e.target.value })}
        >
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
        </select>
      </div>

      <input
        required
        placeholder="Your phone number"
        value={form.contactPhone}
        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
      />

      <textarea
        placeholder="Optional note for the farmer"
        rows={3}
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />

      <button className="btn btn-primary" disabled={busy}>
        {busy ? 'Sending...' : 'Send request'}
      </button>

      {message && (
        <p className={messageType === 'error' ? 'inline-message error' : 'inline-message'}>{message}</p>
      )}
    </form>
  );
}
