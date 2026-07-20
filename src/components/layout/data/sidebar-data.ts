import { Home, Megaphone } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '@/config/app'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  // Fallback identity only — the real signed-in user from the auth store
  // takes precedence in nav-user.tsx / profile-dropdown.tsx.
  user: {
    name: 'Marketing Hub',
    email: '',
    avatar: '',
  },
  teams: [
    {
      name: APP_NAME,
      logo: Megaphone,
      plan: APP_TAGLINE,
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Home',
          url: '/home',
          icon: Home,
        },
      ],
    },
  ],
}
