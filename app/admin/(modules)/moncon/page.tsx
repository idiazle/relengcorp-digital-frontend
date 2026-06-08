'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { FaEye, FaFilePdf, FaTrash } from 'react-icons/fa6'
import { deleteMonconReport, createMonconReport, updateReport } from '@/app/_services/monconServices'
import ReportFormModal from './_components/organisms/ReportFormModal'
import UploadReports from './_components/organisms/UploadReports'
import { UploadHistoryReports } from './_components'
import { FaEdit } from 'react-icons/fa'
import type { Report } from './_models/moncon.model'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useGetTreeEntities from './_hooks/useMonconTreeEntities.hook'
import useMonconReports from './_hooks/useMonconReports.hook'
import type { ReportModalMode } from './_hooks/useMonconReportModal'
import { getComponentName, getConditionName, getEquipmentTag, getRouteName, getTaskTypeName } from './_utils/monconRenders.utils'
import PaginationControl from './_components/molecules/PaginationControl'
import TitleSection from '../../_components/molecules/TitleSection'

const MONCON_UI = {
  SECTION: {
    title: 'Gestión de Monitoreo de Condiciones',
    firstButton: 'Nueva ruta',
    secondButton: 'Historial',
    thirdButton: 'Nuevo registro',
  },
  OPTIONS: {
    programmed: 'Programados',
    notProgrammed: 'No programados',
    history: 'Histórico',
  },
  CABECERAS: {
    number: 'N°',
    programmedDate: 'FECHA PROGR.',
    executionStatus: 'EJECUCIÓN',
    executionDate: 'FECHA EJEC.',
    equipmentTag: 'TAG EQUIPO',
    route: 'RUTA',
    component: 'COMPONENTE',
    taskType: 'TIPO TAREA',
    condition: 'CONDICIÓN',
    actions: 'ACCIONES',
  }
}

const MonconPage = () => {
  const [openReportModal, setOpenReportModal] = useState(false)
  const [modalMode, setModalMode] = useState<ReportModalMode>('create')
  const [openUploadRoute, setOpenUploadRoute] = useState<boolean>(false);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [registerSelected, setRegisterSelected] = useState<Report | null>(null);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data: paginatedData, refetch } = useMonconReports(page, limit)
  const { data: treeEntities = [] } = useGetTreeEntities()
  const reports = paginatedData?.results ?? []
  const total = paginatedData?.total ?? 0
  const totalPages = Math.ceil(total / limit)
  const programmedReports = reports.filter((report) => report.program === 1)
  const notProgrammedReports = reports.filter((report) => report.program === 2)

  const openCreateModal = () => {
    setRegisterSelected(null)
    setModalMode('create')
    setOpenReportModal(true)
  }

  const openEditModal = (report: Report) => {
    setRegisterSelected(report)
    setModalMode('edit')
    setOpenReportModal(true)
  }

  const openViewModal = (report: Report) => {
    setRegisterSelected(report)
    setModalMode('view')
    setOpenReportModal(true)
  }

  const handleDeleteRegister = (dataId: number) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      deleteMonconReport(dataId).then((response) => {
        console.log("eliminado", response)
        refetch()
      })
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TitleSection
        title={MONCON_UI.SECTION.title}
        labelFirstButton={MONCON_UI.SECTION.firstButton}
        labelSecondButton={MONCON_UI.SECTION.secondButton}
        labelThirdButton={MONCON_UI.SECTION.thirdButton}
        firstButton={() => setOpenUploadRoute(true)}
        secondButton={() => setOpenHistory(true)}
        thirdButton={openCreateModal}
      />
      <Separator className='my-2' />
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="programmed" className="w-full">
          <TabsList className="bg-gray-200 justify-start sticky top-0 z-20">
            <TabsTrigger value="programmed">{MONCON_UI.OPTIONS.programmed}</TabsTrigger>
            <TabsTrigger value="not-programmed">{MONCON_UI.OPTIONS.notProgrammed}</TabsTrigger>
            <TabsTrigger value="history">{MONCON_UI.OPTIONS.history}</TabsTrigger>
          </TabsList>
          <TabsContent value="programmed">
            <Table className="bg-white">
              <TableHeader className="bg-gray-300 sticky top-0 z-10">
                <TableRow>
                  {
                    Object.values(MONCON_UI.CABECERAS).map((header, index) => (
                      console.log(header),
                      <TableHead key={index} className={index === 0 ? "w-[50px]" : ""}>{header}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
              <TableBody>
                {programmedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      No hay registros disponibles.
                    </TableCell>
                  </TableRow>
                ) :
                  programmedReports.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{data.created_at ? data.created_at.slice(0, 10) : 'N/A'}</TableCell>
                      <TableCell>{data.execution_status === 1 ? 'Ejecutado' : 'No Ejecutado'}</TableCell>
                      <TableCell>
                        {data.execution_date ? data.execution_date.slice(0, 10) : 'N/A'}
                      </TableCell>
                      <TableCell>{getEquipmentTag(data)}</TableCell>
                      <TableCell>{getRouteName(data)}</TableCell>
                      <TableCell>{getComponentName(data)}</TableCell>
                      <TableCell>{getTaskTypeName(data.work_type)}</TableCell>
                      <TableCell>{getConditionName(data.condition)}</TableCell>
                      <TableCell className="flex flex-row gap-2">
                        <Button
                          size="sm"
                          disabled={!data.attachment}
                          onClick={() => openViewModal(data)}>
                          <FaFilePdf />
                        </Button>
                        <Button size="sm" onClick={() => openViewModal(data)}>
                          <FaEye />
                        </Button>
                        <Button size="sm" onClick={() => openEditModal(data)}>
                          <FaEdit />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRegister(data.id!)}>
                          <FaTrash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="not-programmed">
            <Table className="bg-white">
              <TableHeader className="bg-gray-300 sticky top-0 z-10">
                <TableRow>
                  {
                    Object.values(MONCON_UI.CABECERAS).map((header, index) => (
                      <TableHead key={index} className={index === 0 ? "w-[50px]" : ""}>{header}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
              <TableBody>
                {notProgrammedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      No hay registros disponibles.
                    </TableCell>
                  </TableRow>
                ) :
                  notProgrammedReports.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      {/* <TableCell>{data.program == 1 ? 'Programado' : 'No Programado'}</TableCell> */}
                      <TableCell>{data.created_at ? data.created_at.slice(0, 10) : 'N/A'}</TableCell>
                      <TableCell>{data.execution_status === 1 ? 'Ejecutado' : 'No Ejecutado'}</TableCell>
                      <TableCell>
                        {data.execution_date ? data.execution_date.slice(0, 10) : 'N/A'}
                      </TableCell>
                      <TableCell>{getEquipmentTag(data)}</TableCell>
                      <TableCell>{getRouteName(data)}</TableCell>
                      <TableCell>{getComponentName(data)}</TableCell>
                      <TableCell>{getTaskTypeName(data.work_type)}</TableCell>
                      <TableCell>{getConditionName(data.condition)}</TableCell>
                      <TableCell className="flex flex-row gap-2">
                        <Button
                          size="sm"
                          disabled={!data.attachment}
                          onClick={() => openViewModal(data)}>
                          <FaFilePdf />
                        </Button>
                        <Button size="sm" onClick={() => openViewModal(data)}>
                          <FaEye />
                        </Button>
                        <Button size="sm" onClick={() => openEditModal(data)}>
                          <FaEdit />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRegister(data.id!)}>
                          <FaTrash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="history">
            <Table className="bg-white">
              <TableHeader className="bg-gray-300 sticky top-0 z-10">
                <TableRow>
                  {
                    Object.values(MONCON_UI.CABECERAS).map((header, index) => (
                      <TableHead key={index} className={index === 0 ? "w-[50px]" : ""}>{header}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
            </Table>
          </TabsContent>
        </Tabs>

        {/* Controles de paginación */}
        <PaginationControl reports={reports} paginatedData={paginatedData} />

        {/*    <div className='flex justify-between items-center mt-4 px-4 py-3 bg-gray-100 rounded'>
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
        </div> */}
      </div>

      <ReportFormModal
        open={openReportModal}
        onOpenChange={setOpenReportModal}
        mode={modalMode}
        selectedReport={registerSelected}
        entities={treeEntities}
        onSubmit={async (data) => {
          try {
            if (modalMode === 'create') {
              await createMonconReport(data)
            } else if (modalMode === 'edit') {
              const reportId = registerSelected?.id
              if (!reportId) {
                throw new Error('No se encontró el ID del registro a actualizar')
              }

              await updateReport(reportId, data)
            }
            getAllReport()
          } catch (error) {
            console.error('Error submitting report:', error)
          }
        }}
      />

      {/* Añadir ruta de trabajo */}
      {/*   {openUploadRoute &&
        <UploadReports openUploadReports={openUploadRoute}
          setOpenUploadReports={setOpenUploadRoute}
        />
      } */}

      {/* Modal de previsualización de historial Excel */}
      {openHistory && (
        <UploadHistoryReports open={openHistory} setOpen={setOpenHistory} />
      )}
    </div >

  )
}

export default MonconPage;
