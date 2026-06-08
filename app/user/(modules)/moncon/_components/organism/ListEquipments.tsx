import equipmentList from '../../_mocks/EquipmentList.json'

type EquipmentItem = {
  id: number
  name: string
  status: string
  lastMaintenance: string
  nextMaintenance: string
}

const ItemList = ({ equipment }: { equipment: EquipmentItem }) => {
  return (
    <li className='border border-gray-300 p-2 rounded bg-white flex flex-row justify-between items-start'>
      <div>
        <h2 className='text-md font-semibold'>{equipment.name}</h2>
        <p><strong>Último mantenimiento:</strong> {equipment.lastMaintenance}</p>
        <p><strong>Próximo mantenimiento:</strong> {equipment.nextMaintenance}</p>
      </div>
      <div>
        <span className={`px-2 py-1 rounded text-sm ${equipment.status === 'Activo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {equipment.status === 'Activo' ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </li>
  )
}

const ListEquipments = () => {
  const equipments = equipmentList.data as EquipmentItem[]

  return (
    <div className='w-full border border-gray-300 bg-gray-100'>
      <h1 className='bg-gray-200 text-center w-full text-lg'>Lista de equipos</h1>
        <ul className='gap-1 flex-col flex overflow-y-auto'>
          {equipments.map(equipment => (
            <ItemList key={equipment.id} equipment={equipment} />
          ))}
        </ul>
      
    </div>
  )
}

export default ListEquipments;
