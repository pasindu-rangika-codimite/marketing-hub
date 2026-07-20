export const ADMIN_PROJECTS = [
  { id: 'browser-bridge', name: 'Browser Bridge', updates: 12 },
  { id: 'codimite', name: 'CODIMITE', updates: 18 },
  { id: 'chrome-readiness', name: 'Chrome readiness assessment', updates: 9 },
  { id: 'zoom', name: 'Zoom', updates: 15 },
  { id: 'commandlyne', name: 'CommandLyne', updates: 11 },
  { id: 'caprome', name: 'CAPROME', updates: 7 },
  { id: 'football-content', name: 'FOOTBALL CONTENT', updates: 10 },
  { id: 'vlauncher', name: 'VLauncher', updates: 6 },
  { id: 'cameyo', name: 'Cameyo', updates: 8 },
  { id: 'vlauncher-2', name: 'VLauncher', updates: 5 },
] as const

export type AdminProjectId = (typeof ADMIN_PROJECTS)[number]['id']

export function getAdminProjectById(id: string) {
  return ADMIN_PROJECTS.find((p) => p.id === id) ?? null
}

export function slugifyProjectName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
