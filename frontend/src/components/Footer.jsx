import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>🌱 {t('brandName')}</span>
        <span>Empowering smallholders, cooperative unions & wholesale buyers across all regions of Ethiopia.</span>
        <span>&copy; {new Date().getFullYear()} {t('brandName')} &middot; Telebirr & CBE Escrow Protected</span>
      </div>
    </footer>
  );
}

