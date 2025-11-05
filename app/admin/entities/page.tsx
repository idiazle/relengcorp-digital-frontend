'use client'
import { useEffect, useState } from "react"
import { getEntities } from "@/app/services/entitiesServices"

type Entity = {
  id: number
  name: string
  type: string
  attachment ?: File
  parent?: number
  children?: Entity[]
  extra_info?: string
  deleted?: boolean
}

const Entities = () => {
  const [entities, setEntities] = useState<Entity[]>([])

  useEffect(() => {
    getEntities()
      .then((response) => {
        console.log("Fetched entities:", response)
        setEntities(response.data)
      })
      .catch((error) => {
        console.error("Error fetching entities:", error)
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Entidades</h1>
      {
        entities.length > 0 ? (
          <ul>
            {entities.map((entity) => (
              <li key={entity.id} className="mb-2 p-4 border rounded">
                <h2 className="text-xl font-semibold">{entity.name}</h2>
                <p>ID: {entity.id}</p>
                <p>Nombre: {entity.name}</p>
                <p>Tipo: {entity.type}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No entities found.</p>
        )
      }
    </div>
  )
}

export default Entities
