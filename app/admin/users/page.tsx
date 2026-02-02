'use client'
import { useEffect, useState } from "react"
import { getUsers } from "@/app/services/userServices"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import CreateUserModal from "./components/CreateUserModal"
import { FaPlus } from "react-icons/fa6"
import { Separator } from "@/components/ui/separator"

type User = {
  id: number
  name: string
  last_name: string
  username: string
  dui: string
  short_name: string
  position: string
  email: string
  phone: string
  deleted: boolean
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    getUsers()
      .then((response) => {
        console.log("Fetched users:", response)
        setUsers(response.data)
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
      })
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE USUARIOS</h1>
        <Button className='' onClick={() => { setOpenModal(true) }}><FaPlus /> Nuevo usuario</Button>
      </div>
      <Separator className='my-2' />
      <Table className="max-h-[90vh]">
        <TableHeader className="bg-gray-300 sticky top-0">
          <TableRow>
            <TableCell className="font-bold">Id</TableCell>
            <TableCell className="font-bold">Nombre</TableCell>
            <TableCell className="font-bold">Apellido</TableCell>
            <TableCell className="font-bold">Usuario</TableCell>
            <TableCell className="font-bold">Rol</TableCell>
            <TableCell className="font-bold">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.position}</TableCell>
              <TableCell>
                {/* Acciones buttons or links can be added here */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        <CreateUserModal openModal={openModal} setOpenModal={setOpenModal} />
      }
    </div>
  )
}

export default UsersPage;
