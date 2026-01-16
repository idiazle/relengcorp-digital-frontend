'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaRegFileLines } from 'react-icons/fa6'
import { MdOutlineDisabledVisible } from 'react-icons/md'

const Sidebar = () => {
  const getUrl = usePathname()
  const routes = [
    {
      id: 1,
      name: 'Gestión de Entidades',
      icon: <FaRegFileLines />,
      path: '/admin/entities',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 2,
      name: 'Gestión de Permisos',
      icon: <FaRegFileLines />,
      path: '/admin/permissions',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 3,
      name: 'Gestión de Usuarios',
      icon: <FaRegFileLines />,
      path: '/admin/users',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 4,
      name: 'Monitoreo de Condicion',
      icon: <FaRegFileLines />,
      path: '/admin/moncon',
      role: ['1', '2', '3'],
      enabled: true
    },
    {
      id: 5,
      name: 'Gestión de Equipos Rotatorios',
      icon: <FaRegFileLines />,
      path: '/admin/equipos-rotatorios',
      role: ['1', '2', '3'],
      enabled: true
    },
    {
      id: 6,
      name: 'Gestión de Equipos Estáticos',
      icon: <FaRegFileLines />,
      path: '/admin/equipos-estaticos',
      role: ['1', '2', '3'],
      enabled: true
    },
  ]

  return (
    <div className="bg-[#16292f] flex-col items-center sm:flex border-r h-full w-[220px]">
      <div className='flex flex-col justify-center items-center w-full p-1'>
        <Link href={'/admin'} className={`text-white flex flex-row w-full justify-start items-center gap-2 hover:bg-zinc-500 rounded p-3 ${getUrl === '/admin' ? 'bg-zinc-500' : ''}`}>
          <FaRegFileLines />
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