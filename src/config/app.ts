export const APP_NAME = 'Marketing Hub'
export const APP_TAGLINE = 'Upload. Organize. Share progress.'

/** Google Workspace domain allowed to sign in. */
export const ALLOWED_EMAIL_DOMAIN = 'codimite.com'

/**
 * Admin allow-list. Must be kept in sync with the `isAdmin()` function in
 * firestore.rules and storage.rules — the rules are the real enforcement;
 * this list only controls what the UI shows.
 */
const ADMIN_EMAILS = [
  'pawanya.thrimawithana@codimite.com',
  'pasindu.wijegunawardhana@codimite.com',
]

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
