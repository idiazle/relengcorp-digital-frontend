'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { FaCircle, FaEye, FaFilePdf, FaPencil, FaPlus, FaTrash, FaUpload } from 'react-icons/fa6'
import { deleteMonconReport, getMonconReports } from '../../services/monconServices'
import { getEntities } from '@/app/services/entitiesServices'
import { Entity } from '@/lib/types'
import PDFViewer from '../components/PDFViewer'
import ReportDialogView from './components/report-dialog-view'
import ReportDialogEdit from './components/report-dialog-edit'
import CreateReportDialog from './components/CreateReportDialog'
import UploadReports from './components/UploadReports'
import { FaEdit } from 'react-icons/fa'
import { Report } from '../utils/moncon.types'
import { Equipment } from '../utils/types'

const MonconPage = () => {
  const [entities, setEntities] = useState<Equipment[]>([]);
  const [openNewRegister, setOpenNewRegister] = useState<boolean>(false);
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [openUploadRoute, setOpenUploadRoute] = useState<boolean>(false);
  const [registerSelected, setRegisterSelected] = useState<Report | null>(null);
  const [openEditRegister, setOpenEditRegister] = useState<boolean>(false);
  const [openViewRegister, setOpenViewRegister] = useState<boolean>(false);
  const [generalData, setGeneralData] = useState<Report[]>([]);

  console.log("generalData", generalData)

  const getAllReport = () => {
    getMonconReports()
      .then((response) => {
        setGeneralData(response.data);
      });
  }

  useEffect(() => {
    getAllReport();
  }, []);

  useEffect(() => {
    if(!openNewRegister) {
    getEntities().then((response) => {
        const filtered = response.data.filter((ent: Equipment) => ent.type === 3)
        setEntities(filtered)
        console.log("entities", filtered)
      })
      .catch((error) => {
        console.error("Error fetching entities:", error)
      })
    }
  }, [openNewRegister]);


  const handleDeleteRegister = (index: number, dataId: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      deleteMonconReport(dataId).then((response) => {
        console.log("eliminado", response)
        getAllReport()
      })
    }
  };

  const getTaskTypeName = (taskTypeCode: number) => {
    switch (taskTypeCode) {
      case 1:
        return 'Vibraciones y Temperatura';
      case 2:
        return 'Alineamiento de Ejes';
      case 3:
        return 'Alineamiento de Poleas';
      case 4:
        return 'Ultrasonido acústico';
      case 5:
        return 'Termografía infrarroja';
      case 6:
        return 'Fuga de corriente';
      case 7:
        return 'Vibraciones fases';
      case 8:
        return 'Vibraciones ODS';
      case 9:
        return 'Vibraciones Pump Test';
      case 10:
        return 'Ultrasonido Convencional';
      case 11:
        return 'Tintes penetrantes';
      case 12:
        return 'Partículas magnéticas';
      case 13:
        return 'Ultrasonido avanzado';
      case 14:
        return 'Metrología';
      case 15:
        return 'Inspección visual';
      default:
        return 'Desconocido';
    }
  };

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
        <Table className="bg-white">
          <TableHeader className="bg-gray-300 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[50px]">N°</TableHead>
              {/* <TableHead>NOMBRE REPORTE</TableHead> */}
              <TableHead>PROGRAMA</TableHead>
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
            {generalData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                {/* <TableCell>{data.name}</TableCell> */}
                <TableCell>{data.program == 1 ? 'Programado' : 'No Programado'}</TableCell>
                <TableCell>{data.created_at.slice(0, 10)}</TableCell>
                <TableCell>{data.execution_status === 1 ? 'Ejecutado' : 'No Ejecutado'}</TableCell>
                <TableCell>
                  {data.execution_date ? data.execution_date.slice(0, 10) : 'N/A'}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{getTaskTypeName(data.task_type)}</TableCell>
                <TableCell>{getConditionName(data.condition)}</TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Button size="sm"
                    // disabled={!data.attachments || data.attachments.length === 0}
                    onClick={() => { setOpenPDF(true); setRegisterSelected(data) }}>
                    <FaFilePdf />
                  </Button>
                  {/* <Button size="sm"
                    onClick={() => { searchNotices(data.id) }}>
                    <FaBell />
                  </Button> */}
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
                    onClick={() => handleDeleteRegister(index, data.id)}>
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {openNewRegister && <CreateReportDialog openNewRegister={openNewRegister} setOpenNewRegister={setOpenNewRegister} getAllReport={getAllReport} />}

      {openEditRegister && <ReportDialogEdit openEditRegister={openEditRegister} setOpenEditRegister={setOpenEditRegister} registerSelected={registerSelected} setRegisterSelected={setRegisterSelected} getAllReport={getAllReport} />}

      {openViewRegister && <ReportDialogView openViewRegister={openViewRegister} setOpenViewRegister={setOpenViewRegister} registerSelected={registerSelected} setRegisterSelected={setRegisterSelected} />}

      {/* Añadir ruta de trabajo */}
      {openUploadRoute && <UploadReports openUploadReports={openUploadRoute} setOpenUploadReports={setOpenUploadRoute} getAllReport={getAllReport} />}

      {openPDF && <PDFViewer urlPDF={registerSelected?.attachment} openDialog={openPDF} setOpenDialog={setOpenPDF} />}
    </div >

  )
}

export default MonconPage;
