import { useState } from 'react';
import { useCurrencyUnit } from '../context/CurrencyUnitContext';

export default function ProformaInvoiceModal({ isOpen, onClose, product }) {
  const { formatPrice } = useCurrencyUnit();
  const [invoiceQuantity, setInvoiceQuantity] = useState(25); // in Quintals

  if (!isOpen || !product) return null;

  const unitPrice = product.price || 8500;
  const subtotal = unitPrice * invoiceQuantity;
  const freightTariff = Math.round(invoiceQuantity * 380); // 380 ETB per Qtl
  const ecxClearingFee = Math.round(subtotal * 0.015); // 1.5%
  const telebirrEscrowFee = 0; // Free for farmers
  const totalAmount = subtotal + freightTariff + ecxClearingFee;

  const invoiceNumber = `ET-ECX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDateGC = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const ethYear = new Date().getFullYear() - 7;
  const currentDateEC = `10 ጳጉሜ ${ethYear} ዓ.ም (E.C.)`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card proforma-modal printable-document" onClick={(e) => e.stopPropagation()}>
        {/* Top Actions */}
        <div className="proforma-top-actions no-print">
          <div className="qty-selector-pill">
            <span>Lot Payload:</span>
            <input
              type="number"
              min="1"
              max="500"
              value={invoiceQuantity}
              onChange={(e) => setInvoiceQuantity(Math.max(1, Number(e.target.value)))}
            />
            <span>Quintals (100 Kg)</span>
          </div>

          <div className="proforma-buttons">
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              🖨️ Print / Save as PDF
            </button>
            <button className="modal-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Invoice Paper Document Body */}
        <div className="proforma-paper">
          {/* Header Banner */}
          <div className="proforma-header-section">
            <div className="proforma-gov-seal">
              <span className="seal-emblem">🇪🇹</span>
              <div>
                <h3>FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA</h3>
                <h4>Ministry of Agriculture &bull; Ethiopia Commodity Exchange (ECX) Protocol</h4>
                <small>Official Trade Clearing & Telebirr Escrow Bill of Lading</small>
              </div>
            </div>
            <div className="proforma-doc-meta">
              <div className="proforma-badge">PRO-FORMA INVOICE</div>
              <div className="doc-num"><strong>Invoice #:</strong> {invoiceNumber}</div>
              <div className="doc-date"><strong>Date (G.C.):</strong> {currentDateGC}</div>
              <div className="doc-date"><strong>Date (E.C.):</strong> {currentDateEC}</div>
            </div>
          </div>

          <hr className="proforma-divider" />

          {/* Parties Involved */}
          <div className="proforma-parties-grid">
            <div className="party-box">
              <span className="party-role">SELLER / PRODUCER (አምራች)</span>
              <strong>{product.farmer?.name || 'Alemu Tadesse (Damot Pulasa Union)'}</strong>
              <div>📍 Hub: {product.originHub || 'Wolaita Sodo, South Ethiopia'}</div>
              <div>📞 Phone: {product.farmer?.phone || '+251 911 234 567'}</div>
              <div>🛡️ MoA Farmer Reg ID: <code>#ET-SODO-F8831</code></div>
            </div>

            <div className="party-box">
              <span className="party-role">COMMODITY CLEARING & ESCROW</span>
              <strong>Telebirr Escrow Security Protocol</strong>
              <div>🏦 Escrow Account: <code>*994# / AgroConnect-Treasury</code></div>
              <div>🏢 Destination Terminal: Addis Ababa (Ehil Berenda / Bole)</div>
              <div>🚚 Freight Dispatch: Isuzu Return Fleet (Dispatched)</div>
            </div>
          </div>

          {/* Commodity Details Table */}
          <table className="proforma-items-table">
            <thead>
              <tr>
                <th>Description & ECX Grade</th>
                <th>Moisture / Purity Spec</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total (ETB)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{product.title}</strong>
                  <div className="item-sub">Grade: {product.grade || 'Grade 1 (Q1)'} &bull; Origin: {product.region || 'South Ethiopia'}</div>
                </td>
                <td>
                  <span>Moisture &le; 11.5%</span>
                  <div className="item-sub">Purity &ge; 98.5%</div>
                </td>
                <td><strong>{invoiceQuantity} {product.unit || 'Quintals'}</strong></td>
                <td>{formatPrice(unitPrice)}</td>
                <td><strong>{formatPrice(subtotal)}</strong></td>
              </tr>
              <tr>
                <td colSpan="3">
                  <strong>Return-Trip Freight Transit Tariff</strong>
                  <div className="item-sub">Wolaita Sodo ➔ Addis Ababa (330 Km Highway Corridor)</div>
                </td>
                <td>380 ETB / Qtl</td>
                <td>{formatPrice(freightTariff)}</td>
              </tr>
              <tr>
                <td colSpan="3">
                  <strong>ECX Official Warehouse Inspection & Quality Seal</strong>
                </td>
                <td>1.5% Standard</td>
                <td>{formatPrice(ecxClearingFee)}</td>
              </tr>
            </tbody>
          </table>

          {/* Financial Summary */}
          <div className="proforma-financial-summary">
            <div className="proforma-escrow-stamp">
              <div className="stamp-box">
                <span className="stamp-title">TELEBIRR ESCROW VERIFIED</span>
                <span className="stamp-code">CODE: ESC-88942-APPROVED</span>
                <small>Funds released only upon buyer delivery verification</small>
              </div>
            </div>

            <div className="summary-numbers-box">
              <div className="summary-line">
                <span>Commodity Subtotal:</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="summary-line">
                <span>Freight Logistics:</span>
                <strong>{formatPrice(freightTariff)}</strong>
              </div>
              <div className="summary-line">
                <span>ECX Clearing:</span>
                <strong>{formatPrice(ecxClearingFee)}</strong>
              </div>
              <div className="summary-line total-highlight">
                <span>Total Escrow Amount:</span>
                <strong>{formatPrice(totalAmount)}</strong>
              </div>
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="proforma-signatures">
            <div className="sig-block">
              <span className="sig-line">_____________________________</span>
              <strong>Authorized Producer / Cooperative Seal</strong>
              <small>Damot Pulasa Union &bull; Sodo Depot</small>
            </div>
            <div className="sig-block">
              <span className="sig-line">_____________________________</span>
              <strong>ECX Inspector & Escrow Officer</strong>
              <small>Addis Ababa Terminal Clearing Dept.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
