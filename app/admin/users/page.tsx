'use client'
import { useEffect, useState } from "react"
import { getUsers } from "@/app/services/userServices"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import CreateUserModal from "./components/CreateUserModal"
import type { User, PaginatedResponse } from "./models/user.models"
import HeaderForm from "../components/HeaderForm"

const UsersPage = () => {
  const [usersData, setUsersData] = useState<PaginatedResponse<User> | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)

  const loadUsers = () => {
    getUsers()
      .then((response) => {
        console.log("Fetched users:", response)
        setUsersData(response.data)
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
      })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <HeaderForm setOpenModal={setOpenModal} nameModule="Usuarios" />
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
          {usersData?.results?.map((user: User) => (
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
        <CreateUserModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          onUserCreated={loadUsers}
        />
      }
    </div>
  )
}

export default UsersPage;
