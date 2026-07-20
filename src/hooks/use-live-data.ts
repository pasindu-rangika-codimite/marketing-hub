import { useEffect, useState } from 'react'
import {
  subscribeToAllUsers,
  subscribeToCategories,
  subscribeToProjects,
  type MemberRecord,
} from '@/lib/firebase'
import type { Category, Project } from '@/types'

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
