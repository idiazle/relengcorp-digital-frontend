import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Report } from '../../_models/moncon.model'

interface PaginationControlProps {
  reports: Report[]
  paginatedData: any
}

const PaginationControl = ({ reports, paginatedData }: PaginationControlProps) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const total = paginatedData?.total ?? 0
  const totalPages = Math.ceil(total / limit)
  return (
    <div className='flex justify-between items-center mt-4 px-4 py-3 bg-gray-100 rounded'>
      <div className='text-sm text-gray-600'>
        Mostrando {reports.length === 0 ? 0 : (page - 1) * limit + 1} a {Math.min(page * limit, total)} de {total} registros
      </div>
      <div className='flex gap-2 items-center'>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}
          className='px-2 py-1 border rounded text-sm'
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span className='text-sm text-gray-600'>
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

export default PaginationControl