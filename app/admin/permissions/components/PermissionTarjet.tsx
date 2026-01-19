
const PermissionTarjet = (information) => {
  return (
    <div className='flex flex-col gap-2 rounded max-h-48 w-48 justify-center items-center border border-gray-300 overflow-auto'>
      <h1 className='font-bold bg-gray-300 w-full text-center'>{information.name}</h1>
      <div className='flex flex-row gap-2'>
        {
          information.permissions.map((permission, index) => (
            <span key={index}>{permission}</span>
          ))
        }
      </div>
    </div>
  )
}

export default PermissionTarjet