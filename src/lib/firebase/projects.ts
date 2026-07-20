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
import type { Project } from '@/types'
import { COLLECTIONS, db } from './firestore'

const PROJECT_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-amber-500',
]

export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const q = query(collection(db, COLLECTIONS.projects), orderBy('name'))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Project, 'id'>),
      }))
    )
  })
}

export async function createProject(
  name: string,
  createdBy: string,
  existingCount: number
) {
  await addDoc(collection(db, COLLECTIONS.projects), {
    name: name.trim(),
    color: PROJECT_COLORS[existingCount % PROJECT_COLORS.length],
    archived: false,
    createdAt: serverTimestamp(),
    createdBy,
  })
}

export async function renameProject(id: string, name: string) {
  await updateDoc(doc(db, COLLECTIONS.projects, id), { name: name.trim() })
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.projects, id))
}
