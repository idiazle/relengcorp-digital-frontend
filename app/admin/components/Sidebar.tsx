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
      name: 'Gestión de Usuarios',
      icon: <FaRegFileLines />,
      path: '/admin/users',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 2,
      name: 'Gestión de Entidades',
      icon: <FaRegFileLines />,
      path: '/admin/entities',
      role: ['1', '2'],
      enabled: true
    },
    {
      id: 3,
      name: 'Monitoreo de Condicion',
      icon: <FaRegFileLines />,
      path: '/admin/moncon',
      role: ['1', '2', '3'],
      enabled: true
    },
    {
      id: 4,
      name: 'Monitoreo de Equipos Rotatorios',
      icon: <FaRegFileLines />,
      path: '/admin/moncon-equipos-rotatorios',
      role: ['1', '2', '3'],
      enabled: true
    },
    {
      id: 5,
      name: 'Monitoreo de Equipos Estáticos',
      icon: <FaRegFileLines />,
      path: '/admin/moncon-equipos-estaticos',
      role: ['1', '2', '3'],
      enabled: true
    },
  ]

  return (
    <div className="bg-[#16292f] flex-col space-y-4 items-center py-8 sm:flex border-r border-zinc-700 h-full w-[220px]">
      <div className='flex flex-col justify-center items-start w-full'>
        <Link href={'/admin'} className='w-full hover:bg-zinc-500 rounded text-white pl-3 p-3'>
          <h1>Dashboard</h1>
        </Link>
      </div>
      <div className='flex flex-col justify-center items-center gap-3 border-y border-white w-full p-1'>
        {
          routes?.map((route) => {
            return (
              <Link key={route?.id} href={route?.path ?? '#'} className={`${!route?.enabled ? 'pointer-events-none text-white/50' : 'text-white'} flex flex-row w-full justify-between items-center gap-1 hover:bg-zinc-500 rounded p-3 pl-5 ${getUrl === route?.path ? 'bg-zinc-500' : ''}`}>

                <span className={'text-sm font-medium'}>
                  {route?.name}
                </span>
                {route?.enabled ? route?.icon : <MdOutlineDisabledVisible color='red' />}
              </Link>
            )
          })

        }
      </div>

    </div>
  )
}

export default Sidebar