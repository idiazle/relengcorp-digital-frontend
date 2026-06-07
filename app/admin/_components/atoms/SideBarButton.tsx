import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AdminRouter } from '../../_models/route.model'

interface SideBarButtonProps {
  route: AdminRouter
}

const SideBarButton = ({ route }: SideBarButtonProps) => {
  const pathname = usePathname()

  return (
    <Link
      key={route.key}
      href={route.enabled ? route.path : '#'}
      className={`flex flex-row w-full justify-start items-center gap-2 rounded p-3 transition-colors
                    ${!route.enabled ? 'pointer-events-none text-white/40' : 'text-white hover:bg-zinc-500'} 
                    ${pathname === route.path ? 'bg-zinc-500' : ''}`}
    >
      <span className='text-sm font-medium'>{route.name}</span>
    </Link>
  )
}

export default SideBarButton