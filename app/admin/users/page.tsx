'use client'
import { useEffect, useState } from "react"
import { getUsers } from "@/app/services/userServices"

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
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {
        users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id} className="mb-2 p-4 border rounded">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p>ID: {user.id}</p>
                <p>Nombre: {user.name} {user.last_name}</p>
                <p>Correo: {user.email}</p>
                <p>Rol: {user.position}</p>
                <p>Activo: {user.deleted ? "Sí" : "No"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )
      }
    </div>
  )
}

export default Users
