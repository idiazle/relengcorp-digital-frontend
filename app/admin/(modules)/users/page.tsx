 'use client'
import useActionsModal from './_hooks/useActionsModal'
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import CreateUserModal from "./_components/organisms/CreateUserModal"
import type { User } from "./_models/user.models"
import HeaderForm from "@/app/admin/_components/molecules/HeaderForm"
import { Button } from "@/components/ui/button"
import { FaSpinner } from "react-icons/fa6"
import useGetUsers from "./_hooks/useGetUsers.hook"

const UsersPage = () => {
  const { openModal, modalMode, selectedUser, setOpenModal, openCreateModal, openEditModal, openViewModal } = useActionsModal()
  const { data, isLoading, refetch } = useGetUsers()

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-4">
            <FaSpinner className="animate-spin mx-auto mb-2" size={24} />
            Cargando usuarios...
          </TableCell>
        </TableRow>
      )
    }

    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-4">
            No se encontraron usuarios
          </TableCell>
        </TableRow>
      )
    }

    return data.map((user: User, index: number) => (
      <TableRow key={user.id}>
        <TableCell>{index + 1}</TableCell>
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
    ))
  }

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
          {renderRows()}
        </TableBody>
      </Table>

      <CreateUserModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onUserCreated={refetch}
        mode={modalMode ?? 'create'}
        selectedUser={selectedUser}
      />
    </div>
  )
}

export default UsersPage;
