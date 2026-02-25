import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import PageContainer from '@/shared/ui/layout/PageContainer'

export default function AdminHomePage() {
  return (
    <PageContainer
      title="Dashboard Admin"
      subtitle="Contenu personnalise pour l'administration."
      actions={<Button label="Audit systeme" icon="pi pi-shield" />}
    >
      <div className="grid-12">
        <div className="col-12 col-lg-8">
          <Card title="Supervision globale">
            <p>Suivi plateforme, incidents critiques et operations sensibles.</p>
          </Card>
        </div>
        <div className="col-12 col-lg-4">
          <Card title="Statut compte">
            <Tag value="Profil ADMIN actif" severity="danger" />
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
