import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import type { Category } from '@/types'
import { COLLECTIONS, db } from './firestore'

export const DEFAULT_CATEGORIES = [
  'UI Design',
  'Flyer',
  'Branding',
  'Social Media',
  'Presentation',
  'Research',
  'Other',
]

export function subscribeToCategories(
  callback: (categories: Category[]) => void
) {
  const q = query(collection(db, COLLECTIONS.categories), orderBy('name'))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Category, 'id'>),
      }))
    )
  })
}

export async function createCategory(name: string, createdBy: string) {
  await addDoc(collection(db, COLLECTIONS.categories), {
    name: name.trim(),
    archived: false,
    createdAt: serverTimestamp(),
    createdBy,
  })
}

export async function createDefaultCategories(createdBy: string) {
  await Promise.all(
    DEFAULT_CATEGORIES.map((name) => createCategory(name, createdBy))
  )
}

export async function renameCategory(id: string, name: string) {
  await updateDoc(doc(db, COLLECTIONS.categories, id), { name: name.trim() })
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.categories, id))
}
