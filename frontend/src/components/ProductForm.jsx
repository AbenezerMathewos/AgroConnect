import { useState } from 'react';
import { uploadService } from '../services/uploadService';
import { resolveImageUrl } from '../utils/imageUrl';

const UNIT_OPTIONS = ['Kg', 'Quintal', 'Piece', 'Liter', 'Crate', 'Sack'];

const emptyForm = {
  title: '',
  category: '',
  price: '',
  quantity: '',
  unit: 'Kg',
  location: '',
  description: '',
  imageUrl: '',
  isAvailable: true,
};

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState({
    ...emptyForm,
    ...initialValues,
    imageUrl: initialValues?.images?.[0] || '',
    isAvailable: initialValues?.isAvailable ?? true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [localPreview, setLocalPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Could not upload that image. Try a smaller file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        images: formData.imageUrl ? [formData.imageUrl.trim()] : [],
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewSrc = localPreview || (formData.imageUrl ? resolveImageUrl(formData.imageUrl) : '');

  return (
    <form onSubmit={handleSubmit} className="auth-form product-form">
      {error && <p className="form-error">{error}</p>}

      <label htmlFor="title">Product Name</label>
      <input
        id="title"
        name="title"
        placeholder="e.g. Fresh Red Teff"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="category">Category</label>
      <input
        id="category"
        name="category"
        placeholder="e.g. Grain, Vegetable, Spice"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <div className="form-row">
        <div className="form-col">
          <label htmlFor="price">Price (ETB)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-col">
          <label htmlFor="quantity">Quantity available</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-col">
          <label htmlFor="unit">Unit</label>
          <select id="unit" name="unit" value={formData.unit} onChange={handleChange}>
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label htmlFor="location">Location</label>
      <input
        id="location"
        name="location"
        placeholder="e.g. Wolaita Sodo, Boditi"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <label htmlFor="photo">Product Photo</label>
      <div className="photo-upload">
        {previewSrc && (
          <div className="photo-upload-preview">
            <img src={previewSrc} alt="Preview" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        )}
        <div className="photo-upload-controls">
          <label htmlFor="photo" className="btn btn-secondary btn-sm photo-upload-btn">
            {uploading ? 'Uploading...' : previewSrc ? 'Change photo' : 'Upload a photo'}
          </label>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            hidden
          />
          {uploadError && <p className="form-error">{uploadError}</p>}
        </div>
      </div>

      <label htmlFor="imageUrl">...or paste an image URL instead</label>
      <input
        id="imageUrl"
        name="imageUrl"
        type="url"
        placeholder="https://..."
        value={formData.imageUrl}
        onChange={(e) => {
          setLocalPreview('');
          handleChange(e);
        }}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows={4}
        placeholder="Tell buyers about freshness, harvest date, grading..."
        value={formData.description}
        onChange={handleChange}
      />

      <label className="checkbox-row" htmlFor="isAvailable">
        <input
          id="isAvailable"
          name="isAvailable"
          type="checkbox"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        This listing is currently available for sale
      </label>

      <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}