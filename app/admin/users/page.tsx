'use client'
import { useEffect, useState } from "react"
import { getUsers } from "@/app/services/userServices"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"

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

const Users = () => {
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
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-bold mb-4">Gestión de Entidades</h1>
        <Button size='sm' onClick={() => setOpenModal(true)} className="mb-4">Crear entidad</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
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
    </div>
  )
}

export default Users
