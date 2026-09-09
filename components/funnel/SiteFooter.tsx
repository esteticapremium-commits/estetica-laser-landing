import { funnelConfig, toPhoneHref } from '@/config/funnel';

/** Footer centrato, condiviso da landing e thank-you page. */
export function SiteFooter() {
  const hasLegal = Boolean(funnelConfig.privacyUrl || funnelConfig.cookieUrl);

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-name">{funnelConfig.brandName || 'Il centro'}</span>
        {funnelConfig.brandDetail && (
          <span className="brand-detail">{funnelConfig.brandDetail}</span>
        )}
      </div>

      {funnelConfig.locations.length > 0 && (
        <ul className="footer-locations">
          {funnelConfig.locations.map((location) => (
            <li key={location.slug}>
              <strong>{location.name}</strong>
              <span>{location.address}</span>
              {location.phone && (
                <a href={toPhoneHref(location.phone)}>{location.phone}</a>
              )}
            </li>
          ))}
        </ul>
      )}

      {funnelConfig.openingHours && (
        <p className="footer-address">{funnelConfig.openingHours}</p>
      )}

      {funnelConfig.email && (
        <div className="footer-contacts">
          <a href={`mailto:${funnelConfig.email}`}>{funnelConfig.email}</a>
        </div>
      )}

      {hasLegal && (
        <nav className="footer-legal" aria-label="Informazioni legali">
          {funnelConfig.privacyUrl && <a href={funnelConfig.privacyUrl} target="_blank" rel="noreferrer">Privacy</a>}
          {funnelConfig.cookieUrl && <a href={funnelConfig.cookieUrl} target="_blank" rel="noreferrer">Cookie</a>}
        </nav>
      )}

      <p className="footer-note">
        © {new Date().getFullYear()} {funnelConfig.centerName || 'Landing non pubblicata'}
        {funnelConfig.vatNumber ? ` · P.IVA ${funnelConfig.vatNumber}` : ''}
      </p>
    </footer>
  );
}
