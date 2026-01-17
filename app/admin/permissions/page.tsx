import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table' 
import { FaEdit } from 'react-icons/fa';
import { FaEye, FaPlus, FaTrash } from 'react-icons/fa6';

const permissionsData = [
  // Aquí irían los datos de permisos, por ejemplo:
  { id: 1, name: 'SuperAdmin', description: 'Acceso completo al sistema' },
  { id: 2, name: 'Administrador', description: 'Acceso administrativo' },
  { id: 3, name: 'Editor', description: 'Acceso de edicion' },
  { id: 4, name: 'Usuario', description: 'Acceso de visualización' },
  { id: 5, name: 'Invitado', description: 'Acceso limitado' },
];

const PermissionsPage = () => {

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE PERMISOS</h1>
        <Button className=''><FaPlus /> Nuevo permiso</Button>
      </div>
      <Separator className='my-2' />
      <div className='flex-1 overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-300 hover:bg-gray-300'>
              {/* <TableHead className='font-bold text-black'>N°</TableHead> */}
              <TableHead className='font-bold text-black'>Nombre del permiso</TableHead>
              <TableHead className='font-bold text-black'>Descripción</TableHead>
              <TableHead className='font-bold text-black'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsData.map((permission, index) => (
              <TableRow key={permission.id}>
                {/* <TableCell>{index + 1}</TableCell> */}
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell className='flex flex-row gap-2'>
                  <Button><FaEye /></Button>
                  <Button ><FaEdit /></Button>
                  <Button variant="destructive"><FaTrash /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}

export default PermissionsPage;
