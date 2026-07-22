import { FirebaseError } from 'firebase/app'
import { toast } from 'sonner'

/** Friendly messages for the Firebase errors users are most likely to hit. */
const FIREBASE_MESSAGES: Record<string, string> = {
  'permission-denied': 'You do not have permission to do that.',
  unavailable: 'Connection problem — please check your internet and retry.',
  'storage/unauthorized': 'You do not have permission to upload this file.',
  'storage/quota-exceeded': 'Storage is full. Please contact an admin.',
  'storage/canceled': 'Upload was canceled.',
}

export function handleServerError(error: unknown) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  let errMsg = 'Something went wrong!'

  if (error instanceof FirebaseError) {
    errMsg = FIREBASE_MESSAGES[error.code] ?? errMsg
  }

  toast.error(errMsg)
}
