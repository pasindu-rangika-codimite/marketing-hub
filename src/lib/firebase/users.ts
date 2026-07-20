import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { UserProfile, UserStatus } from '@/types'
import { COLLECTIONS, db } from './firestore'

/** A users/{uid} document together with its id — for admin screens. */
export type MemberRecord = UserProfile & { uid: string }

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.users, uid))
  if (!snapshot.exists()) return null
  return snapshot.data() as UserProfile
}

/**
 * Creates the `users/{uid}` document on first sign-in with status `pending`.
 * Existing documents are left untouched so an admin's approval is never
 * overwritten by a later sign-in.
 */
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const existing = await getUserProfile(user.uid)
  if (existing) return existing

  const profile: UserProfile = {
    email: (user.email ?? '').toLowerCase(),
    displayName: user.displayName ?? user.email ?? 'User',
    photoURL: user.photoURL ?? null,
    status: 'pending',
    role: 'user',
  }

  await setDoc(doc(db, COLLECTIONS.users, user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return profile
}

/**
 * Live subscription to the user's own profile — when an admin approves the
 * account, the UI updates immediately without a refresh.
 */
export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
) {
  return onSnapshot(
    doc(db, COLLECTIONS.users, uid),
    (snapshot) => {
      callback(snapshot.exists() ? (snapshot.data() as UserProfile) : null)
    },
    () => callback(null)
  )
}

/** Live list of every user — admin only (enforced by security rules). */
export function subscribeToAllUsers(
  callback: (users: MemberRecord[]) => void
) {
  return onSnapshot(collection(db, COLLECTIONS.users), (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        uid: d.id,
        ...(d.data() as UserProfile),
      }))
    )
  })
}

/** Approve or reject a member — admin only (enforced by security rules). */
export async function setUserStatus(uid: string, status: UserStatus) {
  await updateDoc(doc(db, COLLECTIONS.users, uid), {
    status,
    updatedAt: serverTimestamp(),
  })
}
