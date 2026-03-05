/**
 * Locale-aware formatter for generic numeric values (French locale).
 */
export const numberFormatter = new Intl.NumberFormat('fr-FR')

/**
 * Locale-aware formatter for EUR currency values.
 */
export const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

/**
 * Locale-aware formatter for percentages with one decimal.
 */
export const percentFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/**
 * Locale-aware formatter for date and time values.
 */
export const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})
