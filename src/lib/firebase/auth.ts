import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth'
import { ALLOWED_EMAIL_DOMAIN } from '@/config/app'
import { auth } from './config'

/** Thrown when a Google account outside the company domain tries to sign in. */
export class DomainNotAllowedError extends Error {
  constructor() {
    super(`Only @${ALLOWED_EMAIL_DOMAIN} Google accounts are allowed.`)
    this.name = 'DomainNotAllowedError'
  }
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)
}

/**
 * Signs in with Google. The `hd` hint asks Google to pre-filter to company
 * accounts, but it is only a hint — the explicit email check below (and the
 * Firestore security rules on the server) are the real enforcement.
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    hd: ALLOWED_EMAIL_DOMAIN,
    prompt: 'select_account',
  })

  const credential = await signInWithPopup(auth, provider)

  if (!isAllowedEmail(credential.user.email)) {
    await signOut(auth)
    throw new DomainNotAllowedError()
  }

  return credential
}

export async function signOutUser() {
  return signOut(auth)
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback)
}
