import { db } from './config'

/** Firestore collection names for Marketing Hub */
export const COLLECTIONS = {
  users: 'users',
  projects: 'projects',
  categories: 'categories',
  assets: 'assets',
  updates: 'updates',
} as const

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]

export { db }
