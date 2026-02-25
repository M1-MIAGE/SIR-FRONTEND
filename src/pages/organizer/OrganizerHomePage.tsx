import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import PageContainer from '@/shared/ui/layout/PageContainer'

export default function OrganizerHomePage() {
  return (
    <PageContainer
      title="Dashboard Organizer"
      subtitle="Contenu personnalise pour l'organisateur."
      actions={<Button label="Creer un evenement" icon="pi pi-plus" />}
    >
      <div className="grid-12">
        <div className="col-12 col-lg-8">
          <Card title="Mes evenements">
            <p>Pilotage des evenements, jauges et planning de publication.</p>
          </Card>
        </div>
        <div className="col-12 col-lg-4">
          <Card title="Statut compte">
            <Tag value="Profil ORGANIZER actif" severity="info" />
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
