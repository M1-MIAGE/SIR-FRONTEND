import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import PageContainer from '@/shared/ui/layout/PageContainer'

export default function OrganizerHomePage() {
  const navigate = useNavigate()

  return (
    <PageContainer
      title="Dashboard Organizer"
      subtitle="Contenu personnalise pour l'organisateur."
      actions={
        <Button
          label="Creer un evenement"
          icon="pi pi-plus"
          onClick={() => navigate(ROUTES.organizerCreateConcert())}
        />
      }
    >
      <div className="grid-12">
        <div className="col-12 col-lg-8">
          <Card title="Mes evenements">
            <p>Pilotage des evenements, jauges et planning de publication.</p>
            <Button
              label="Nouveau concert"
              icon="pi pi-ticket"
              text
              onClick={() => navigate(ROUTES.organizerCreateConcert())}
            />
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
