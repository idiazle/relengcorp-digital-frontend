'use client'
import type { AdminRouter } from '../../_models/route.model'
import { ADMIN_ROUTES } from '../../_utils/routes.constant'
import SideBarButton from '../atoms/SideBarButton'

const Sidebar = () => {
  return (
    <div className="bg-[#16292f] items-center w-[220px]">
      <div className='flex flex-col w-full gap-1 '>
        {ADMIN_ROUTES.map((route: AdminRouter) => {
          return (
            <div key={route.key} className="w-full">
              <SideBarButton route={route} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar;
