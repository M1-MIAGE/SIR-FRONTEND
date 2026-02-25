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
    title: 'Requete invalide',
    message: "La requete envoyee n'est pas valide. Verifie les informations et reessaie.",
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
    title: 'Acces refuse',
    message: "Tu n'as pas les permissions necessaires pour acceder a cette page.",
    icon: 'pi pi-ban',
    severity: 'warning',
  },
  '404': {
    title: 'Page introuvable',
    message: "La page demandee n'existe pas ou a ete deplacee.",
    icon: 'pi pi-search',
    severity: 'info',
  },
  '405': {
    title: 'Methode non autorisee',
    message: "La methode HTTP utilisee n'est pas acceptee pour cette ressource.",
    icon: 'pi pi-times-circle',
    severity: 'warning',
  },
  '408': {
    title: 'Delai depasse',
    message: "Le serveur a mis trop de temps a repondre. Reessaie dans un instant.",
    icon: 'pi pi-clock',
    severity: 'warning',
  },
  '409': {
    title: 'Conflit de donnees',
    message: 'Une autre operation a cree un conflit. Actualise et reessaie.',
    icon: 'pi pi-sync',
    severity: 'warning',
  },
  '410': {
    title: 'Ressource supprimee',
    message: 'La ressource demandee a ete supprimee definitivement.',
    icon: 'pi pi-trash',
    severity: 'info',
  },
  '413': {
    title: 'Contenu trop volumineux',
    message: "Le contenu envoye depasse la taille maximale autorisee.",
    icon: 'pi pi-file',
    severity: 'warning',
  },
  '415': {
    title: 'Format non supporte',
    message: 'Le format de donnees envoye nest pas supporte.',
    icon: 'pi pi-file-excel',
    severity: 'warning',
  },
  '422': {
    title: 'Validation echouee',
    message: 'Certaines donnees sont invalides. Corrige les champs en erreur.',
    icon: 'pi pi-pencil',
    severity: 'warning',
  },
  '429': {
    title: 'Trop de requetes',
    message: 'Tu as effectue trop de requetes. Attends un peu avant de reessayer.',
    icon: 'pi pi-hourglass',
    severity: 'warning',
  },
  '500': {
    title: 'Erreur interne serveur',
    message: 'Une erreur interne est survenue. Reessaie dans quelques instants.',
    icon: 'pi pi-exclamation-circle',
    severity: 'danger',
  },
  '501': {
    title: 'Fonction non implemente',
    message: "Le serveur ne supporte pas encore cette fonctionnalite.",
    icon: 'pi pi-wrench',
    severity: 'danger',
  },
  '502': {
    title: 'Passerelle invalide',
    message: 'Le serveur intermediaire a recu une reponse invalide.',
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
    message: "Le delai d'attente avec un service distant a ete depasse.",
    icon: 'pi pi-clock',
    severity: 'danger',
  },
  offline: {
    title: 'Connexion indisponible',
    message: "Aucune connexion reseau detectee ou serveur injoignable.",
    icon: 'pi pi-wifi',
    severity: 'warning',
  },
  unexpected: {
    title: 'Erreur inattendue',
    message: "Une erreur non geree s'est produite dans l'application.",
    icon: 'pi pi-bolt',
    severity: 'danger',
  },
}

const CLIENT_ERROR_FALLBACK: ErrorDefinition = {
  title: 'Erreur client',
  message: "La requete ne peut pas etre traitee cote client.",
  icon: 'pi pi-exclamation-triangle',
  severity: 'warning',
}

const SERVER_ERROR_FALLBACK: ErrorDefinition = {
  title: 'Erreur serveur',
  message: "Le serveur rencontre un probleme temporaire.",
  icon: 'pi pi-exclamation-circle',
  severity: 'danger',
}

const UNKNOWN_ERROR_FALLBACK: ErrorDefinition = {
  title: 'Erreur inconnue',
  message: 'Un probleme inattendu est survenu.',
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
