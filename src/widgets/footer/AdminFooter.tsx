import { Toolbar } from 'primereact/toolbar'

export default function AdminFooter() {
  return (
    <footer className="role-footer role-footer--admin">
      <Toolbar
        start={<span className="footer-text">Admin Center: admin@sir.local</span>}
        end={<span className="footer-text">Supervision globale</span>}
      />
    </footer>
  )
}
