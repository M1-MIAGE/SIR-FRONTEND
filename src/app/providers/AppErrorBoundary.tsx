import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorPageLayout from '@/shared/ui/errors/ErrorPageLayout'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public state: AppErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled React error:', error, errorInfo)
  }

  private resetBoundary = (): void => {
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPageLayout
          code="unexpected"
          title="Erreur React inattendue"
          message="Un composant a provoque une erreur non geree."
          icon="pi pi-bolt"
          severity="danger"
          primaryActionLabel="Reessayer"
          onPrimaryAction={this.resetBoundary}
        />
      )
    }

    return this.props.children
  }
}
