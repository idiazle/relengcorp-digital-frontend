'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaChartLine, FaBuilding, FaShieldAlt, FaUsers, FaClipboardCheck, FaCog, FaIndustry, FaPalette } from 'react-icons/fa'
import { MdOutlineDisabledVisible } from 'react-icons/md'

const Sidebar = () => {
  const getUrl = usePathname()
  const routes = [
    {
      id: 0,
      name: 'Personalización',
      icon: <FaPalette />,
      path: '/admin/customization',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 1,
      name: 'Gestión de Entidades',
      icon: <FaBuilding />,
      path: '/admin/entities',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 2,
      name: 'Gestión de Permisos',
      icon: <FaShieldAlt />,
      path: '/admin/permissions',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 3,
      name: 'Gestión de Usuarios',
      icon: <FaUsers />,
      path: '/admin/users',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 4,
      name: 'Monitoreo de Condicion',
      icon: <FaClipboardCheck />,
      path: '/admin/moncon',
      role: ['1', '2', '3'],
      enabled: true
    },
    {
      id: 5,
      name: 'Gestión de Equipos Rotatorios',
      icon: <FaCog />,
      path: '/admin/rotary-equipment',
      role: ['1', '2', '3'],
      enabled: true
    },
    {
      id: 6,
      name: 'Gestión de Equipos Estáticos',
      icon: <FaIndustry />,
      path: '/admin/static-equipment',
      role: ['1', '2', '3'],
      enabled: true
    },
  ]

  return (
    <div className="bg-[#16292f] flex-col items-center sm:flex border-r h-full w-[220px]">
      <div className='flex flex-col justify-center items-center w-full p-1 gap-2 border-b mb-2 shrink-0'>
        <Link href={'/admin'} className={`text-white flex flex-row w-full justify-start items-center gap-2 hover:bg-zinc-500 rounded p-3 ${getUrl === '/admin' ? 'bg-zinc-500' : ''}`}>
          <FaChartLine />
          <span className={'text-sm font-medium'}>
            Dashboard
          </span>
        </Link>
        {
          routes?.map((route) => {
            return (
              <Link key={route?.id} href={route?.path ?? '#'} className={`${!route?.enabled ? 'pointer-events-none text-white/50' : 'text-white'} flex flex-row w-full justify-start items-center gap-2 hover:bg-zinc-500 rounded p-3 ${getUrl === route?.path ? 'bg-zinc-500' : ''}`}>

                {route?.enabled ? route?.icon : <MdOutlineDisabledVisible color='red' />}
                <span className={'text-sm font-medium'}>
                  {route?.name}
                </span>
              </Link>
            )
          })

        }
      </div>

    </div>
  )
}

export default Sidebar