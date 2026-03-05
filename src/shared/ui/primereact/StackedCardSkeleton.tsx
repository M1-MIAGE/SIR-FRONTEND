import { Card } from 'primereact/card'
import { Skeleton } from 'primereact/skeleton'

type StackedCardSkeletonProps = {
  titleWidth?: string
  tailWidth?: string
  className?: string
}

export default function StackedCardSkeleton({
  titleWidth = '14rem',
  tailWidth = '75%',
  className,
}: StackedCardSkeletonProps) {
  return (
    <Card className={className}>
      <div className="stack">
        <Skeleton height="2rem" width={titleWidth} />
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width={tailWidth} />
      </div>
    </Card>
  )
}
