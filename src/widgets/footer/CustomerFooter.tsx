import { Toolbar } from 'primereact/toolbar'

export default function CustomerFooter() {
  return (
    <footer className="role-footer role-footer--customer">
      <Toolbar
        start={<span className="footer-text">Customer Support: support-customer@sir.local</span>}
        end={<span className="footer-text">Experience client</span>}
      />
    </footer>
  )
}
