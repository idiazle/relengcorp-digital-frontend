'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaEdit } from 'react-icons/fa';
import { FaEye, FaPlus, FaTrash } from 'react-icons/fa6'
import { Groups } from '../users/_models/user.models';
import { useEffect, useState } from 'react';
import { getUserGroups } from '@/app/_services/userServices';
import HeaderForm from '@/app/admin/_components/molecules/HeaderForm';


const PermissionsPage = () => {
  const [groups, setGroups] = useState<Groups[]>([]);

  useEffect(() => {
    getUserGroups()
      .then((response) => {
        console.log('Fetched groups:', response);
        setGroups(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user groups:', error);
      });
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <HeaderForm setOpenModal={() => { }} nameModule="Permisos" />
      <div className='flex-1 overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-300 hover:bg-gray-300'>
              <TableHead className='font-bold text-black'>N°</TableHead>
              <TableHead className='font-bold text-black'>Nombre del permiso</TableHead>
              <TableHead className='font-bold text-black'>Descripción</TableHead>
              <TableHead className='font-bold text-black'>Tablas de acceso</TableHead>
              <TableHead className='font-bold text-black'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              groups.map((group, index) => (
                <TableRow key={group.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>Descripción del permiso</TableCell>
                  <TableCell className='gap-1'>
                  </TableCell>
                  <TableCell className='flex flex-row gap-2'>
                    <Button><FaEye /></Button>
                    <Button ><FaEdit /></Button>
                    <Button variant="destructive"><FaTrash /></Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

    </div>
  )
}

export default PermissionsPage;
