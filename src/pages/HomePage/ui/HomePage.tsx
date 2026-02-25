import { useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import PageContainer from '@/shared/ui/layout/PageContainer'

type StatusOption = {
  label: string
  value: string
}

const statusOptions: StatusOption[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Actifs', value: 'active' },
  { label: 'Archives', value: 'archived' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Layout mobile-first et adaptatif."
      actions={<Button label="Nouveau" icon="pi pi-plus" />}
    >
      <div className="grid-12">
        <div className="col-12 col-lg-8">
          <Card title="Recherche">
            <div className="form-grid">
              <FloatLabel>
                <InputText
                  id="query"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <label htmlFor="query">Recherche</label>
              </FloatLabel>

              <FloatLabel>
                <Dropdown
                  id="status"
                  value={status}
                  options={statusOptions}
                  onChange={(event) => setStatus(event.value)}
                  optionLabel="label"
                  optionValue="value"
                />
                <label htmlFor="status">Statut</label>
              </FloatLabel>
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card title="Etat">
            <Tag value="Responsive OK" severity="success" />
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <Card title="KPI 1">Contenu</Card>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <Card title="KPI 2">Contenu</Card>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <Card title="KPI 3">Contenu</Card>
        </div>
      </div>
    </PageContainer>
  )
}
