import { useState, useRef } from 'react';
import axios from 'axios';

const SAMPLE_DISEASES = [
  { id: 'coffee_cbd', label: '☕ Coffee Berry Disease', crop: 'Coffee', icon: '☕', desc: 'Dark sunken spots on green coffee berries' },
  { id: 'enset_bacterial_wilt', label: '🍌 Enset Bacterial Wilt', crop: 'Enset', icon: '🍌', desc: 'Yellowing wilting leaves & bacterial ooze' },
  { id: 'maize_fall_armyworm', label: '🌽 Maize Fall Armyworm', crop: 'Maize', icon: '🌽', desc: 'Chewed leaf whorl with sawdust frass' },
  { id: 'wheat_stem_rust', label: '🌾 Wheat Stem Rust (Ug99)', crop: 'Wheat', icon: '🌾', desc: 'Red-brown spore pustules on stems' },
  { id: 'ginger_bacterial_wilt', label: '🫚 Ginger Bacterial Wilt', crop: 'Ginger', icon: '🫚', desc: 'Yellowing foliage & rotting rhizome' },
  { id: 'non_agro', label: '🚗 Test Non-Agro Item (Car / Shoe / Phone)', crop: 'Non-Agro', icon: '🚗', desc: 'Test system rejection for non-crop objects' },
];

export default function AiCropScannerWidget() {
  const [selectedSample, setSelectedSample] = useState('coffee_cbd');
  const [customSymptom, setCustomSymptom] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImagePreview(event.target.result);
      // Auto-run diagnosis on uploaded file
      runDiagnosis(null, customSymptom, file.name);
    };
    reader.readAsDataURL(file);
  };

  const runDiagnosis = async (sampleId, customText, fileName) => {
    setScanning(true);
    setError('');
    setDiagnosis(null);
    setCopied(false);

    try {
      // Simulate visual scan radar delay
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const payload = {
        sampleId: sampleId !== undefined ? sampleId : selectedSample,
        symptomsText: customText !== undefined ? customText : customSymptom,
        fileName: fileName || uploadedFileName,
      };

      const res = await axios.post('/api/advisory/diagnose', payload);
      if (res.data && res.data.success) {
        setDiagnosis(res.data);
      } else {
        setError('Diagnosis failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to AI diagnostic server.');
    } finally {
      setScanning(false);
    }
  };

  const handleCopySMS = () => {
    if (diagnosis?.smsPrescriptionTemplate) {
      navigator.clipboard.writeText(diagnosis.smsPrescriptionTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="ai-scanner-widget">
      <div className="ai-scanner-header">
        <div className="scanner-badge-pill">
          <span className="live-session-dot"></span>
          <strong>AI PLANT PATHOLOGY & LEAF SCANNER</strong>
        </div>
        <h3>Instant Crop Disease Diagnosis & Validation Engine</h3>
        <p>
          Upload any plant leaf photo from your computer, choose a field sample preset, or describe visual symptoms to run the national pathology model.
        </p>
      </div>

      <div className="scanner-body-grid">
        {/* Left: Input & Leaf Preset Picker */}
        <div className="scanner-input-panel">
          {/* File Upload Dropzone */}
          <div className="scanner-upload-box" onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            {uploadedImagePreview ? (
              <div className="uploaded-preview-container">
                <img src={uploadedImagePreview} alt="Scanned plant preview" className="uploaded-preview-img" />
                <div className="uploaded-file-tag">📁 {uploadedFileName} (Click to change)</div>
              </div>
            ) : (
              <div className="upload-placeholder-cta">
                <span className="upload-camera-icon">📷</span>
                <strong>Upload Photo from PC / Storage</strong>
                <small>Supports JPG, PNG, WEBP &bull; Drag and drop</small>
              </div>
            )}
          </div>

          <label className="scanner-panel-label" style={{ marginTop: '1rem' }}>1. Or Choose Quick Field Presets:</label>
          <div className="sample-preset-grid">
            {SAMPLE_DISEASES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className={`sample-preset-card ${selectedSample === sample.id ? 'active' : ''} ${sample.id === 'non_agro' ? 'non-agro-card' : ''}`}
                onClick={() => {
                  setSelectedSample(sample.id);
                  setUploadedImagePreview(null);
                  setUploadedFileName('');
                  runDiagnosis(sample.id, '', '');
                }}
              >
                <span className="sample-icon">{sample.icon}</span>
                <div>
                  <strong>{sample.label}</strong>
                  <small>{sample.desc}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="custom-symptom-box">
            <label className="scanner-panel-label">2. Or Describe Visual Symptoms in Words:</label>
            <div className="symptom-input-row">
              <input
                type="text"
                placeholder="e.g. Yellow sticky liquid from enset, car, shoes, black spots..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runDiagnosis(null, customSymptom, '');
                  }
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => runDiagnosis(null, customSymptom, '')}
                disabled={scanning}
              >
                {scanning ? 'Scanning...' : 'Scan 🔍'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Interactive Scanner Visualizer & Diagnostic Card */}
        <div className="scanner-output-panel">
          {scanning ? (
            <div className="scanner-active-animation">
              <div className="scanner-radar-frame">
                <div className="scanner-laser-line"></div>
                <div className="scanner-target-reticle"></div>
                {uploadedImagePreview ? (
                  <img src={uploadedImagePreview} alt="Scanning target" className="radar-sample-img" />
                ) : (
                  <span className="scanning-icon">🌿</span>
                )}
              </div>
              <strong className="scanning-text">Analyzing visual morphology & pathogen biomarkers...</strong>
              <small>Validating botanical taxonomy with Ethiopian Agricultural Research catalog</small>
            </div>
          ) : error ? (
            <div className="scanner-error-card">
              <span>⚠️</span>
              <p>{error}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => runDiagnosis('coffee_cbd', '', '')}>
                Retry Diagnostic Scan
              </button>
            </div>
          ) : diagnosis ? (
            /* Check if result is NON-AGRO product */
            diagnosis.isAgroProduct === false ? (
              <div className="non-agro-rejection-card">
                <div className="rejection-icon-box">
                  <span className="rejection-badge">⚠️ VALIDATION REJECTED</span>
                  <div className="rejection-big-icon">🚫</div>
                </div>

                <div className="rejection-content">
                  <h2 className="rejection-title">{diagnosis.message}</h2>
                  <h3 className="rejection-amharic">{diagnosis.messageAm}</h3>

                  <div className="rejection-reason-box">
                    <strong>🔍 Detection Reason:</strong>
                    <p>{diagnosis.reason}</p>
                    <small>Category Detected: <code>{diagnosis.detectedCategory}</code></small>
                  </div>

                  <div className="rejection-guidance-box">
                    <strong>💡 What to do next:</strong>
                    <p>{diagnosis.guidance}</p>
                  </div>

                  <div className="rejection-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedSample('coffee_cbd');
                        runDiagnosis('coffee_cbd', '', '');
                      }}
                    >
                      🌱 Scan Real Crop (e.g. Coffee / Maize)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* REAL AGRO PRODUCT DIAGNOSIS */
              <div className="diagnosis-result-card" style={{ '--severity-color': diagnosis.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                <div className="diagnosis-card-top">
                  <div>
                    <span className="eyebrow">{diagnosis.crop} ({diagnosis.cropAm}) &bull; {diagnosis.pathogenType}</span>
                    <h2>{diagnosis.diseaseName}</h2>
                    <div className="diagnosis-multilingual-names">
                      <span>🇪🇹 {diagnosis.diseaseAm}</span>
                      <span>&bull;</span>
                      <span>Afaan Oromoo: {diagnosis.diseaseOr}</span>
                      <span>&bull;</span>
                      <span>Wolaytta: {diagnosis.diseaseWl}</span>
                    </div>
                  </div>

                  <div className="diagnosis-confidence-box">
                    <span className="confidence-num">{diagnosis.confidenceScore}</span>
                    <small>AI Confidence</small>
                  </div>
                </div>

                {/* Clinical Symptoms */}
                <div className="diagnosis-symptom-callout">
                  <strong>📋 Visual Symptoms Identified:</strong>
                  <p>{diagnosis.clinicalSymptoms.en}</p>
                  <p className="amharic-text">{diagnosis.clinicalSymptoms.am}</p>
                </div>

                {/* Treatment Protocols */}
                <div className="diagnosis-protocols-grid">
                  <div className="protocol-box organic-protocol">
                    <h4>🌿 Recommended Organic / Cultural Remedy:</h4>
                    <strong>{diagnosis.organicProtocol.title}</strong>
                    <ul>
                      {diagnosis.organicProtocol.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="protocol-box chemical-protocol">
                    <h4>🧪 Ministry of Agriculture Chemical Formulation:</h4>
                    <strong>{diagnosis.chemicalProtocol.title}</strong>
                    <div className="chem-row"><span>Formulation:</span> <strong>{diagnosis.chemicalProtocol.formulation}</strong></div>
                    <div className="chem-row"><span>Dosage:</span> <strong>{diagnosis.chemicalProtocol.dosage}</strong></div>
                    <div className="chem-row"><span>Application:</span> <strong>{diagnosis.chemicalProtocol.timing}</strong></div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="diagnosis-card-bottom">
                  <div className="research-contact">
                    <span>🏛️ Research Hub:</span> <strong>{diagnosis.accreditedResearchCenter}</strong>
                  </div>

                  <button className="btn btn-secondary btn-sm copy-sms-btn" onClick={handleCopySMS}>
                    {copied ? '✅ Prescription Copied!' : '📲 Copy SMS Prescription for Farmer Phone'}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="scanner-idle-placeholder" onClick={() => runDiagnosis('coffee_cbd', '', '')}>
              <span className="placeholder-leaf-icon">🔬</span>
              <strong>Click any crop preset or upload an image to run AI Diagnosis</strong>
              <p>Detects Coffee Berry Disease, Enset Wilt, Maize Armyworm, Wheat Rust & Ginger Rot in seconds.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
