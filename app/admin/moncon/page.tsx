'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import * as XLSX from "xlsx";
import { FaBell, FaCircle, FaEye, FaFilePdf, FaPencil, FaPlus, FaTrash, FaUpload } from 'react-icons/fa6'
import { createMonconReport, deleteMonconReport, getMonconReports, getNoticesByReportId, updateReport } from '../../services/monconServices'
import { getEntities } from '@/app/services/entitiesServices'
import { Entity, ReportType } from '@/lib/types'
import PDFViewer from '../components/PDFViewer'
import ReportDialogView from '../components/moncon/report-dialog-view'
import ReportDialogEdit from '../components/moncon/report-dialog-edit'
import CreateReportDialog from '../components/moncon/CreateReportDialog'
import UploadReports from '../components/moncon/UploadReports'

const MonitoreoCondiciones = () => {
  const [openNewRegister, setOpenNewRegister] = useState<boolean>(false);
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [openUploadRoute, setOpenUploadRoute] = useState<boolean>(false);
  const [registerSelected, setRegisterSelected] = useState<ReportType | null>(null);
  const [openEditRegister, setOpenEditRegister] = useState<boolean>(false);
  const [openViewRegister, setOpenViewRegister] = useState<boolean>(false);
  const [openNoticesDialog, setOpenNoticesDialog] = useState<boolean>(false);
  const [data, setData] = useState<ReportType>({
    id: 0,
    entity: 0,
    name: "",
    program: 2,
    task_type: 0,
    execution_status: 2,
    execution_date: "",
    condition: 1,
    diagnostic: "",
    recomendations: "",
    observations: "",
    attachment: [],
    created_at: "",
  });

  const [routeData, setRouteData] = useState<any[]>([]);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [noticesData, setNoticesData] = useState<any[]>([]);

  const [date, setDate] = useState<Date | undefined>(new Date())

  const getAllReport = () => {
    getMonconReports()
      .then((response) => {
        setGeneralData(response.data);
      });
  }

  useEffect(() => {
    getAllReport();
  }, []);

  const chargeDataFromFile = (file: File | null) => {
    if (!file) {
      alert("Debe seleccionar un archivo Excel");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      // 📘 Leer el libro de Excel
      const wb = XLSX.read(data, { type: "array" });
      // 📗 Tomar la primera hoja
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // 🔄 Convertir a JSON
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      console.log(json);
      setRouteData(json);
    };
    // Leer el archivo como array buffer (necesario para XLSX)
    reader.readAsArrayBuffer(file);
  };

  const addReportsInGeneralData = (newReports: any[]) => {
    setGeneralData((prevData) => [...prevData, ...newReports]);
    setOpenUploadRoute(false);
  }

  const handleDeleteRegister = (index: number, dataId: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      deleteMonconReport(dataId).then((response) => {
        console.log("eliminado", response)
        getAllReport()
      })

      //setGeneralData(updatedData);
    }
  };

  const getTaskTypeName = (taskTypeCode: number) => {
    switch (taskTypeCode) {
      case 1:
        return 'NTD';
      case 2:
        return 'PDM';
      case 3:
        return 'Alineacion';
      case 4:
        return 'Insp. Visual';
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

  const searchNotices = (reportId: number) => {
    getNoticesByReportId(reportId)
      .then((response) => {
        setNoticesData(response.data);
        setOpenNoticesDialog(true);
      });
  }

  //SECCION ENTIDADES
  const [entities, setEntities] = useState<Entity[]>([])

  const createSingleRegister = () => {
    createMonconReport(data)
      .then((response) => {
        console.log("Report created successfully:", response);
        setOpenNewRegister(false);
        getAllReport();
        // Optionally, you can reset the form or update the UI
      })
      .catch((error) => {
        console.error("Error creating report:", error);
      });
  }

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

  const handleSubmit = () => {
    console.log('Submitting data:', {
      ...data,
      program_date: date ? format(date, "yyyy-MM-dd") : "",
    });
    // const formData = new FormData();
    // formData.append("name", data.name || "");
    // formData.append("diagnostic", data.diagnostic || "");
    // formData.append("recommendations", data.recommendations || "");
    // formData.append("task_type", data.task_type);
    // formData.append("execution_status", data.execution_status);
    // formData.append("condition", data.condition);

    // Aquí puedes hacer la llamada a la API para enviar los datos
  }

  console.log("generalData", generalData)

  return (
    <div>
      {/* Cabecera */}
      <div className='w-full flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-lg'>MONITOREO DE CONDICIONES</h1>
        <div className='flex flex-row items-center gap-2'>
          {/* <Input type='file' accept='.xlsx' className='' /> */}
          <Button onClick={() => { console.log('Subiendo archivo', setOpenUploadRoute(true)) }}><FaUpload /> Crear ruta</Button>
          <Button onClick={() => { setOpenNewRegister(true) }}><FaPlus /> Agregar registro</Button>
        </div>
      </div>
      <Separator className='my-4' />
      <div className="h-[85vh] overflow-auto">
        <Table className="bg-white">
          <TableHeader className="bg-gray-300 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[50px]">N°</TableHead>
              {/* <TableHead>NOMBRE REPORTE</TableHead> */}
              <TableHead>PROGRAMA</TableHead>
              <TableHead>FECHA PROGR.</TableHead>
              <TableHead>EJECUCIÓN</TableHead>
              <TableHead>FECHA EJEC.</TableHead>
              <TableHead>EQUIPO/FAMILIA.</TableHead>
              <TableHead>TAG (Comp.)</TableHead>
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
                <TableCell>Molino SAG</TableCell>
                <TableCell>MLS-001-B1</TableCell>
                <TableCell>Bomba</TableCell>
                <TableCell>{getTaskTypeName(data.task_type)}</TableCell>
                <TableCell>{getConditionName(data.condition)}</TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Button size="sm"
                    // disabled={!data.attachments || data.attachments.length === 0}
                    onClick={() => {setOpenPDF(true); setRegisterSelected(data)}}>
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
                      searchNotices(data.id)
                    }}>
                    <FaEye />
                  </Button>
                  <Button size="sm"
                    onClick={() => {
                      setRegisterSelected(data);
                      setOpenEditRegister(true)
                      // searchNotices(data.id)
                    }}>
                    <FaPencil />
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
      {
        openUploadRoute && <UploadReports openUploadReports={openUploadRoute} setOpenUploadReports={setOpenUploadRoute} />
      }

      {
        openPDF && <PDFViewer urlPDF={registerSelected?.attachment} openDialog={openPDF} setOpenDialog={setOpenPDF} />
      }
    </div >

  )
}

export default MonitoreoCondiciones