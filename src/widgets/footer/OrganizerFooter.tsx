import { Toolbar } from 'primereact/toolbar'

export default function OrganizerFooter() {
  return (
    <footer className="role-footer role-footer--organizer">
      <Toolbar
        start={<span className="footer-text">Organizer Desk: support-organizer@sir.local</span>}
        end={<span className="footer-text">Pilotage des evenements</span>}
      />
    </footer>
  )
}
