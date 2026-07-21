import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { DailyUpdate } from '@/types'
import { COLLECTIONS, db } from './firestore'

type CreateUpdateInput = {
  title: string
  description: string
  linkUrl?: string
  projectId: string
  categoryId: string
}

export async function createUpdate(
  input: CreateUpdateInput,
  owner: { uid: string; displayName: string }
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.updates), {
    title: input.title.trim(),
    description: input.description.trim(),
    linkUrl: input.linkUrl?.trim() ?? '',
    projectId: input.projectId,
    categoryId: input.categoryId,
    assetIds: [],
    ownerUid: owner.uid,
    ownerName: owner.displayName,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/** Live list of the signed-in user's updates (sorted client-side). */
export function subscribeToMyUpdates(
  uid: string,
  callback: (updates: DailyUpdate[]) => void
) {
  const q = query(
    collection(db, COLLECTIONS.updates),
    where('ownerUid', '==', uid)
  )
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DailyUpdate, 'id'>),
      }))
    )
  })
}

/** Live list of everyone's updates — for admin views (any approved user may read). */
export function subscribeToAllUpdates(
  callback: (updates: DailyUpdate[]) => void
) {
  return onSnapshot(collection(db, COLLECTIONS.updates), (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DailyUpdate, 'id'>),
      }))
    )
  })
}

export async function updateUpdateTags(
  updateId: string,
  tags: Partial<{ projectId: string; categoryId: string }>
) {
  await updateDoc(doc(db, COLLECTIONS.updates, updateId), tags)
}

export async function deleteUpdate(updateId: string) {
  await deleteDoc(doc(db, COLLECTIONS.updates, updateId))
}
