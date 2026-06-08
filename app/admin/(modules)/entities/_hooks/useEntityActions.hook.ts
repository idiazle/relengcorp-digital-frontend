import { useState } from 'react'
import { createEntity, deleteEntity, updateEntity } from '@/app/_services/entitiesServices'
import type { Entity } from '../_models/entity.model'

export const useEntityActions = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (data: Entity) => {
    setIsLoading(true)
    setError(null)
    try {
      await createEntity(data)
      console.log('Entidad creada exitosamente')
      onSuccess?.()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la entidad'
      setError(errorMessage)
      console.error('Error creating entity:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta entidad?')) return false

    setIsLoading(true)
    setError(null)
    try {
      await deleteEntity(id)
      console.log('Entidad eliminada exitosamente')
      onSuccess?.()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la entidad'
      setError(errorMessage)
      console.error('Error deleting entity:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: number, data: Entity) => {
    setIsLoading(true)
    setError(null)
    try {
      await updateEntity(id, data)
      console.log('Entidad actualizada exitosamente')
      onSuccess?.()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la entidad'
      setError(errorMessage)
      console.error('Error updating entity:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { handleCreate, handleDelete, handleUpdate, isLoading, error }
}
