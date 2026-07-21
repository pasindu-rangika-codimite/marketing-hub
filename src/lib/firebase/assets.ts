import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import type { Asset } from '@/types'
import { COLLECTIONS, db } from './firestore'
import { storage } from './config'

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // keep in sync with storage.rules

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function fileTypeLabel(fileName: string): string {
  const ext = fileName.split('.').pop()
  return ext ? ext.toUpperCase() : 'FILE'
}

type UploadCallbacks = {
  onProgress?: (percent: number) => void
}

/**
 * Uploads a file to Storage under assets/{uid}/{assetId}/{fileName} and
 * writes its metadata document to the `assets` collection.
 */
export async function uploadAsset(
  file: File,
  owner: { uid: string; displayName: string },
  tags: { projectId: string; categoryId: string },
  callbacks: UploadCallbacks = {}
): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`"${file.name}" is larger than the 50 MB limit.`)
  }

  const assetRef = doc(collection(db, COLLECTIONS.assets))
  const storagePath = `assets/${owner.uid}/${assetRef.id}/${file.name}`
  const storageRef = ref(storage, storagePath)

  const task = uploadBytesResumable(storageRef, file)

  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        const percent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        callbacks.onProgress?.(percent)
      },
      reject,
      () => resolve()
    )
  })

  const downloadURL = await getDownloadURL(storageRef)

  await setDoc(assetRef, {
    fileName: file.name,
    fileType: fileTypeLabel(file.name),
    fileSizeBytes: file.size,
    storagePath,
    downloadURL,
    projectId: tags.projectId,
    categoryId: tags.categoryId,
    ownerUid: owner.uid,
    ownerName: owner.displayName,
    createdAt: serverTimestamp(),
  })

  return assetRef.id
}

/** Live list of the signed-in user's uploads (sorted client-side). */
export function subscribeToMyAssets(
  uid: string,
  callback: (assets: Asset[]) => void
) {
  const q = query(
    collection(db, COLLECTIONS.assets),
    where('ownerUid', '==', uid)
  )
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Asset, 'id'>),
      }))
    )
  })
}

/** Live list of everyone's uploads — for admin views (any approved user may read). */
export function subscribeToAllAssets(callback: (assets: Asset[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.assets), (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Asset, 'id'>),
      }))
    )
  })
}

export async function updateAssetTags(
  assetId: string,
  tags: Partial<{ projectId: string; categoryId: string }>
) {
  await updateDoc(doc(db, COLLECTIONS.assets, assetId), tags)
}

/** Removes both the metadata document and the file in Storage. */
export async function deleteAsset(asset: Asset) {
  await deleteDoc(doc(db, COLLECTIONS.assets, asset.id))
  try {
    await deleteObject(ref(storage, asset.storagePath))
  } catch {
    // The document is the source of truth; a leftover storage object for a
    // deleted doc is harmless and can be cleaned up manually if ever needed.
  }
}
