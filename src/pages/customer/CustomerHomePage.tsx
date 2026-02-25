import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import PageContainer from '@/shared/ui/layout/PageContainer'

export default function CustomerHomePage() {
  return (
    <PageContainer
      title="Dashboard Customer"
      subtitle="Contenu personnalise pour le client."
      actions={<Button label="Reserver un billet" icon="pi pi-ticket" />}
    >
      <div className="grid-12">
        <div className="col-12 col-lg-8">
          <Card title="Mes reservations">
            <p>Suivi des reservations et historique des achats.</p>
          </Card>
        </div>
        <div className="col-12 col-lg-4">
          <Card title="Statut compte">
            <Tag value="Profil CUSTOMER actif" severity="success" />
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
