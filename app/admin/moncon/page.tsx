'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { FaCircle, FaEye, FaFilePdf, FaPlus, FaTrash, FaUpload } from 'react-icons/fa6'
import { deleteMonconReport, getMonconReports } from '../../services/monconServices'
import { getEntities } from '@/app/services/entitiesServices'
import PDFViewer from '../components/PDFViewer'
import CreateReportDialog from './components/CreateReportDialog'
import UploadReports from './components/UploadReports'
import { FaEdit } from 'react-icons/fa'
import type { Entity } from '../entities/models/entity.model'
import { works } from './models/moncon.models'
import type { Report } from './models/moncon.models'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditReportDialog from './components/EditReportDialog'
import ViewReportDialog from './components/ViewReportDialog'

const MonconPage = () => {
  const [openNewRegister, setOpenNewRegister] = useState<boolean>(false);
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [openUploadRoute, setOpenUploadRoute] = useState<boolean>(false);
  const [registerSelected, setRegisterSelected] = useState<Report | null>(null);
  const [openEditRegister, setOpenEditRegister] = useState<boolean>(false);
  const [openViewRegister, setOpenViewRegister] = useState<boolean>(false);
  const [programmedReports, setProgrammedReports] = useState<Report[]>([]);
  const [notProgrammedReports, setNotProgrammedReports] = useState<Report[]>([]);
  const [allEntities, setAllEntities] = useState<Entity[]>([]);

  const getAllReport = () => {
    getMonconReports()
      .then((response) => {
        setProgrammedReports(response.data.results.filter((report: Report) => report.program === 1));
        setNotProgrammedReports(response.data.results.filter((report: Report) => report.program === 2));
      });
  }

  useEffect(() => {
    getAllReport();
    getEntities().then(response => {
      setAllEntities(response.data.results)
    }).catch(error => {
      console.error('Error al obtener los equipos y componentes:', error)
    })
  }, []);

  const handleDeleteRegister = (dataId: number) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      deleteMonconReport(dataId).then((response) => {
        console.log("eliminado", response)
        getAllReport()
      })
    }
  };

  console.log('no programados', notProgrammedReports)

  const getTaskTypeName = (taskTypeCode: number) => {
    return works.find((tarea) => tarea.id === taskTypeCode)?.name || 'Desconocido'
  };

  const getEquipmentTag = (report: Report) => {
    const routeOrEquipmentTag = report.parents?.find((entity) => entity.type === 3 || entity.type === 4)?.tag
    return routeOrEquipmentTag || 'N/A'
  }

  const getCurrentName = (report: Report) => {
    const currentEntity = allEntities.find((entity) => entity.id === report.entity)?.name
    if (currentEntity) return currentEntity

    if (report.name) return report.name

    const currentFromParents = report.parents?.find((entity) => entity.type === 6 || entity.type === 5)?.name
    return currentFromParents || 'N/A'
  }

  const getConditionName = (conditionCode: number) => {
    switch (conditionCode) {
      case 1:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-green-500' />
            <h1>Normal</h1>
          </div>
        );
      case 2:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-yellow-500' />
            <h1>Tolerable</h1>
          </div>
        );
      case 3:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-orange-500' />
            <h1>Precaución</h1>
          </div>
        );
      case 4:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-red-500' />
            <h1>Crítico</h1>
          </div>
        );
      default:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-gray-500' />
            <h1>Desconocido</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE MONITOREO DE CONDICIONES</h1>
        <div className='flex flex-row items-center gap-2'>
          <Button onClick={() => { console.log('Subiendo archivo', setOpenUploadRoute(true)) }}><FaUpload /> Nueva ruta</Button>
          <Button onClick={() => { setOpenNewRegister(true) }}><FaPlus /> Nuevo registro</Button>
        </div>
      </div>
      <Separator className='my-2' />
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="programmed" className="w-full">
          <TabsList className="bg-gray-200 justify-start sticky top-0 z-20">
            <TabsTrigger value="programmed">Programados</TabsTrigger>
            <TabsTrigger value="not-programmed">No programados</TabsTrigger>
          </TabsList>
          <TabsContent value="programmed">
            <Table className="bg-white">
              <TableHeader className="bg-gray-300 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[50px]">N°</TableHead>
                  <TableHead>FECHA PROGR.</TableHead>
                  <TableHead>EJECUCIÓN</TableHead>
                  <TableHead>FECHA EJEC.</TableHead>
                  <TableHead>TAG EQUIPO</TableHead>
                  <TableHead>COMP/ITEM</TableHead>
                  <TableHead>TIPO TAREA</TableHead>
                  <TableHead>CONDICIÓN</TableHead>
                  <TableHead>ACCIONES</TableHead>
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
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.created_at ? data.created_at.slice(0, 10) : 'N/A'}</TableCell>
                      <TableCell>{data.execution_status === 1 ? 'Ejecutado' : 'No Ejecutado'}</TableCell>
                      <TableCell>
                        {data.execution_date ? data.execution_date.slice(0, 10) : 'N/A'}
                      </TableCell>
                      <TableCell>{getEquipmentTag(data)}</TableCell>
                      <TableCell>{getCurrentName(data)}</TableCell>
                      <TableCell>{getTaskTypeName(data.work_type)}</TableCell>
                      <TableCell>{getConditionName(data.condition)}</TableCell>
                      <TableCell className="flex flex-row gap-2">
                        <Button
                          size="sm"
                          disabled={!data.attachment}
                          onClick={() => { setOpenPDF(true); setRegisterSelected(data) }}>
                          <FaFilePdf />
                        </Button>
                        <Button size="sm"
                          onClick={() => {
                            setRegisterSelected(data);
                            setOpenViewRegister(true)
                          }}>
                          <FaEye />
                        </Button>
                        <Button size="sm"
                          onClick={() => {
                            setRegisterSelected(data);
                            setOpenEditRegister(true)
                          }}>
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
                  <TableHead className="w-[50px]">N°</TableHead>
                  {/* <TableHead>PROGRAMA</TableHead> */}
                  <TableHead>FECHA PROGR.</TableHead>
                  <TableHead>EJECUCIÓN</TableHead>
                  <TableHead>FECHA EJEC.</TableHead>
                  <TableHead>TAG EQUIPO</TableHead>
                  <TableHead>COMP/ITEM</TableHead>
                  <TableHead>TIPO TAREA</TableHead>
                  <TableHead>CONDICIÓN</TableHead>
                  <TableHead>ACCIONES</TableHead>
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
                      <TableCell>{index + 1}</TableCell>
                      {/* <TableCell>{data.program == 1 ? 'Programado' : 'No Programado'}</TableCell> */}
                      <TableCell>{data.created_at ? data.created_at.slice(0, 10) : 'N/A'}</TableCell>
                      <TableCell>{data.execution_status === 1 ? 'Ejecutado' : 'No Ejecutado'}</TableCell>
                      <TableCell>
                        {data.execution_date ? data.execution_date.slice(0, 10) : 'N/A'}
                      </TableCell>
                      <TableCell>{getEquipmentTag(data)}</TableCell>
                      <TableCell>{getCurrentName(data)}</TableCell>
                      <TableCell>{getTaskTypeName(data.work_type)}</TableCell>
                      <TableCell>{getConditionName(data.condition)}</TableCell>
                      <TableCell className="flex flex-row gap-2">
                        <Button
                          size="sm"
                          disabled={!data.attachment}
                          onClick={() => { setOpenPDF(true); setRegisterSelected(data) }}>
                          <FaFilePdf />
                        </Button>
                        <Button size="sm"
                          onClick={() => {
                            setRegisterSelected(data);
                            setOpenViewRegister(true)
                          }}>
                          <FaEye />
                        </Button>
                        <Button size="sm"
                          onClick={() => {
                            setRegisterSelected(data);
                            setOpenEditRegister(true)
                          }}>
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
        </Tabs>

      </div>

      {openNewRegister &&
        <CreateReportDialog
          openNewRegister={openNewRegister}
          setOpenNewRegister={setOpenNewRegister}
          getAllReport={getAllReport}
          entities={allEntities}
        />
      }

      {openEditRegister &&
        <EditReportDialog
          openEditRegister={openEditRegister}
          setOpenEditRegister={setOpenEditRegister}
          registerSelected={registerSelected}
          setRegisterSelected={setRegisterSelected}
          getAllReport={getAllReport}
        />
      }

      {openViewRegister &&
        <ViewReportDialog
          openViewRegister={openViewRegister}
          setOpenViewRegister={setOpenViewRegister}
          registerSelected={registerSelected}
          setRegisterSelected={setRegisterSelected}
        />
      }

      {/* Añadir ruta de trabajo */}
      {openUploadRoute &&
        <UploadReports openUploadReports={openUploadRoute}
          setOpenUploadReports={setOpenUploadRoute}
          getAllReport={getAllReport}
        />
      }

      {openPDF &&
        <PDFViewer
          urlPDF={registerSelected?.attachment}
          openDialog={openPDF}
          setOpenDialog={setOpenPDF}
        />
      }
    </div >

  )
}

export default MonconPage;
