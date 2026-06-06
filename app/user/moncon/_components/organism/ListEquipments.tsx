

import equipmentList from '../../_mocks/EquipmentList.json'

type EquipmentItem = {
  id: number
  name: string
  status: string
  lastMaintenance: string
  nextMaintenance: string
}

const ListEquipments = () => {
  const equipments = equipmentList.data as EquipmentItem[]

  return (
    <div className='w-full h-full border border-gray-300 bg-green-100'>
      <h1 className='bg-gray-200 text-center w-full text-lg'>Lista de equipos</h1>
      <div className='p-2'>
        <ul className='space-y-2'>
          {equipments.map((equipment) => (
            <li key={equipment.id} className='rounded border border-gray-300 bg-white p-2'>
              <p className='font-semibold'>{equipment.name}</p>
              <p className='text-sm'>Estado: {equipment.status}</p>
              <p className='text-sm'>Ultimo mantenimiento: {equipment.lastMaintenance}</p>
              <p className='text-sm'>Proximo mantenimiento: {equipment.nextMaintenance}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ListEquipments;
