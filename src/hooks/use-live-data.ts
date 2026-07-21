import { useEffect, useState } from 'react'
import {
  subscribeToAllAssets,
  subscribeToAllUpdates,
  subscribeToAllUsers,
  subscribeToCategories,
  subscribeToMyAssets,
  subscribeToMyUpdates,
  subscribeToProjects,
  type MemberRecord,
} from '@/lib/firebase'
import type { Asset, Category, DailyUpdate, Project } from '@/types'

/** Live list of all users (admin screens only — rules enforce this). */
export function useAllUsers() {
  const [users, setUsers] = useState<MemberRecord[] | null>(null)

  useEffect(() => subscribeToAllUsers(setUsers), [])

  return { users: users ?? [], isLoading: users === null }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => subscribeToProjects(setProjects), [])

  return { projects: projects ?? [], isLoading: projects === null }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[] | null>(null)

  useEffect(() => subscribeToCategories(setCategories), [])

  return { categories: categories ?? [], isLoading: categories === null }
}

/** The signed-in user's own uploads, live. Pass a falsy uid to pause. */
export function useMyAssets(uid: string | undefined) {
  const [assets, setAssets] = useState<Asset[] | null>(null)

  useEffect(() => {
    if (!uid) return
    return subscribeToMyAssets(uid, setAssets)
  }, [uid])

  return { assets: assets ?? [], isLoading: assets === null }
}

/** The signed-in user's own updates/links, live. Pass a falsy uid to pause. */
export function useMyUpdates(uid: string | undefined) {
  const [updates, setUpdates] = useState<DailyUpdate[] | null>(null)

  useEffect(() => {
    if (!uid) return
    return subscribeToMyUpdates(uid, setUpdates)
  }, [uid])

  return { updates: updates ?? [], isLoading: updates === null }
}

/** Everyone's uploads, live — for admin views. */
export function useAllAssets() {
  const [assets, setAssets] = useState<Asset[] | null>(null)

  useEffect(() => subscribeToAllAssets(setAssets), [])

  return { assets: assets ?? [], isLoading: assets === null }
}

/** Everyone's updates, live — for admin views. */
export function useAllUpdates() {
  const [updates, setUpdates] = useState<DailyUpdate[] | null>(null)

  useEffect(() => subscribeToAllUpdates(setUpdates), [])

  return { updates: updates ?? [], isLoading: updates === null }
}
