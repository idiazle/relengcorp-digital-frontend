'use client'
import { useEffect, useState } from "react"
import { getUsers } from "@/app/services/userServices"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import CreateUserModal from "./_components/organisms/CreateUserModal"
import type { User, PaginatedResponse } from "./_models/user.models"
import HeaderForm from "../../../components/admin/HeaderForm"
import { Button } from "@/components/ui/button"

type UserModalMode = 'create' | 'edit' | 'view'

const UsersPage = () => {
  const [usersData, setUsersData] = useState<PaginatedResponse<User> | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<UserModalMode>('create')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const openCreateModal = () => {
    setModalMode('create')
    setSelectedUser(null)
    setOpenModal(true)
  }

  const openEditModal = (user: User) => {
    setModalMode('edit')
    setSelectedUser(user)
    setOpenModal(true)
  }

  const openViewModal = (user: User) => {
    setModalMode('view')
    setSelectedUser(user)
    setOpenModal(true)
  }

  const loadUsers = () => {
    getUsers()
      .then((response) => {
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
      <HeaderForm setOpenModal={openCreateModal} nameModule="Usuarios" />
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openViewModal(user)}>
                    Ver
                  </Button>
                  <Button size="sm" onClick={() => openEditModal(user)}>
                    Editar
                  </Button>
                </div>
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
          mode={modalMode}
          selectedUser={selectedUser}
        />
      }
    </div>
  )
}

export default UsersPage;
