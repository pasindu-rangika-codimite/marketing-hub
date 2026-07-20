/** Shared types for Marketing Hub — extend as features are built */

export type UserRole = 'admin' | 'user'

export type UserStatus = 'pending' | 'approved' | 'rejected'

/** Shape of a `users/{uid}` document in Firestore. */
export interface UserProfile {
  email: string
  displayName: string
  photoURL: string | null
  status: UserStatus
  role: UserRole
  createdAt?: unknown
  updatedAt?: unknown
}

/** The signed-in user as held in the auth store. */
export interface AppUser {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  status: UserStatus
  role: UserRole
  /** True when the email is on the admin allow-list (see src/config/app.ts). */
  isAdmin: boolean
}

export interface Project {
  id: string
  name: string
  color: string
  archived: boolean
  createdAt?: unknown
  createdBy?: string
}

export interface Category {
  id: string
  name: string
  archived: boolean
  createdAt?: unknown
  createdBy?: string
}

export interface Asset {
  id: string
  fileName: string
  fileType: string
  fileSizeBytes: number
  storagePath: string
  downloadURL: string
  projectId: string
  categoryId: string
  ownerUid: string
  ownerName: string
  createdAt?: unknown
}

export interface DailyUpdate {
  id: string
  title: string
  description: string
  linkUrl?: string
  projectId: string
  categoryId: string
  assetIds: string[]
  ownerUid: string
  ownerName: string
  createdAt?: unknown
}
