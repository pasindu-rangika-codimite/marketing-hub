export { firebaseApp, auth, db, storage } from './config'
export {
  DomainNotAllowedError,
  isAllowedEmail,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthChanges,
} from './auth'
export { COLLECTIONS } from './firestore'
export {
  ensureUserProfile,
  getUserProfile,
  setUserStatus,
  subscribeToAllUsers,
  subscribeToUserProfile,
  type MemberRecord,
} from './users'
export {
  createProject,
  deleteProject,
  renameProject,
  subscribeToProjects,
} from './projects'
export {
  createCategory,
  createDefaultCategories,
  deleteCategory,
  renameCategory,
  subscribeToCategories,
  DEFAULT_CATEGORIES,
} from './categories'
export {
  deleteAsset,
  fileTypeLabel,
  formatFileSize,
  MAX_FILE_SIZE_BYTES,
  subscribeToAllAssets,
  subscribeToMyAssets,
  updateAssetTags,
  uploadAsset,
} from './assets'
export {
  createUpdate,
  deleteUpdate,
  subscribeToAllUpdates,
  subscribeToMyUpdates,
  updateUpdateTags,
} from './updates'
