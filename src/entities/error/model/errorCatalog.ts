export type ErrorTagSeverity =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'secondary'
  | 'contrast'

type ErrorDefinition = {
  title: string
  message: string
  icon: string
  severity: ErrorTagSeverity
}

export type ResolvedErrorDefinition = ErrorDefinition & {
  code: string
}

const ERROR_CATALOG: Record<string, ErrorDefinition> = {
  '400': {
    title: 'Requête invalide',
    message: "La requete envoyée n'est pas valide. Vérifie les informations et réessaie.",
    icon: 'pi pi-exclamation-triangle',
    severity: 'warning',
  },
  '401': {
    title: 'Authentification requise',
    message: "Tu dois etre connecte pour acceder a cette ressource.",
    icon: 'pi pi-lock',
    severity: 'warning',
  },
  '403': {
    title: 'Accès réfusé',
    message: "Tu n'as pas les permissions nécessaires pour accéder à cette page.",
    icon: 'pi pi-ban',
    severity: 'warning',
  },
  '404': {
    title: 'Page introuvable',
    message: "La page demandée n'existe pas ou a été déplacée.",
    icon: 'pi pi-search',
    severity: 'info',
  },
  '405': {
    title: 'Méthode non autorisée',
    message: "La méthode HTTP utilisée n'est pas acceptée pour cette ressource.",
    icon: 'pi pi-times-circle',
    severity: 'warning',
  },
  '408': {
    title: 'Délai dépassé',
    message: "Le serveur a mis trop de temps a répondre. Réessaie dans un instant.",
    icon: 'pi pi-clock',
    severity: 'warning',
  },
  '409': {
    title: 'Conflit de données',
    message: 'Une autre opération a créé un conflit. Actualise et réessaie.',
    icon: 'pi pi-sync',
    severity: 'warning',
  },
  '410': {
    title: 'Ressource supprimée',
    message: 'La ressource demandée a été supprimée définitivement.',
    icon: 'pi pi-trash',
    severity: 'info',
  },
  '413': {
    title: 'Contenu trop volumineux',
    message: "Le contenu envoyé depasse la taille maximale autorisée.",
    icon: 'pi pi-file',
    severity: 'warning',
  },
  '415': {
    title: 'Format non supporté',
    message: "Le format de données envoyé n'est pas supporté.",
    icon: 'pi pi-file-excel',
    severity: 'warning',
  },
  '422': {
    title: 'Validation échouée',
    message: 'Certaines données sont invalides. Corrige les champs en erreur.',
    icon: 'pi pi-pencil',
    severity: 'warning',
  },
  '429': {
    title: 'Trop de requêtes',
    message: 'Tu as effectué trop de requêtes. Attends un peu avant de réessayer.',
    icon: 'pi pi-hourglass',
    severity: 'warning',
  },
  '500': {
    title: 'Erreur interne serveur',
    message: 'Une erreur interne est survenue. Réessaie dans quelques instants.',
    icon: 'pi pi-exclamation-circle',
    severity: 'danger',
  },
  '501': {
    title: 'Fonction non implementée',
    message: "Le serveur ne supporte pas encore cette fonctionnalité.",
    icon: 'pi pi-wrench',
    severity: 'danger',
  },
  '502': {
    title: 'Passerelle invalide',
    message: 'Le serveur intermediaire a reçu une réponse invalide.',
    icon: 'pi pi-directions-alt',
    severity: 'danger',
  },
  '503': {
    title: 'Service indisponible',
    message: 'Le service est temporairement indisponible.',
    icon: 'pi pi-spin pi-spinner',
    severity: 'danger',
  },
  '504': {
    title: 'Passerelle en timeout',
    message: "Le délai d'attente avec un service distant a été dépassé.",
    icon: 'pi pi-clock',
    severity: 'danger',
  },
  offline: {
    title: 'Connexion indisponible',
    message: "Aucune connexion réseau détectée ou serveur injoignable.",
    icon: 'pi pi-wifi',
    severity: 'warning',
  },
  unexpected: {
    title: 'Erreur inattendue',
    message: "Une erreur inconnue s'est produite dans l'application.",
    icon: 'pi pi-bolt',
    severity: 'danger',
  },
}

const CLIENT_ERROR_FALLBACK: ErrorDefinition = {
  title: 'Erreur client',
  message: "La requête ne peut pas être traitée côté client.",
  icon: 'pi pi-exclamation-triangle',
  severity: 'warning',
}

const SERVER_ERROR_FALLBACK: ErrorDefinition = {
  title: 'Erreur serveur',
  message: "Le serveur rencontre un problème temporaire.",
  icon: 'pi pi-exclamation-circle',
  severity: 'danger',
}

const UNKNOWN_ERROR_FALLBACK: ErrorDefinition = {
  title: 'Erreur inconnue',
  message: 'Un problème inattendu est survenu.',
  icon: 'pi pi-question-circle',
  severity: 'secondary',
}

const HTTP_STATUS_PATTERN = /^\d{3}$/

const normalizeErrorCode = (rawCode?: string): string =>
  rawCode?.trim().toLowerCase() || 'unexpected'

export const resolveErrorDefinition = (rawCode?: string): ResolvedErrorDefinition => {
  const code = normalizeErrorCode(rawCode)
  const predefinedError = ERROR_CATALOG[code]

  if (predefinedError) {
    return { code, ...predefinedError }
  }

  if (HTTP_STATUS_PATTERN.test(code)) {
    const numericCode = Number(code)

    if (numericCode >= 400 && numericCode < 500) {
      return { code, ...CLIENT_ERROR_FALLBACK }
    }

    if (numericCode >= 500 && numericCode < 600) {
      return { code, ...SERVER_ERROR_FALLBACK }
    }
  }

  return { code, ...UNKNOWN_ERROR_FALLBACK }
}
